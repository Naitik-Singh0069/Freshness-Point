import { Phone, Instagram, Clock, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="footer" className="bg-forest pt-16 pb-8 px-4 border-t border-forest-mid">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-display font-bold text-2xl text-cream block mb-4">
              Freshness Point
            </span>
            <p className="font-ui text-cream/70 text-sm leading-relaxed mb-6">
              Made Fresh. Every Single Batch. 100% Vegetarian food from our kitchen in Lucknow.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/919129383812"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-cream/5 rounded-full flex items-center justify-center hover:bg-saffron hover:text-forest text-cream transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/freshnesspoint"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-cream/5 rounded-full flex items-center justify-center hover:bg-saffron hover:text-forest text-cream transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Menu", id: "menu" },
                { label: "Our Kitchen", id: "benefits" },
                { label: "Reviews", id: "reviews" },
                { label: "Find Us", id: "locations" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="font-ui text-sm text-cream/70 hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-6">
              Hours
            </h4>
            <div className="flex items-start gap-3 text-cream/70 mb-4">
              <Clock className="w-5 h-5 text-saffron shrink-0" />
              <div>
                <p className="font-ui font-bold text-cream mb-1">Lucknow</p>
                <p className="font-ui text-sm">11:00 AM – 11:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-cream/70">
              <Clock className="w-5 h-5 text-saffron shrink-0" />
              <div>
                <p className="font-ui font-bold text-cream mb-1">Pratapgarh</p>
                <p className="font-ui text-sm">10:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h4 className="font-ui font-bold text-sm text-saffron uppercase tracking-widest mb-6">
              Locations
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-cream/70">
                <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <span className="font-ui text-sm leading-relaxed">
                  Crystal Cox Ajanta Tower, Ashiyana, Lucknow
                </span>
              </div>
              <div className="flex items-start gap-3 text-cream/70">
                <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <span className="font-ui text-sm leading-relaxed">
                  In front of LIC office, Sangipur, Pratapgarh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-forest-mid pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-ui text-sm text-cream/50 text-center sm:text-left">
            © {new Date().getFullYear()} Freshness Point. Made fresh in UP.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-cream/70 hover:text-saffron transition-colors font-ui font-bold text-sm"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
