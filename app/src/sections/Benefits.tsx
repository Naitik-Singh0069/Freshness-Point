import { motion } from "framer-motion";

const proofPoints = [
  {
    title: "Handmade Daily",
    desc: "Every dish is prepared fresh from scratch in our kitchens every single morning.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <circle cx="32" cy="32" r="32" fill="#fef3e2" />
        <path d="M22 38C22 38 27 44 32 44C37 44 42 38 42 38" stroke="#e8920a" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 18V28" stroke="#1a2e1a" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 22L28 28" stroke="#1a2e1a" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 22L36 28" stroke="#1a2e1a" strokeWidth="4" strokeLinecap="round" />
        <rect x="20" y="44" width="24" height="6" rx="3" fill="#1a2e1a" />
      </svg>
    )
  },
  {
    title: "No Preservatives",
    desc: "We use 100% natural ingredients. No artificial colors, no MSG, no shortcuts.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <circle cx="32" cy="32" r="32" fill="#fef3e2" />
        <path d="M32 16L44 22V34C44 43 32 50 32 50C32 50 20 43 20 34V22L32 16Z" fill="#1a2e1a" />
        <path d="M32 46C32 46 40 40 40 34V24L32 20L24 24V34C24 40 32 46 32 46Z" fill="#e8920a" />
        <path d="M28 32L31 35L36 27" stroke="#fdf6ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Probiotic Rich Drinks",
    desc: "Our signature lassis are made with fresh curd, promoting a healthy gut.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <circle cx="32" cy="32" r="32" fill="#fef3e2" />
        <path d="M24 20L26 44C26 47.3137 28.6863 50 32 50C35.3137 50 38 47.3137 38 44L40 20H24Z" fill="#1a2e1a" />
        <path d="M24 20C24 17.7909 27.5817 16 32 16C36.4183 16 40 17.7909 40 20C40 22.2091 36.4183 24 32 24C27.5817 24 24 22.2091 24 20Z" fill="#e8920a" />
        <path d="M36 12L34 22" stroke="#fdf6ec" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 28H46C47.1046 28 48 28.8954 48 30V34C48 35.1046 47.1046 36 46 36H40" stroke="#1a2e1a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Hygiene Certified",
    desc: "Cleanliness is our top priority. Our kitchens meet the highest safety standards.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <circle cx="32" cy="32" r="32" fill="#fef3e2" />
        <path d="M32 18L35.5 28.5L46 32L35.5 35.5L32 46L28.5 35.5L18 32L28.5 28.5L32 18Z" fill="#e8920a" />
        <path d="M20 20L22 24L26 26L22 28L20 32L18 28L14 26L18 24L20 20Z" fill="#1a2e1a" />
        <path d="M44 44L45.5 48.5L50 50L45.5 51.5L44 56L42.5 51.5L38 50L42.5 48.5L44 44Z" fill="#1a2e1a" />
      </svg>
    )
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="section-padding bg-cream-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-3">
            Our Kitchen
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-forest mb-4">
            The Freshness Promise
          </h2>
          <p className="font-ui text-ink-muted max-w-2xl mx-auto text-lg">
            We bring the hygiene of a fine-dining restaurant to the authentic flavors of Indian street food.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {proofPoints.map((point, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                {point.icon}
              </div>
              <h3 className="font-display font-bold text-forest text-2xl mb-3">{point.title}</h3>
              <p className="font-ui text-ink-muted leading-relaxed">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
