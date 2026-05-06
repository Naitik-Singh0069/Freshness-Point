import { MessageCircle, ExternalLink } from "lucide-react";

export default function OrderPlatformStrip() {
  return (
    <section className="bg-cream border-b border-forest/10 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <p className="font-ui font-bold text-sm text-forest uppercase tracking-wider mb-2 sm:mb-0">
          Order Now On
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://swiggy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-forest/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <span className="font-display font-bold text-forest text-lg group-hover:text-saffron transition-colors">Swiggy</span>
            <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-saffron transition-colors" />
          </a>
          
          <a
            href="https://zomato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-forest/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <span className="font-display font-bold text-forest text-lg group-hover:text-saffron transition-colors">Zomato</span>
            <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-saffron transition-colors" />
          </a>
          
          <a
            href="https://wa.me/919129303012?text=Hi%2C+I'd+like+to+order%3A+"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 shadow-sm hover:bg-[#25D366] hover:text-white transition-all group text-[#25D366]"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-ui font-bold text-base">WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
