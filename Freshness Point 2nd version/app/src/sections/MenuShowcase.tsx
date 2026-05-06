import { useState, useRef } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

/** Filter tab IDs (excluding "All"); must match menu item `category`. */
type MenuCategory =
  | "Drinks"
  | "Snacks"
  | "Sandwich"
  | "Fried Rice"
  | "Chowmein"
  | "Burgers"
  | "Pizza"
  | "Pasta"
  | "Maggi"
  | "Extras"
  | "Combos";

type CategoryTab = "All" | MenuCategory;

type MenuBadgeType = "Bestseller" | "Recommended" | "Special";

type MenuItem = {
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
  badge: MenuBadgeType | null;
  image: string;
  isCombo?: boolean;
  isFeatured?: boolean;
};

function placeholderImg(name: string): string {
  const text = encodeURIComponent(name).replace(/%20/g, "+");
  return `https://placehold.co/400x300/fdf6ec/1a2e1a?text=${text}`;
}

const categories: CategoryTab[] = [
  "All",
  "Drinks",
  "Snacks",
  "Sandwich",
  "Fried Rice",
  "Chowmein",
  "Burgers",
  "Pizza",
  "Pasta",
  "Maggi",
  "Extras",
  "Combos",
];

const menuItems: MenuItem[] = [
  // DRINKS
  {
    name: "Normal Tea",
    price: 10,
    category: "Drinks",
    description: "Classic chai, brewed fresh",
    badge: null,
    image: placeholderImg("Normal Tea"),
    isFeatured: false,
  },
  {
    name: "Premium Tea",
    price: 20,
    category: "Drinks",
    description: "Kadak chai made the right way",
    badge: null,
    image: "/menu-tea.jpg",
    isFeatured: true,
  },
  {
    name: "Coffee",
    price: 30,
    category: "Drinks",
    description: "Hot, freshly brewed coffee",
    badge: null,
    image: placeholderImg("Coffee"),
    isFeatured: false,
  },
  {
    name: "Sikanji",
    price: 40,
    category: "Drinks",
    description: "Refreshing Indian lemonade with spices",
    badge: null,
    image: placeholderImg("Sikanji"),
    isFeatured: false,
  },
  {
    name: "Iced Cold Coffee",
    price: 80,
    category: "Drinks",
    description: "Chilled, creamy, refreshing",
    badge: null,
    image: "/menu-cold-coffee.jpg",
    isFeatured: true,
  },
  {
    name: "Special Lassi",
    price: 50,
    category: "Drinks",
    description: "Thick, creamy, probiotic-rich",
    badge: "Bestseller",
    image: "/hero-lassi.jpg",
    isFeatured: true,
  },

  // SNACKS
  {
    name: "Bun Makhan",
    price: 30,
    category: "Snacks",
    description: "Soft bun with fresh butter",
    badge: null,
    image: placeholderImg("Bun Makhan"),
    isFeatured: false,
  },
  {
    name: "Bread Pakoda",
    price: 40,
    category: "Snacks",
    description: "Crispy fried bread pakoda, golden & hot",
    badge: null,
    image: placeholderImg("Bread Pakoda"),
    isFeatured: false,
  },
  {
    name: "Paneer Bread Pakoda",
    price: 50,
    category: "Snacks",
    description: "Bread pakoda stuffed with fresh paneer",
    badge: null,
    image: placeholderImg("Paneer Bread Pakoda"),
    isFeatured: false,
  },
  {
    name: "French Fries",
    price: 60,
    category: "Snacks",
    description: "Crispy golden fries, lightly salted",
    badge: null,
    image: placeholderImg("French Fries"),
    isFeatured: false,
  },
  {
    name: "Paneer Pakoda",
    price: 99,
    category: "Snacks",
    description: "Juicy paneer coated in spiced batter",
    badge: null,
    image: placeholderImg("Paneer Pakoda"),
    isFeatured: false,
  },

  // SANDWICH
  {
    name: "Veg Toast",
    price: 50,
    category: "Sandwich",
    description: "Classic toasted vegetable sandwich",
    badge: null,
    image: placeholderImg("Veg Toast"),
    isFeatured: false,
  },
  {
    name: "Veg Mayo Toast",
    price: 60,
    category: "Sandwich",
    description: "Toasted sandwich with creamy mayo & veggies",
    badge: null,
    image: placeholderImg("Veg Mayo Toast"),
    isFeatured: false,
  },

  // FRIED RICE
  {
    name: "Veg Fried Rice (Half)",
    price: 40,
    category: "Fried Rice",
    description: "Wok-tossed with fresh veggies — half portion",
    badge: "Bestseller",
    image: "/menu-fried-rice.jpg",
    isFeatured: false,
  },
  {
    name: "Veg Fried Rice (Full)",
    price: 70,
    category: "Fried Rice",
    description: "Wok-tossed with fresh veggies — full portion",
    badge: "Bestseller",
    image: "/menu-fried-rice.jpg",
    isFeatured: true,
  },
  {
    name: "Paneer Fried Rice (Half)",
    price: 50,
    category: "Fried Rice",
    description: "Fried rice loaded with fresh paneer — half portion",
    badge: null,
    image: placeholderImg("Paneer Fried Rice Half"),
    isFeatured: false,
  },
  {
    name: "Paneer Fried Rice (Full)",
    price: 90,
    category: "Fried Rice",
    description: "Fried rice loaded with fresh paneer — full portion",
    badge: null,
    image: placeholderImg("Paneer Fried Rice Full"),
    isFeatured: false,
  },
  {
    name: "Freshness Special Fried Rice (Half)",
    price: 60,
    category: "Fried Rice",
    description: "Our signature fried rice with secret masala — half",
    badge: "Special",
    image: "/hero-food.jpg",
    isFeatured: false,
  },
  {
    name: "Freshness Special Fried Rice (Full)",
    price: 110,
    category: "Fried Rice",
    description: "Our signature fried rice with secret masala — full",
    badge: "Special",
    image: "/hero-food.jpg",
    isFeatured: true,
  },

  // CHOWMEIN
  {
    name: "Veg Chowmein (Half)",
    price: 35,
    category: "Chowmein",
    description: "Desi-style noodles with fresh veggies — half portion",
    badge: "Recommended",
    image: "/menu-chowmein.jpg",
    isFeatured: false,
  },
  {
    name: "Veg Chowmein (Full)",
    price: 60,
    category: "Chowmein",
    description: "Desi-style noodles with fresh veggies — full portion",
    badge: "Recommended",
    image: "/menu-chowmein.jpg",
    isFeatured: true,
  },
  {
    name: "Paneer Chowmein (Half)",
    price: 45,
    category: "Chowmein",
    description: "Chowmein tossed with juicy paneer chunks — half portion",
    badge: null,
    image: placeholderImg("Paneer Chowmein Half"),
    isFeatured: false,
  },
  {
    name: "Paneer Chowmein (Full)",
    price: 80,
    category: "Chowmein",
    description: "Chowmein tossed with juicy paneer chunks — full portion",
    badge: null,
    image: placeholderImg("Paneer Chowmein Full"),
    isFeatured: false,
  },
  {
    name: "Freshness Special Chowmein (Half)",
    price: 55,
    category: "Chowmein",
    description: "Our special chowmein with extra toppings — half portion",
    badge: "Special",
    image: placeholderImg("Freshness Chowmein Half"),
    isFeatured: false,
  },
  {
    name: "Freshness Special Chowmein (Full)",
    price: 100,
    category: "Chowmein",
    description: "Our special chowmein with extra toppings — full portion",
    badge: "Special",
    image: placeholderImg("Freshness Chowmein Full"),
    isFeatured: false,
  },

  // BURGERS
  {
    name: "Aloo Tikki Burger",
    price: 49,
    category: "Burgers",
    description: "Crispy patty, soft bun, green chutney",
    badge: null,
    image: "/menu-burger.jpg",
    isFeatured: true,
  },
  {
    name: "Paneer Tikki Burger",
    price: 59,
    category: "Burgers",
    description: "Freshness Special — bold & spicy paneer patty",
    badge: null,
    image: placeholderImg("Paneer Tikki Burger"),
    isFeatured: false,
  },
  {
    name: "Cheese Burger",
    price: 69,
    category: "Burgers",
    description: "Classic burger loaded with melted cheese",
    badge: null,
    image: placeholderImg("Cheese Burger"),
    isFeatured: false,
  },

  // PIZZA
  {
    name: "Simple Veg Pizza",
    price: 99,
    category: "Pizza",
    description: "Classic Margherita-style, all fresh",
    badge: null,
    image: "/menu-pizza.jpg",
    isFeatured: true,
  },
  {
    name: "Combo Delight Pizza",
    price: 149,
    category: "Pizza",
    description: "Loaded with mixed veggies & cheese",
    badge: null,
    image: "/menu-pizza.jpg",
    isFeatured: false,
  },
  {
    name: "Tikha Tikha Pizza (Freshness Special)",
    price: 199,
    category: "Pizza",
    description: "Freshness Special — bold & spicy",
    badge: "Special",
    image: "/menu-pizza.jpg",
    isFeatured: false,
  },

  // PASTA
  {
    name: "White Sauce Pasta",
    price: 99,
    category: "Pasta",
    description: "Creamy white sauce pasta, freshly made",
    badge: null,
    image: placeholderImg("White Sauce Pasta"),
    isFeatured: false,
  },
  {
    name: "Pink Sauce Pasta",
    price: 79,
    category: "Pasta",
    description: "Tangy pink sauce pasta with a rich texture",
    badge: null,
    image: placeholderImg("Pink Sauce Pasta"),
    isFeatured: false,
  },

  // MAGGI
  {
    name: "Normal Maggi",
    price: 60,
    category: "Maggi",
    description: "Classic Maggi noodles, hot and comforting",
    badge: null,
    image: placeholderImg("Normal Maggi"),
    isFeatured: false,
  },
  {
    name: "Freshness Special Maggi",
    price: 80,
    category: "Maggi",
    description: "Maggi upgraded with our special masala & toppings",
    badge: "Special",
    image: placeholderImg("Freshness Special Maggi"),
    isFeatured: false,
  },

  // EXTRAS
  {
    name: "Chilli Paneer (Half)",
    price: 100,
    category: "Extras",
    description: "Indo-Chinese chilli paneer — half portion",
    badge: null,
    image: placeholderImg("Chilli Paneer Half"),
    isFeatured: false,
  },
  {
    name: "Chilli Paneer (Full)",
    price: 190,
    category: "Extras",
    description: "Indo-Chinese chilli paneer — full portion",
    badge: null,
    image: placeholderImg("Chilli Paneer Full"),
    isFeatured: false,
  },
  {
    name: "Chilli Potato (Half)",
    price: 80,
    category: "Extras",
    description: "Crispy chilli potato, tangy & spicy — half",
    badge: null,
    image: placeholderImg("Chilli Potato Half"),
    isFeatured: false,
  },
  {
    name: "Chilli Potato (Full)",
    price: 150,
    category: "Extras",
    description: "Crispy chilli potato, tangy & spicy — full",
    badge: null,
    image: placeholderImg("Chilli Potato Full"),
    isFeatured: false,
  },

  // COMBOS
  {
    name: "Best Combo — Fried Rice + Chilli Paneer + Tea",
    price: 130,
    category: "Combos",
    description: "Our bestselling combo meal. Save big, eat fresh.",
    badge: "Bestseller",
    image: placeholderImg("Best Combo"),
    isCombo: true,
    isFeatured: true,
  },
];

// ─── Featured order (the 9 hero items in exact display order) ───────────────
const FEATURED_ORDER = [
  "Special Lassi",
  "Veg Fried Rice (Full)",
  "Veg Chowmein (Full)",
  "Premium Tea",
  "Freshness Special Fried Rice (Full)",
  "Aloo Tikki Burger",
  "Simple Veg Pizza",
  "Iced Cold Coffee",
  "Best Combo — Fried Rice + Chilli Paneer + Tea",
];

const featuredItems: MenuItem[] = FEATURED_ORDER.map(
  (n) => menuItems.find((i) => i.name === n)!
).filter(Boolean);

// ─── Expanded section: remaining items grouped by category in specified order ─
const EXPANDED_CATEGORY_ORDER: MenuCategory[] = [
  "Drinks",
  "Snacks",
  "Sandwich",
  "Fried Rice",
  "Chowmein",
  "Burgers",
  "Pizza",
  "Pasta",
  "Maggi",
  "Extras",
  "Combos",
];

const featuredNames = new Set(FEATURED_ORDER);

const nonFeaturedByCategory: { category: MenuCategory; items: MenuItem[] }[] =
  EXPANDED_CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: menuItems.filter((i) => i.category === cat && !featuredNames.has(i.name)),
  })).filter((g) => g.items.length > 0);

// ─── Framer-Motion variants ──────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function MenuBadgeOverlay({ badge }: { badge: MenuBadgeType }) {
  if (badge === "Bestseller") {
    return (
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron text-forest text-xs font-ui font-bold shadow-sm">
        <Star className="w-3 h-3 fill-forest shrink-0" />
        Bestseller
      </div>
    );
  }
  if (badge === "Recommended") {
    return (
      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-cream text-xs font-ui font-bold bg-forest">
        Recommended
      </div>
    );
  }
  if (badge === "Special") {
    return (
      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-cream text-xs font-ui font-bold bg-forest-mid">
        Special
      </div>
    );
  }
  return null;
}

function MenuCard({ item }: { item: MenuItem }) {
  const whatsappText = encodeURIComponent(`Hi, I would like to order: ${item.name} (₹${item.price})`);
  
  return (
    <motion.article
      variants={cardItem}
      className="card-base overflow-hidden flex flex-col h-full group"
    >
      {/* Category Top Bar */}
      <div className="bg-forest px-4 py-1.5 text-center border-b border-forest-mid">
        <span className="font-ui font-semibold text-xs text-saffron uppercase tracking-wider">
          {item.category}
        </span>
      </div>
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-forest/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 right-3 z-10">
          <span className="price-tag">₹{item.price}</span>
        </div>
        {item.badge !== null ? <MenuBadgeOverlay badge={item.badge} /> : null}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <h3 className="font-display font-bold text-xl text-forest mb-2 leading-tight">
          {item.name}
        </h3>
        <p className="font-ui text-sm text-ink-muted mb-6 flex-grow leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex gap-2 items-center mt-auto">
          <div className="flex-grow">
            <AddToCartButton itemName={item.name} itemPrice={item.price} />
          </div>
          <a
            href={`https://wa.me/919129383812?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shrink-0"
            aria-label={`Order ${item.name} via WhatsApp`}
            title="Order via WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function CategoryDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-12">
      <div className="flex-1 h-px bg-forest/10" />
      <span className="font-ui font-bold text-saffron uppercase tracking-widest text-sm">
        {label}
      </span>
      <div className="flex-1 h-px bg-forest/10" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuShowcase() {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("All");
  const [btnHovered, setBtnHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCategoryClick = (cat: CategoryTab) => {
    setActiveCategory(cat);
    if (cat === "All") setExpanded(false);
  };

  const handleViewFullMenu = () => {
    if (expanded) {
      setExpanded(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setExpanded(true);
    }
  };

  // Items shown when a non-"All" tab is active
  const categoryItems = menuItems.filter(
    (i) => i.category === activeCategory
  );

  const isAllTab = activeCategory === "All";

  const viewFullMenuBtnStyle: CSSProperties = {
    background: btnHovered ? "#2D7A3A" : "transparent",
    border: "1.5px solid #2D7A3A",
    color: btnHovered ? "#fff" : "#2D7A3A",
    borderRadius: 8,
    padding: "12px 32px",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 200ms ease, color 200ms ease",
    boxShadow: "none",
  };

  return (
    <section id="menu" className="section-padding bg-cream" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-3">
            Our Menu
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-forest mb-4">
            Something for Every Craving
          </h2>
          <p className="font-ui text-ink-muted max-w-lg mx-auto">
            100% vegetarian. Made fresh daily.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12 border-b border-forest/10 pb-2"
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => handleCategoryClick(cat)}
              className={`relative py-3 px-2 font-ui font-bold text-sm min-h-[44px] transition-colors duration-200 ${
                activeCategory === cat
                  ? "text-saffron"
                  : "text-ink-muted hover:text-forest"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-saffron rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Category tab view (non-"All") ─────────────────────────────── */}
        {!isAllTab && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {categoryItems.map((item, index) => (
                <MenuCard key={`${activeCategory}-${item.name}-${index}`} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── "All" tab view ───────────────────────────────────────────── */}
        {isAllTab && (
          <>
            {/* Featured 9 grid + fade overlay wrapper */}
            <div style={{ position: "relative" }}>
              <motion.div
                key="featured-grid"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Render first 6 items */}
                {featuredItems.slice(0, 6).map((item, index) => (
                  <MenuCard key={`featured-${item.name}-${index}`} item={item} />
                ))}
                
                {/* Full Width Combo Banner between row 2 and 3 (after 6 items) */}
                <motion.div 
                  variants={cardItem}
                  className="col-span-1 sm:col-span-2 lg:col-span-3 bg-cream-dark rounded-[2rem] border border-saffron/20 p-8 sm:p-12 overflow-hidden relative flex flex-col md:flex-row items-center gap-8 shadow-sm group"
                >
                  <div className="absolute inset-0 bg-saffron/5" />
                  {/* Content */}
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-saffron text-forest font-ui font-bold text-sm mb-4 transform -rotate-1">
                      Our Bestselling Combo
                    </div>
                    <h3 className="font-display font-bold text-3xl sm:text-4xl text-forest mb-4">
                      Fried Rice + Chilli Paneer + Tea
                    </h3>
                    <p className="font-ui text-ink-muted text-lg mb-8 max-w-xl">
                      The perfect comfort meal, freshly wok-tossed and paired with our premium kadak chai.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <span className="font-display font-bold text-4xl text-saffron">₹130</span>
                      <a
                        href="https://wa.me/919129383812?text=Hi%2C%20I%20would%20like%20to%20order%20the%20Bestselling%20Combo%20(Fried%20Rice%20%2B%20Chilli%20Paneer%20%2B%20Tea)%20for%20%E2%82%B9130"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Order via WhatsApp
                      </a>
                    </div>
                  </div>
                  {/* Image/Illustration */}
                  <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-sm shrink-0">
                    <img 
                      src={featuredItems.find(i => i.isCombo)?.image || "/hero-food.jpg"} 
                      alt="Special Combo"
                      className="w-full h-full object-cover rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
                    />
                  </div>
                </motion.div>

                {/* Render remaining items */}
                {featuredItems.slice(6).map((item, index) => (
                  <MenuCard key={`featured-${item.name}-${index + 6}`} item={item} />
                ))}
              </motion.div>

              {/* Fade gradient overlay — only when collapsed */}
              {!expanded && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 120,
                    background:
                      "linear-gradient(to bottom, transparent, #fdf6ec)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* Expanded section — non-featured items with category dividers */}
            <div
              style={{
                maxHeight: expanded ? 5000 : 0,
                opacity: expanded ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 600ms ease, opacity 400ms ease",
              }}
            >
              {nonFeaturedByCategory.map(({ category, items }) => (
                <div key={category}>
                  <CategoryDivider label={category} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={`expanded-${item.name}-${index}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 16 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                      >
                        <MenuCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Menu Button */}
            {nonFeaturedByCategory.length > 0 && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleViewFullMenu}
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={viewFullMenuBtnStyle}
                  aria-expanded={expanded}
                >
                  {expanded ? "View Less ↑" : "View Full Menu ↓"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
