import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import DeliveryModal from "../components/DeliveryModal";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Our Kitchen", href: "#benefits" },
  { label: "Find Us", href: "#locations" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-forest shadow-lg"
            : "bg-forest/90 backdrop-blur-md"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#hero");
            }}
            className="flex items-center group"
          >
            <span className="font-display font-bold text-2xl text-cream tracking-tight transition-transform group-hover:scale-[1.02]">
              Freshness Point
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className="font-ui font-semibold text-sm text-cream/80 hover:text-saffron transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-saffron text-forest font-ui font-bold text-sm rounded-full transition-all hover:bg-saffron-dark hover:scale-105 active:scale-95"
            >
              Order Now
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-cream hover:bg-forest-mid transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-forest overflow-hidden shadow-xl"
            >
              <div className="px-4 py-6 space-y-2 border-t border-forest-mid">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="block px-4 py-3 rounded-xl font-ui font-semibold text-cream hover:bg-forest-mid hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="block w-full mt-4 px-4 py-3.5 bg-saffron text-forest font-ui font-bold rounded-xl text-center shadow-sm"
                >
                  Order Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <DeliveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
