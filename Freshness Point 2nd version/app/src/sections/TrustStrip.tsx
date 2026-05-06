import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Clock } from "lucide-react";

const trustItems = [
  { icon: Leaf, text: "100% Vegetarian" },
  { icon: ShieldCheck, text: "No Preservatives" },
  { icon: Sparkles, text: "Hygiene Certified" },
  { icon: Clock, text: "Fresh Daily" },
];

export default function TrustStrip() {
  return (
    <section className="bg-forest py-8 border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-cream/5 flex items-center justify-center text-saffron mb-2">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-ui font-bold text-cream text-sm uppercase tracking-wider">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
