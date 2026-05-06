/**
 * Freshness Point — cart, drawer, checkout, Razorpay, WhatsApp
 */
(function () {
  "use strict";

  var STORAGE_KEY = "fp_cart";
  var WA_NUMBER = "919129383812";

  function getRazorpayKeyId() {
    return (
      (typeof window !== "undefined" &&
        window.__FP_RAZORPAY_KEY_ID__) ||
      "rzp_test_YOUR_KEY_ID_HERE"
    );
  }

  /**
   * Cart JSON shape: { [itemName]: { name, price, qty } }
   * Migrates legacy { items: { ... } } from older builds.
   */
  function migrateToFlatCart(data) {
    if (!data || typeof data !== "object") return {};
    if (
      data.items !== undefined &&
      typeof data.items === "object" &&
      data.items !== null &&
      !Array.isArray(data.items)
    ) {
      var out = {};
      Object.keys(data.items).forEach(function (k) {
        out[k] = data.items[k];
      });
      return out;
    }
    return Object.assign({}, data);
  }

  function fpReadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return migrateToFlatCart(JSON.parse(raw));
    } catch (e) {
      return {};
    }
  }

  function fpWriteCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Storage full or blocked (private mode) — fail silently
    }
  }

  /** Persist migrated legacy shape once as flat JSON. */
  function ensureFlatCartOnDisk() {
    fpWriteCart(fpReadCart());
  }

  function getCartLines() {
    var cart = fpReadCart();
    var lines = [];
    Object.keys(cart).forEach(function (key) {
      var row = cart[key];
      if (row && row.qty > 0) {
        lines.push({
          name: row.name,
          price: row.price,
          qty: row.qty,
          lineTotal: row.price * row.qty,
        });
      }
    });
    return lines;
  }

  function getSubtotal() {
    return getCartLines().reduce(function (s, l) {
      return s + l.lineTotal;
    }, 0);
  }

  function getTotalCount() {
    return getCartLines().reduce(function (s, l) {
      return s + l.qty;
    }, 0);
  }

  /* ——— DOM refs ——— */
  var fabBtn,
    badgeEl,
    backdrop,
    drawer,
    drawerBody,
    drawerFooter,
    checkoutOverlay,
    checkoutStepEls,
    panel1,
    panel2,
    panelSuccess,
    panelError,
    payCancelMsg;

  var drawerOpen = false;
  var checkoutOpen = false;
  var checkoutStep = 1;
  var checkoutFormSnapshot = {};
  var paymentMethod = "cod";
  var razorpayScriptLoaded = false;
  var razorpayScriptLoading = false;
  var lastRazorpayPaymentId = "";
  var drawerPrevFocus = null;
  var checkoutPrevFocus = null;

  function $(id) {
    return document.getElementById(id);
  }

  function getFocusables(container) {
    if (!container) return [];
    var sel =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice
      .call(container.querySelectorAll(sel))
      .filter(function (el) {
        return el.offsetParent !== null || el.getClientRects().length > 0;
      });
  }

  function trapFocus(container, ev) {
    if (ev.key !== "Tab" || !container) return;
    var list = getFocusables(container);
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (ev.shiftKey) {
      if (document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    }
  }

  function drawerKeyHandler(ev) {
    trapFocus(drawer, ev);
  }

  function checkoutKeyHandler(ev) {
    trapFocus(checkoutOverlay, ev);
  }

  /* ——— SVG icons ——— */
  function svgBowl() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "fp-cart-empty-svg");
    svg.setAttribute("width", "72");
    svg.setAttribute("height", "72");
    svg.setAttribute("viewBox", "0 0 64 64");
    svg.setAttribute("aria-hidden", "true");
    var ellipse = document.createElementNS(ns, "ellipse");
    ellipse.setAttribute("cx", "32");
    ellipse.setAttribute("cy", "38");
    ellipse.setAttribute("rx", "22");
    ellipse.setAttribute("ry", "12");
    ellipse.setAttribute("fill", "none");
    ellipse.setAttribute("stroke", "currentColor");
    ellipse.setAttribute("stroke-width", "2");
    svg.appendChild(ellipse);
    var path = document.createElementNS(ns, "path");
    path.setAttribute(
      "d",
      "M14 36 Q32 18 50 36"
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
    return svg;
  }

  /* ——— Drawer line steppers ——— */
  function buildStepper(name, priceRupee, qty) {
    var wrap = document.createElement("div");
    wrap.className = "fp-cart-stepper";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", name + " quantity");

    var minus = document.createElement("button");
    minus.type = "button";
    minus.setAttribute("aria-label", "Decrease quantity");
    minus.textContent = "−";

    var num = document.createElement("span");
    num.textContent = String(qty);

    var plus = document.createElement("button");
    plus.type = "button";
    plus.setAttribute("aria-label", "Increase quantity");
    plus.textContent = "+";

    minus.addEventListener("click", function () {
      if (window.fpCart) window.fpCart.removeOne(name);
    });
    plus.addEventListener("click", function () {
      if (window.fpCart) window.fpCart.addOne(name);
    });

    wrap.appendChild(minus);
    wrap.appendChild(num);
    wrap.appendChild(plus);
    return wrap;
  }

  function updateBadge() {
    if (!badgeEl) return;
    var n = getTotalCount();
    badgeEl.textContent = String(n);
    if (n <= 0) {
      badgeEl.classList.add("fp-cart-badge--hidden");
    } else {
      badgeEl.classList.remove("fp-cart-badge--hidden");
    }
  }

  /* ——— Drawer ——— */
  function openDrawer() {
    drawerPrevFocus = document.activeElement;
    drawerOpen = true;
    backdrop.classList.add("fp-cart-drawer-backdrop--visible");
    drawer.classList.add("fp-cart-drawer--open");
    backdrop.setAttribute("aria-hidden", "false");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderDrawerContent();
    document.addEventListener("keydown", drawerKeyHandler);
    setTimeout(function () {
      var fb = getFocusables(drawer)[0];
      if (fb) fb.focus();
    }, 50);
  }

  function closeDrawer() {
    drawerOpen = false;
    backdrop.classList.remove("fp-cart-drawer-backdrop--visible");
    drawer.classList.remove("fp-cart-drawer--open");
    backdrop.setAttribute("aria-hidden", "true");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", drawerKeyHandler);
    if (drawerPrevFocus && typeof drawerPrevFocus.focus === "function") {
      drawerPrevFocus.focus();
    }
  }

  function renderDrawerContent() {
    if (!drawerBody || !drawerFooter) return;

    var lines = getCartLines();

    if (lines.length === 0) {
      drawerFooter.style.display = "none";
      drawerBody.innerHTML = "";
      var empty = document.createElement("div");
      empty.className = "fp-cart-empty";
      empty.appendChild(svgBowl());
      var p = document.createElement("p");
      p.className = "fp-cart-empty-msg";
      p.textContent = "Your cart is empty";
      empty.appendChild(p);
      var browse = document.createElement("button");
      browse.type = "button";
      browse.className = "fp-cart-btn-secondary";
      browse.textContent = "Browse Menu";
      browse.addEventListener("click", function () {
        closeDrawer();
        var menu = $("menu");
        if (menu) menu.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      empty.appendChild(browse);
      drawerBody.appendChild(empty);
      return;
    }

    drawerFooter.style.display = "";
    drawerBody.innerHTML = "";

    lines.forEach(function (line) {
      var row = document.createElement("div");
      row.className = "fp-cart-drawer-item";

      var title = document.createElement("div");
      title.className = "fp-cart-drawer-item-name";
      title.textContent = line.name;

      var unit = document.createElement("div");
      unit.className = "fp-cart-drawer-item-unit";
      unit.textContent = "₹" + line.price + " each";

      var controls = document.createElement("div");
      controls.className = "fp-cart-drawer-item-controls";
      controls.appendChild(buildStepper(line.name, line.price, line.qty));

      var lt = document.createElement("div");
      lt.className = "fp-cart-drawer-line-total";
      lt.textContent = "₹" + line.lineTotal;

      row.appendChild(title);
      row.appendChild(unit);
      row.appendChild(controls);
      row.appendChild(lt);
      drawerBody.appendChild(row);
    });

    var subTot = $("fp-cart-drawer-subtotal");
    if (subTot) subTot.textContent = "₹" + getSubtotal();
  }

  function fpUpdateFABBadge() {
    updateBadge();
    if (drawerOpen) renderDrawerContent();
  }

  window.fpCart = {
    addItem: function (name, price) {
      var cart = fpReadCart();
      if (cart[name]) {
        cart[name].qty += 1;
      } else {
        cart[name] = { name: name, price: price, qty: 1 };
      }
      fpWriteCart(cart);
      window.dispatchEvent(new Event("fp-cart-updated"));
      fpUpdateFABBadge();
    },
    addOne: function (name) {
      var cart = fpReadCart();
      if (cart[name]) {
        cart[name].qty += 1;
        fpWriteCart(cart);
        window.dispatchEvent(new Event("fp-cart-updated"));
        fpUpdateFABBadge();
      }
    },
    removeOne: function (name) {
      var cart = fpReadCart();
      if (cart[name]) {
        cart[name].qty -= 1;
        if (cart[name].qty <= 0) delete cart[name];
        fpWriteCart(cart);
        window.dispatchEvent(new Event("fp-cart-updated"));
        fpUpdateFABBadge();
      }
    },
    getCart: function () {
      return fpReadCart();
    },
    clearCart: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Storage blocked — fail silently
      }
      window.dispatchEvent(new Event("fp-cart-updated"));
      fpUpdateFABBadge();
    },
  };

  ensureFlatCartOnDisk();

  /* ——— Checkout UI ——— */
  function updateCheckoutStepperUI() {
    if (!checkoutStepEls) return;
    for (var i = 0; i < checkoutStepEls.length; i++) {
      var el = checkoutStepEls[i];
      var step = parseInt(el.getAttribute("data-step"), 10);
      el.classList.remove(
        "fp-checkout-step-pill--active",
        "fp-checkout-step-pill--done"
      );
      if (checkoutStep >= 3 || step < checkoutStep) {
        el.classList.add("fp-checkout-step-pill--done");
      } else if (step === checkoutStep) {
        el.classList.add("fp-checkout-step-pill--active");
      }
    }

    if (checkoutStep < 3) {
      if (panelSuccess) {
        panelSuccess.hidden = true;
        panelSuccess.classList.remove("fp-checkout-panel--active");
      }
      if (panelError) {
        panelError.hidden = true;
        panelError.classList.remove("fp-checkout-panel--active");
      }
    }

    [panel1, panel2].forEach(function (p) {
      if (p) {
        p.classList.remove("fp-checkout-panel--active");
        p.hidden = true;
      }
    });

    if (checkoutStep === 1 && panel1) {
      panel1.hidden = false;
      panel1.classList.add("fp-checkout-panel--active");
    } else if (checkoutStep === 2 && panel2) {
      panel2.hidden = false;
      panel2.classList.add("fp-checkout-panel--active");
    } else if (checkoutStep >= 3 && panelSuccess) {
      panelSuccess.hidden = false;
      panelSuccess.classList.add("fp-checkout-panel--active");
    }
  }

  function openCheckout() {
    closeDrawer();
    checkoutPrevFocus = document.activeElement;
    checkoutOpen = true;
    checkoutStep = 1;
    checkoutOverlay.classList.add("fp-checkout-overlay--open");
    checkoutOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    hidePayCancelledBanner();
    hidePanelsSuccessError();
    clearStep1Errors();
    paymentMethod = "cod";
    syncPaymentRadios();
    updateCheckoutStepperUI();
    document.addEventListener("keydown", checkoutKeyHandler);
    setTimeout(function () {
      var f = getFocusables(panel1)[0];
      if (f) f.focus();
    }, 50);
  }

  function closeCheckout() {
    checkoutOpen = false;
    checkoutOverlay.classList.remove("fp-checkout-overlay--open");
    checkoutOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", checkoutKeyHandler);
    hidePanelsSuccessError();
    if (checkoutPrevFocus && typeof checkoutPrevFocus.focus === "function") {
      checkoutPrevFocus.focus();
    }
  }

  function hidePanelsSuccessError() {
    if (panelSuccess) {
      panelSuccess.hidden = true;
      panelSuccess.classList.remove("fp-checkout-panel--active");
    }
    if (panelError) {
      panelError.hidden = true;
      panelError.classList.remove("fp-checkout-panel--active");
    }
    if (panel1) panel1.hidden = checkoutStep !== 1;
    if (panel2) panel2.hidden = checkoutStep !== 2;
  }

  function showSuccessPanel() {
    checkoutStep = 3;
    updateCheckoutStepperUI();
    setTimeout(function () {
      var fb = getFocusables(panelSuccess)[0];
      if (fb) fb.focus();
    }, 80);
  }

  function showErrorPanel(title, code, desc) {
    [panel1, panel2].forEach(function (p) {
      if (p) {
        p.hidden = true;
        p.classList.remove("fp-checkout-panel--active");
      }
    });
    if (panelSuccess) {
      panelSuccess.hidden = true;
      panelSuccess.classList.remove("fp-checkout-panel--active");
    }
    if (panelError) {
      panelError.hidden = false;
      panelError.classList.add("fp-checkout-panel--active");
      var t = $("fp-co-error-title");
      var c = $("fp-co-error-detail");
      if (t) t.textContent = title || "Payment failed";
      if (c)
        c.textContent =
          (code ? "[" + code + "] " : "") + (desc || "Please try again.");
    }
    setTimeout(function () {
      var fb = getFocusables(panelError)[0];
      if (fb) fb.focus();
    }, 80);
  }

  function hidePayCancelledBanner() {
    if (payCancelMsg) {
      payCancelMsg.classList.remove("fp-checkout-inline-msg--visible");
      payCancelMsg.innerHTML = "";
    }
  }

  function showPayCancelledBanner() {
    if (!payCancelMsg) return;
    payCancelMsg.innerHTML = "";
    payCancelMsg.classList.add("fp-checkout-inline-msg--visible");
    var txt = document.createElement("p");
    txt.textContent =
      "Payment cancelled. Your cart is saved.";
    payCancelMsg.appendChild(txt);
    var actions = document.createElement("div");
    actions.className = "fp-checkout-inline-actions";

    var retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Retry Payment";
    retry.addEventListener("click", function () {
      hidePayCancelledBanner();
    });

    var sw = document.createElement("button");
    sw.type = "button";
    sw.textContent = "Switch to COD";
    sw.addEventListener("click", function () {
      hidePayCancelledBanner();
      paymentMethod = "cod";
      syncPaymentRadios();
    });

    actions.appendChild(retry);
    actions.appendChild(sw);
    payCancelMsg.appendChild(actions);
  }

  function syncPaymentRadios() {
    document.querySelectorAll('input[name="fp-co-pay"]').forEach(function (
      inp
    ) {
      inp.checked =
        paymentMethod === "online"
          ? inp.value === "online"
          : inp.value === "cod";
    });
    updatePayCardSelection();
    updatePlaceOrderButtonLabel();
  }

  function updatePayCardSelection() {
    document.querySelectorAll("[data-fp-pay-card]").forEach(function (card) {
      var input = card.querySelector('input[type="radio"]');
      card.classList.toggle(
        "fp-checkout-pay-card--selected",
        !!(input && input.checked)
      );
    });
  }

  function updatePlaceOrderButtonLabel() {
    var btn = $("fp-co-place-order");
    if (!btn) return;
    btn.textContent =
      paymentMethod === "cod" ? "Place Order" : "Pay & Place Order";
  }

  function loadRazorpayScript(cb) {
    if (typeof Razorpay !== "undefined") {
      cb();
      return;
    }
    if (razorpayScriptLoaded) {
      cb();
      return;
    }
    if (razorpayScriptLoading) {
      var iv = setInterval(function () {
        if (typeof Razorpay !== "undefined") {
          clearInterval(iv);
          razorpayScriptLoaded = true;
          razorpayScriptLoading = false;
          cb();
        }
      }, 50);
      return;
    }
    razorpayScriptLoading = true;
    var script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = function () {
      razorpayScriptLoaded = true;
      razorpayScriptLoading = false;
      cb();
    };
    script.onerror = function () {
      razorpayScriptLoading = false;
      alert("Could not load payment SDK. Check your connection.");
    };
    document.body.appendChild(script);
  }

  /* ——— Validation step 1 ——— */
  function clearStep1Errors() {
    document.querySelectorAll("#fp-co-panel-1 .fp-checkout-field").forEach(function (f) {
      f.classList.remove("fp-checkout-field--error");
    });
  }

  function setFieldError(fieldId, msg) {
    var field = $(fieldId);
    if (!field) return;
    var wrap = field.closest(".fp-checkout-field");
    if (!wrap) return;
    wrap.classList.add("fp-checkout-field--error");
    var err = wrap.querySelector(".fp-checkout-error");
    if (err) err.textContent = msg;
  }

  function validateStep1() {
    clearStep1Errors();
    var ok = true;
    var name = ($("fp-co-fullname") && $("fp-co-fullname").value.trim()) || "";
    var mobile = ($("fp-co-mobile") && $("fp-co-mobile").value.trim()) || "";
    var city = ($("fp-co-city") && $("fp-co-city").value) || "";
    var addr =
      ($("fp-co-address") && $("fp-co-address").value.trim()) || "";
    var landmark =
      ($("fp-co-landmark") && $("fp-co-landmark").value.trim()) || "";
    var pin =
      ($("fp-co-pincode") && $("fp-co-pincode").value.trim()) || "";

    if (!name) {
      setFieldError("fp-co-fullname", "Full name is required.");
      ok = false;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFieldError(
        "fp-co-mobile",
        "Enter a valid 10-digit Indian mobile number."
      );
      ok = false;
    }
    if (city !== "Lucknow" && city !== "Pratapgarh") {
      setFieldError("fp-co-city", "Please select a city.");
      ok = false;
    }
    if (addr.length < 20) {
      setFieldError(
        "fp-co-address",
        "Address must be at least 20 characters."
      );
      ok = false;
    }
    if (!/^\d{6}$/.test(pin)) {
      setFieldError("fp-co-pincode", "Enter a valid 6-digit pincode.");
      ok = false;
    }

    if (ok) {
      checkoutFormSnapshot = {
        fullName: name,
        mobile: mobile,
        city: city,
        address: addr,
        landmark: landmark || "Not provided",
        pincode: pin,
        instructions:
          ($("fp-co-notes") ? $("fp-co-notes").value.trim() : "") || "None",
      };
    }
    return ok;
  }

  /* ——— WhatsApp ——— */
  function formatOrderTimeIST() {
    var d = new Date();
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(d);
    var map = {};
    parts.forEach(function (p) {
      map[p.type] = p.value;
    });
    return (
      map.day +
      "/" +
      map.month +
      "/" +
      map.year +
      ", " +
      map.hour +
      ":" +
      map.minute +
      " " +
      (map.dayPeriod || "").toUpperCase() +
      " IST"
    );
  }

  function buildWhatsAppMessage(paymentLine) {
    var lines = getCartLines();
    var detailLines = lines.map(function (l) {
      return "• " + l.name + " × " + l.qty + " — ₹" + l.lineTotal;
    });
    var subtotal = getSubtotal();
    var snap = checkoutFormSnapshot;

    return (
      "🛒 *NEW ORDER — Freshness Point*\n\n" +
      "👤 *Customer:* " +
      snap.fullName +
      "\n" +
      "📱 *Mobile:* " +
      snap.mobile +
      "\n" +
      "📍 *City:* " +
      snap.city +
      "\n" +
      "🏠 *Address:* " +
      snap.address +
      "\n" +
      "🗺️ *Landmark:* " +
      snap.landmark +
      "\n" +
      "📮 *Pincode:* " +
      snap.pincode +
      "\n\n" +
      "🍽️ *Order Details:*\n" +
      detailLines.join("\n") +
      "\n\n" +
      "💰 *Subtotal:* ₹" +
      subtotal +
      "\n" +
      "💳 *Payment:* " +
      paymentLine +
      "\n\n" +
      "📝 *Special Instructions:* " +
      snap.instructions +
      "\n\n" +
      "⏰ *Order Time:* " +
      formatOrderTimeIST() +
      "\n\n" +
      "_This is an automated order from freshnesspoint.com_"
    );
  }

  function sendWhatsAppMessage(paymentLine) {
    var text = buildWhatsAppMessage(paymentLine);
    var url =
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function fillSuccessSummary() {
    var el = $("fp-co-success-summary");
    if (!el) return;
    var lines = getCartLines();
    var html =
      "<strong>Customer:</strong> " +
      checkoutFormSnapshot.fullName +
      "<br>" +
      "<strong>Total:</strong> ₹" +
      getSubtotal() +
      "<br>" +
      "<strong>Items:</strong><br>" +
      lines
        .map(function (l) {
          return l.name + " × " + l.qty + " — ₹" + l.lineTotal;
        })
        .join("<br>");
    el.innerHTML = html;
  }

  function showConfirmationScreen(isPaid, razorpayId) {
    fillSuccessSummary();
    showSuccessPanel();
    var paymentLine =
      isPaid && razorpayId
        ? "Paid via Razorpay (ID: " + razorpayId + ")"
        : "Cash on Delivery";
    sendWhatsAppMessage(paymentLine);
    window.fpCart.clearCart();
  }

  /* ——— Razorpay pay ——— */
  function startRazorpayCheckout() {
    var subtotal = getSubtotal();
    var amountPaise = Math.round(subtotal * 100);
    if (amountPaise < 100) {
      alert("Minimum order value applies for online payment.");
      return;
    }

    loadRazorpayScript(function () {
      fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_paise: amountPaise,
          receipt: "",
          customerName: checkoutFormSnapshot.fullName,
          customerPhone: checkoutFormSnapshot.mobile,
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Order API failed");
          return res.json();
        })
        .then(function (order) {
          var options = {
            key: getRazorpayKeyId(),
            amount: order.amount,
            currency: "INR",
            name: "Freshness Point",
            description: "Food Order",
            image: "/assets/logo.png",
            order_id: order.id,
            prefill: {
              name: checkoutFormSnapshot.fullName,
              contact: checkoutFormSnapshot.mobile,
              email: "",
            },
            theme: { color: "#2D7A3A" },
            modal: {
              ondismiss: function () {
                showPayCancelledBanner();
              },
            },
            handler: function (response) {
              lastRazorpayPaymentId =
                response.razorpay_payment_id || "";
              showConfirmationScreen(true, lastRazorpayPaymentId);
            },
          };

          var rzp = new Razorpay(options);
          rzp.on("payment.failed", function (response) {
            var err = (response && response.error) || {};
            showErrorPanel(
              "Payment failed",
              err.code || "",
              err.description || ""
            );
          });
          rzp.open();
        })
        .catch(function () {
          alert(
            "Unable to start payment. Ensure the order API is deployed and keys are configured."
          );
        });
    });
  }

  /* ——— Step 2 summary ——— */
  function renderStep2Summary() {
    var box = $("fp-co-del-summary");
    if (!box) return;
    var s = checkoutFormSnapshot;
    box.innerHTML =
      "<strong>Name:</strong> " +
      s.fullName +
      "<br>" +
      "<strong>City:</strong> " +
      s.city +
      "<br>" +
      "<strong>Address:</strong> " +
      s.address +
      "<br>" +
      "<strong>Landmark:</strong> " +
      s.landmark +
      "<br>" +
      "<strong>Pincode:</strong> " +
      s.pincode;

    var list = $("fp-co-order-lines");
    if (list) {
      list.innerHTML = "";
      getCartLines().forEach(function (l) {
        var row = document.createElement("div");
        row.className = "fp-checkout-order-line";
        row.innerHTML =
          "<span>" +
          l.name +
          " × " +
          l.qty +
          "</span><span>₹" +
          l.lineTotal +
          "</span>";
        list.appendChild(row);
      });
    }
    var subEl = $("fp-co-subtotal-val");
    if (subEl) subEl.textContent = "₹" + getSubtotal();
    var grandEl = $("fp-co-grand-val");
    if (grandEl) grandEl.textContent = "₹" + getSubtotal();
  }

  /* ——— Init bindings ——— */
  function init() {
    fabBtn = $("fp-cart-fab");
    badgeEl = $("fp-cart-badge");
    backdrop = $("fp-cart-drawer-backdrop");
    drawer = $("fp-cart-drawer");
    drawerBody = $("fp-cart-drawer-body");
    drawerFooter = $("fp-cart-drawer-footer");

    checkoutOverlay = $("fp-checkout-overlay");
    checkoutStepEls = document.querySelectorAll("[data-fp-checkout-step]");
    panel1 = $("fp-co-panel-1");
    panel2 = $("fp-co-panel-2");
    panelSuccess = $("fp-co-panel-success");
    panelError = $("fp-co-panel-error");
    payCancelMsg = $("fp-co-pay-cancel-msg");

    if (fabBtn) {
      fabBtn.addEventListener("click", openDrawer);
    }

    var drawerClose = $("fp-cart-drawer-close");
    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    if (backdrop)
      backdrop.addEventListener("click", function () {
        closeDrawer();
      });

    var proceed = $("fp-cart-proceed");
    if (proceed)
      proceed.addEventListener("click", function () {
        if (getCartLines().length === 0) return;
        openCheckout();
      });

    $("fp-co-continue-1") &&
      $("fp-co-continue-1").addEventListener("click", function () {
        if (validateStep1()) {
          checkoutStep = 2;
          renderStep2Summary();
          updateCheckoutStepperUI();
          setTimeout(function () {
            var f = getFocusables(panel2)[0];
            if (f) f.focus();
          }, 50);
        }
      });

    $("fp-co-back-2") &&
      $("fp-co-back-2").addEventListener("click", function () {
        checkoutStep = 1;
        hidePayCancelledBanner();
        updateCheckoutStepperUI();
        setTimeout(function () {
          var f = getFocusables(panel1)[0];
          if (f) f.focus();
        }, 50);
      });

    document.querySelectorAll('input[name="fp-co-pay"]').forEach(function (
      inp
    ) {
      inp.addEventListener("change", function () {
        paymentMethod = inp.value === "online" ? "online" : "cod";
        if (paymentMethod === "online") {
          loadRazorpayScript(function () {});
        }
        updatePayCardSelection();
        updatePlaceOrderButtonLabel();
      });
    });

    $("fp-co-place-order") &&
      $("fp-co-place-order").addEventListener("click", function () {
        if (paymentMethod !== "cod" && paymentMethod !== "online") {
          alert("Please select a payment method.");
          return;
        }
        if (paymentMethod === "cod") {
          showConfirmationScreen(false, "");
          return;
        }
        startRazorpayCheckout();
      });

    $("fp-co-back-home") &&
      $("fp-co-back-home").addEventListener("click", function () {
        closeCheckout();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    $("fp-co-retry-pay") &&
      $("fp-co-retry-pay").addEventListener("click", function () {
        checkoutStep = 2;
        hidePanelsSuccessError();
        if (panel2) {
          panel2.hidden = false;
          panel2.classList.add("fp-checkout-panel--active");
        }
        updateCheckoutStepperUI();
        startRazorpayCheckout();
      });

    $("fp-co-error-to-cod") &&
      $("fp-co-error-to-cod").addEventListener("click", function () {
        paymentMethod = "cod";
        syncPaymentRadios();
        checkoutStep = 2;
        hidePanelsSuccessError();
        if (panel2) {
          panel2.hidden = false;
          panel2.classList.add("fp-checkout-panel--active");
        }
        updateCheckoutStepperUI();
      });

    updateBadge();
    syncPaymentRadios();

    if (drawer)
      drawer.setAttribute("aria-labelledby", "fp-cart-drawer-title");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
