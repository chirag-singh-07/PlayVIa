import { motion } from "framer-motion";
import { Download, Play, ChevronDown, Star, Users, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import phoneMockup from "@/assets/phone-mockup.png";

export function HeroSection() {
  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none animate-gradient-shift"
        style={{
          background:
            "linear-gradient(120deg, hsl(0 100% 50% / 0.1), hsl(16 100% 50% / 0.1), hsl(0 100% 50% / 0.1))",
          backgroundSize: "200% 200%",
        }}
      />
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--gradient-brand)" }}
      />

      <div className="container relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            v2.1.0 • Free Download • 45MB
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
            India's #1{" "}
            <span className="text-gradient-brand">Video Streaming</span> App
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Watch, Upload &amp; Share Indian Videos in Your Language —{" "}
            <span className="font-semibold text-foreground">Free Forever.</span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Button
              size="lg"
              className="h-14 px-8 text-base bg-gradient-brand hover:opacity-90 shadow-brand text-white border-0"
              asChild
            >
              <a href="#download">
                <Download className="w-5 h-5 mr-2" /> Download APK
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base">
              <Play className="w-5 h-5 mr-2 fill-current" /> Watch Online
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.8</span>
              <span>(120K reviews)</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Phone mockup with floating badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[380px] md:max-w-[440px]">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{ background: "var(--gradient-brand)" }}
            />
            <img
              src={phoneMockup}
              alt="PlayVia app on smartphone"
              width={768}
              height={1024}
              className="relative w-full h-auto animate-float drop-shadow-2xl"
            />

            {/* Floating stat badges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-12 -left-2 md:-left-8 bg-card border border-border rounded-2xl px-4 py-3 shadow-elevated flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-tight">10M+</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-1/3 -right-2 md:-right-6 bg-card border border-border rounded-2xl px-4 py-3 shadow-elevated flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning fill-warning" />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-tight">4.8★</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-16 -left-2 md:-left-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-elevated flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-tight">50K+</div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <a
        href="#features"
        aria-label="Scroll down"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors animate-bounce-subtle"
      >
        <ChevronDown className="w-5 h-5" />
      </a>
    </section>
  );
}
