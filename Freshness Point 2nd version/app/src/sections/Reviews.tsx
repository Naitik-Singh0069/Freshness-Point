import { motion } from "framer-motion";
import { Star, Instagram } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    city: "Lucknow",
    rating: 5,
    text: "The Special Fried Rice here is absolutely amazing! Fresh veggies, perfect seasoning, and the portion size is great for the price. My go-to place for quick vegetarian food.",
  },
  {
    name: "Priya Verma",
    city: "Pratapgarh",
    rating: 5,
    text: "Finally a place that serves truly hygienic street-style food. Their lassi is the best in town — thick, creamy, and so refreshing. Highly recommend!",
  },
  {
    name: "Amit Mishra",
    city: "Lucknow",
    rating: 5,
    text: "Cleanest kitchen I've seen for this kind of food. You can actually taste that they don't use cheap oil or artificial colors. Highly recommended.",
  }
];

const ugcPhotos = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
  "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?w=400&q=80",
  "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80",
  "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&q=80"
];

export default function Reviews() {
  return (
    <section id="reviews" className="section-padding bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header & Overall Rating */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-forest mb-4">
              Loved by Locals.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white px-8 py-6 rounded-3xl shadow-sm border border-forest/5 flex items-center gap-6"
          >
            <div className="text-center">
              <p className="font-display font-bold text-5xl text-forest">4.8</p>
              <div className="flex text-saffron my-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-saffron" />
                ))}
              </div>
            </div>
            <div className="w-px h-16 bg-forest/10" />
            <div>
              <p className="font-ui font-bold text-forest text-lg">Google Reviews</p>
              <p className="font-ui text-ink-muted text-sm">Based on 312+ ratings</p>
            </div>
          </motion.div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-forest/5 shadow-sm relative group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex text-saffron mb-6">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-saffron" />
                ))}
              </div>
              
              <p className="font-ui text-ink-muted leading-relaxed mb-8 relative z-10 text-base">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-cream font-ui font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-ui font-bold text-sm text-forest">
                    {review.name}
                  </p>
                  <p className="font-ui text-xs text-ink-muted">{review.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram UGC Strip */}
        <div className="border-t border-forest/10 pt-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center text-cream shadow-sm">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-forest">@freshnesspoint</h3>
                <p className="font-ui text-sm text-ink-muted">Tag us to be featured on our page</p>
              </div>
            </div>
            <a 
              href="https://instagram.com/freshnesspoint" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Follow us on Instagram
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ugcPhotos.map((photo, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/freshnesspoint"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-sm block"
              >
                <img 
                  src={photo} 
                  alt="Freshness Point Food" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-cream" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
