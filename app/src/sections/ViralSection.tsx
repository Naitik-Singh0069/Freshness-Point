import { motion } from "framer-motion";
import { ShoppingBag, Leaf } from "lucide-react";

export default function ViralSection() {
  return (
    <section id="viral" className="py-20 px-4 bg-brand-green-soft/60 relative overflow-hidden">
      {/* Decorative floating leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Leaf className="absolute top-10 left-10 w-8 h-8 text-brand-green/15 rotate-45" />
        <Leaf className="absolute top-1/3 right-16 w-10 h-10 text-brand-green/10 -rotate-12" />
        <Leaf className="absolute bottom-20 left-1/4 w-6 h-6 text-brand-green/20 rotate-90" />
        <Leaf className="absolute bottom-10 right-10 w-8 h-8 text-brand-green/15 -rotate-45" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex justify-center"
          >
            <img
              src="/viral-uncle.png"
              alt="Happy customer enjoying fried rice"
              className="w-64 h-auto sm:w-72 md:w-80 drop-shadow-xl"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-green mb-4 leading-tight">
              Healthy bhi, tasty bhi 😄
            </h2>
            <p className="font-body text-text-secondary text-base sm:text-lg mb-8 max-w-md mx-auto md:mx-0">
              Healthy fried rice made with better ingredients — try now!
            </p>
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary"
            >
              <ShoppingBag className="w-5 h-5" />
              Order Fried Rice
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
