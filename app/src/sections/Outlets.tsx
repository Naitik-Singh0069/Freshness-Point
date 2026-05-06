import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";

const locations = [
  {
    city: "Lucknow",
    title: "Freshness Point, Ashiyana",
    address: "Crystal Cox Ajanta Tower, Ashiyana, Lucknow, Uttar Pradesh 226012",
    hours: "11:00 AM - 11:00 PM",
    phone: "+91 91293 83812",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.4728514104273!2d80.92348577543534!3d26.79308367671842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfc1b2af55555%3A0x633512a843ab536e!2sFreshness%20Point!5e0!3m2!1sen!2sin!4v1709456789012!5m2!1sen!2sin",
    directionUrl: "https://maps.app.goo.gl/LucknowLocationLink" // Replace with real link
  },
  {
    city: "Pratapgarh",
    title: "Freshness Point, Sangipur",
    address: "In front of LIC office, Sangipur, Pratapgarh, Uttar Pradesh 230139",
    hours: "10:00 AM - 10:00 PM",
    phone: "+91 91293 83812",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.672522736789!2d81.85467331502422!3d26.17482818345091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399af353282eb1fb%3A0xcb1b59092496cc0a!2sFreshness%20Point!5e0!3m2!1sen!2sin!4v1709456789013!5m2!1sen!2sin",
    directionUrl: "https://maps.app.goo.gl/PratapgarhLocationLink" // Replace with real link
  }
];

export default function Outlets() {
  return (
    <section id="locations" className="section-padding bg-cream-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-3">
            Find Us
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-forest mb-4">
            Our Locations
          </h2>
          <p className="font-ui text-ink-muted max-w-md mx-auto">
            Visit us for the freshest vegetarian food in town. Both locations offer dine-in and takeaway.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {locations.map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-forest/5 flex flex-col h-full"
            >
              {/* Map Container */}
              <div className="w-full h-64 bg-forest/5 relative">
                <iframe
                  src={loc.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map for ${loc.title}`}
                  className="absolute inset-0 grayscale-[20%] contrast-[0.9]"
                />
                
                {/* Badges Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                  <span className="badge-amber">
                    <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                    Open Now
                  </span>
                  <span className="badge-green shadow-sm">
                    Home Delivery
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-display font-bold text-2xl text-forest mb-2">
                  {loc.title}
                </h3>
                
                <div className="space-y-4 mt-6 mb-8 flex-grow">
                  <div className="flex items-start gap-4 text-ink-muted">
                    <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                    <p className="font-ui text-sm leading-relaxed">{loc.address}</p>
                  </div>
                  <div className="flex items-center gap-4 text-ink-muted">
                    <Clock className="w-5 h-5 text-saffron shrink-0" />
                    <p className="font-ui text-sm">{loc.hours}</p>
                  </div>
                  <div className="flex items-center gap-4 text-ink-muted">
                    <Phone className="w-5 h-5 text-saffron shrink-0" />
                    <p className="font-ui text-sm">{loc.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-forest/10 mt-auto">
                  <a
                    href={loc.directionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary py-3 px-4 !shadow-none hover:shadow-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                  <a
                    href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                    className="flex-1 btn-ghost py-3 px-4"
                  >
                    Call Outlet
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
