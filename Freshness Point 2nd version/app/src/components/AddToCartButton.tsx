import { useCallback, useEffect, useState } from "react";

export type AddToCartButtonProps = {
  itemName: string;
  itemPrice: number;
};

function readQty(itemName: string): number {
  try {
    const raw = localStorage.getItem("fp_cart");
    if (!raw) return 0;
    const cart = JSON.parse(raw) as Record<string, unknown>;
    if (
      cart.items &&
      typeof cart.items === "object" &&
      cart.items !== null &&
      !Array.isArray(cart.items)
    ) {
      const row = (cart.items as Record<string, { qty?: number }>)[itemName];
      return typeof row?.qty === "number" ? row.qty : 0;
    }
    const row = cart[itemName] as { qty?: number } | undefined;
    return typeof row?.qty === "number" ? row.qty : 0;
  } catch {
    return 0;
  }
}

export default function AddToCartButton({
  itemName,
  itemPrice,
}: AddToCartButtonProps) {
  const [qty, setQty] = useState(() => readQty(itemName));

  useEffect(() => {
    setQty(readQty(itemName));
  }, [itemName]);

  useEffect(() => {
    const sync = () => setQty(readQty(itemName));
    window.addEventListener("fp-cart-updated", sync);
    return () => window.removeEventListener("fp-cart-updated", sync);
  }, [itemName]);

  const onAdd = useCallback(() => {
    window.fpCart?.addItem(itemName, itemPrice);
    setQty(readQty(itemName));
  }, [itemName, itemPrice]);

  const onMinus = useCallback(() => {
    window.fpCart?.removeOne(itemName);
    setQty(readQty(itemName));
  }, [itemName]);

  const onPlus = useCallback(() => {
    window.fpCart?.addOne(itemName);
    setQty(readQty(itemName));
  }, [itemName]);

  if (qty <= 0) {
    return (
      <button type="button" className="fp-cart-react-add" onClick={onAdd}>
        + Add
      </button>
    );
  }

  return (
    <div
      className="fp-cart-react-stepper"
      role="group"
      aria-label={`${itemName} quantity`}
    >
      <button
        type="button"
        className="fp-cart-react-step fp-cart-react-step--minus"
        aria-label="Decrease quantity"
        onClick={onMinus}
      >
        −
      </button>
      <span className="fp-cart-react-qty">{qty}</span>
      <button
        type="button"
        className="fp-cart-react-step fp-cart-react-step--plus"
        aria-label="Increase quantity"
        onClick={onPlus}
      >
        +
      </button>
    </div>
  );
}
