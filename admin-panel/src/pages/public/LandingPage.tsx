import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ScreenshotsSection } from "@/components/landing/ScreenshotsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CreatorSection } from "@/components/landing/CreatorSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { DownloadCTASection } from "@/components/landing/DownloadCTASection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    document.title = "PlayVia — India's #1 Video Streaming App | Watch, Upload & Share";
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "PlayVia — India's #1 free video streaming app. Watch, upload & share videos in Hindi, Tamil, Telugu and more. Download the APK now."
    );
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <HowItWorksSection />
        <CreatorSection />
        <ReviewsSection />
        <FAQSection />
        <DownloadCTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
