import { motion } from "framer-motion";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadCTASection() {
  return (
    <section id="download" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 50%, hsl(0 0% 100% / 0.4) 0, transparent 40%), radial-gradient(circle at 100% 50%, hsl(0 0% 0% / 0.3) 0, transparent 40%)",
        }}
      />

      <div className="container relative grid md:grid-cols-2 gap-12 items-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Start Watching?
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-md">
            Join 10 million Indians already on PlayVia. Free forever, no ads forced.
          </p>

          <Button
            size="lg"
            variant="outline"
            className="mt-8 h-14 px-8 text-base bg-white/10 backdrop-blur border-2 border-white text-white hover:bg-white hover:text-primary font-bold"
          >
            <Download className="w-5 h-5 mr-2" /> Download APK Now
          </Button>
          <div className="mt-4 text-sm text-white/80">v2.1.0 • 45 MB • Android 7.0+</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center md:justify-end gap-6"
        >
          {/* QR placeholder */}
          <div className="bg-white p-4 rounded-2xl shadow-elevated">
            <div className="w-32 h-32 grid grid-cols-8 grid-rows-8 gap-px bg-foreground/5">
              {Array.from({ length: 64 }).map((_, i) => {
                const r = (i * 9301 + 49297) % 233280;
                const filled = r % 3 !== 0;
                return <div key={i} className={filled ? "bg-foreground" : "bg-white"} />;
              })}
            </div>
            <div className="text-center text-xs font-semibold text-foreground mt-2 flex items-center justify-center gap-1">
              <Smartphone className="w-3 h-3" /> Scan to download
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
