import { motion } from "framer-motion";
import { Film, Download, Search, Upload, Bell, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEATURES = [
  { icon: Film, title: "HD Video Streaming", desc: "Watch in 144p to 4K based on your connection.", color: "text-primary", bg: "bg-primary/10" },
  { icon: Download, title: "Watch Offline", desc: "Download videos and watch without internet.", color: "text-success", bg: "bg-success/10" },
  { icon: Search, title: "Smart Search", desc: "Find videos in Hindi, Tamil, Telugu and more.", color: "text-warning", bg: "bg-warning/10" },
  { icon: Upload, title: "Easy Upload", desc: "Upload your videos in minutes, reach millions.", color: "text-primary", bg: "bg-primary/10" },
  { icon: Bell, title: "Live Notifications", desc: "Never miss a video from your favorite creators.", color: "text-success", bg: "bg-success/10" },
  { icon: Moon, title: "Dark Mode", desc: "Easy on the eyes, watch all night comfortably.", color: "text-warning", bg: "bg-warning/10" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            FEATURES
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Everything You Love About Video
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Packed with features for the best experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group p-6 md:p-7 h-full border-border/60 hover:border-primary/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
