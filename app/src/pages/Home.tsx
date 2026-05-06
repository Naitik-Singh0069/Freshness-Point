import { useEffect, useState } from "react";
import UrgencyStrip from "../sections/UrgencyStrip";
import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import OrderPlatformStrip from "../sections/OrderPlatformStrip";
import Benefits from "../sections/Benefits";
import MenuShowcase from "../sections/MenuShowcase";
import Reviews from "../sections/Reviews";
import Outlets from "../sections/Outlets";
import BrandStory from "../sections/BrandStory";
import TrustStrip from "../sections/TrustStrip";
import Footer from "../sections/Footer";
import StickyCTA from "../sections/StickyCTA";

export default function Home() {
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <UrgencyStrip />
      <Navbar />
      <main>
        <Hero />
        <OrderPlatformStrip />
        <Benefits />
        <MenuShowcase />
        <Reviews />
        <Outlets />
        <BrandStory />
        <TrustStrip />
      </main>
      <Footer />
      <StickyCTA visible={showSticky} />
    </>
  );
}
