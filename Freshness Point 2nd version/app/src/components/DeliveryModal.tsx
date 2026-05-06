import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeliveryModal({ isOpen, onClose }: DeliveryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-cream w-full max-w-md rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="bg-forest p-6 text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-cream/70 hover:text-cream transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-display text-2xl font-bold text-cream mb-1">Order Now</h3>
                <p className="font-ui text-cream/80 text-sm">Choose your preferred platform</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                {/* Swiggy */}
                <a
                  href="https://swiggy.in" // TODO: Replace with actual Swiggy URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-forest/10 hover:border-saffron hover:shadow-md transition-all group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-[#FC8019]/10 rounded-full flex items-center justify-center shrink-0">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-swiggy-logo-icon-download-in-svg-png-gif-file-formats--food-delivery-brand-pack-logos-icons-1613371.png" alt="Swiggy" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-ui font-bold text-forest text-lg group-hover:text-saffron transition-colors">Order on Swiggy</h4>
                    <p className="font-ui text-ink-muted text-sm line-clamp-1">Fast delivery, track online</p>
                  </div>
                </a>

                {/* Zomato */}
                <a
                  href="https://zomato.com" // TODO: Replace with actual Zomato URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-forest/10 hover:border-saffron hover:shadow-md transition-all group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-[#E23744]/10 rounded-full flex items-center justify-center shrink-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/Zomato_logo.png" alt="Zomato" className="w-8 h-auto object-contain" />
                  </div>
                  <div>
                    <h4 className="font-ui font-bold text-forest text-lg group-hover:text-saffron transition-colors">Order on Zomato</h4>
                    <p className="font-ui text-ink-muted text-sm line-clamp-1">Read reviews, order fast</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919129383812?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-forest/10 hover:border-[#25D366] hover:shadow-md transition-all group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="font-ui font-bold text-forest text-lg group-hover:text-[#25D366] transition-colors">Order via WhatsApp</h4>
                    <p className="font-ui text-ink-muted text-sm line-clamp-1">Direct message, easy ordering</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
