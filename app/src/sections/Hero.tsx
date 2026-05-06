import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Star } from "lucide-react";
import DeliveryModal from "../components/DeliveryModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden px-4 sm:px-6"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-lassi.jpg" // We'll keep this for now, ideally replaced with a wider food shot
          alt="Fresh vegetarian food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-transparent to-forest-dark/40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-12 sm:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Trust Badge Top */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream/10 border border-cream/20 backdrop-blur-md mb-8">
            <span className="flex items-center gap-1 text-saffron font-bold text-sm">
              <Star className="w-4 h-4 fill-saffron" /> 4.8
            </span>
            <span className="text-cream/80 text-xs font-ui">· 312 Google reviews</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6 tracking-tight">
            Made Fresh, <br className="hidden sm:block" />
            <span className="text-saffron italic font-light">Every Single Batch.</span>
          </h1>

          {/* Subhead */}
          <p className="font-ui text-lg sm:text-xl text-cream/90 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            From our kitchen in Lucknow — 100% vegetarian, no preservatives, no compromise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary w-full sm:w-auto"
            >
              Order Now
            </button>
            <button 
              onClick={scrollToMenu} 
              className="btn-ghost-light w-full sm:w-auto"
            >
              View Today&apos;s Menu
            </button>
          </div>

          {/* Trust Bar Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-cream/70 font-ui text-sm sm:text-base border-t border-cream/10 pt-8 w-full max-w-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-cream">Est. 2022</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-saffron" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Lucknow &amp; Pratapgarh</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-cream/50" />
        </motion.div>
      </motion.div>

      <DeliveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
