import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCREENS = [
  { label: "Home Feed", color: "from-red-500 to-orange-500" },
  { label: "Video Player", color: "from-purple-500 to-pink-500" },
  { label: "Search Results", color: "from-blue-500 to-cyan-500" },
  { label: "Creator Dashboard", color: "from-green-500 to-emerald-500" },
  { label: "User Profile", color: "from-amber-500 to-orange-500" },
];

export function ScreenshotsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => {
      setActive((a) => (a + 1) % SCREENS.length);
    }, 3500);
    return () => window.clearInterval(timer.current);
  }, [paused]);

  return (
    <section id="screenshots" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            SCREENSHOTS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">See It In Action</h2>
          <p className="mt-4 text-lg text-muted-foreground">A peek at the experience waiting on your phone.</p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center justify-center gap-4 md:gap-8 perspective-1000 min-h-[520px] md:min-h-[600px]">
            {SCREENS.map((s, i) => {
              const offset = i - active;
              const isActive = offset === 0;
              return (
                <motion.div
                  key={s.label}
                  animate={{
                    x: offset * (typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 120),
                    scale: isActive ? 1 : 0.8,
                    opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute"
                >
                  <div className="w-[240px] md:w-[280px] aspect-[9/19] rounded-[2.5rem] border-[10px] border-foreground bg-foreground p-1 shadow-elevated">
                    <div className={cn("w-full h-full rounded-[2rem] bg-gradient-to-br relative overflow-hidden flex flex-col", s.color)}>
                      <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-end">
                        <div className="w-20 h-4 bg-foreground rounded-b-2xl" />
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center text-white p-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4" />
                        <div className="text-white/90 text-xs font-medium uppercase tracking-wider mb-1">PlayVia</div>
                        <div className="text-2xl font-bold text-center">{s.label}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {[...Array(6)].map((_, k) => (
                          <div key={k} className="aspect-video rounded-lg bg-white/15 backdrop-blur-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setActive((a) => (a - 1 + SCREENS.length) % SCREENS.length)}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {SCREENS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "bg-primary w-8" : "bg-border w-2 hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setActive((a) => (a + 1) % SCREENS.length)}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
