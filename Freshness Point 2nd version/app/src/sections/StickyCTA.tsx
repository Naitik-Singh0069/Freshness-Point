import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyCTAProps {
  visible: boolean; // Keeping the prop for compatibility, though we might want it always visible
}

export default function StickyCTA({ visible }: StickyCTAProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <a
            href="https://wa.me/919129383812?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-ui font-bold text-sm hidden md:block">Chat to order &rarr;</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
