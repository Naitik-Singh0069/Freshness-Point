import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function BrandStory() {
  return (
    <section id="story" className="section-padding bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-4">
              Our Journey
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-forest leading-[1.1] mb-6">
              From Pratapgarh to Lucknow.
            </h2>
            
            <div className="prose prose-lg text-ink-muted mb-8 font-ui leading-relaxed">
              <p className="mb-4">
                What started as a small, passionate endeavor in Pratapgarh has grown into a trusted destination for fresh, authentic vegetarian fast food in Lucknow. 
              </p>
              <p className="mb-4">
                We believe that quick food shouldn't mean compromised food. That's why we bring the hygiene of a fine-dining restaurant to the unforgettable flavors of Indian street food.
              </p>
              <p>
                Every dish is prepared fresh from scratch every single morning. We never use artificial colors or preservatives. It's a simple process promise that ensures you taste the freshness in every bite.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-saffron" />
                <span className="font-ui font-bold text-forest">100% Vegetarian</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-saffron" />
                <span className="font-ui font-bold text-forest">Hygiene Certified</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[400px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group"
          >
            <img 
              src="/interior-cafe.jpg" 
              alt="Freshness Point Kitchen" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest/10 mix-blend-multiply" />
            
            <div className="absolute inset-0 border-2 border-cream/20 rounded-[2rem] m-4 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
