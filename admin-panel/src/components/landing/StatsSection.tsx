import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 10_000_000, suffix: "+", label: "Downloads", format: "M" },
  { value: 4.8, suffix: "/5", label: "App Rating", decimals: 1 },
  { value: 50_000, suffix: "+", label: "Videos", format: "K" },
  { value: 500_000, suffix: "+", label: "Active Users", format: "K" },
];

function formatNumber(n: number, format?: string, decimals = 0) {
  if (format === "M") return (n / 1_000_000).toFixed(0) + "M";
  if (format === "K") return (n / 1_000).toFixed(0) + "K";
  return n.toFixed(decimals);
}

function Counter({ value, suffix, format, decimals }: { value: number; suffix: string; format?: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
      {formatNumber(display, format, decimals)}
      <span className="text-white/80">{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand" />
      <div className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsl(0 0% 100% / 0.3) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(0 0% 0% / 0.3) 0, transparent 40%)",
        }}
      />
      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter value={s.value} suffix={s.suffix} format={s.format} decimals={s.decimals} />
              <div className="mt-2 text-sm md:text-base font-medium text-white/90">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
