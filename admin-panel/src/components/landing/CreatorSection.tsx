import { motion } from "framer-motion";
import { Check, ArrowRight, BarChart3, Video, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const PERKS = [
  "Upload unlimited videos for free",
  "Reach 500K+ active viewers",
  "Earn money through monetization",
  "Detailed analytics dashboard",
  "Live streaming support",
];

export function CreatorSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            FOR CREATORS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Are You a <span className="text-gradient-brand">Creator?</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Grow your audience with our platform.
          </p>

          <ul className="mt-8 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
                </div>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-8 h-13 px-7 bg-gradient-brand hover:opacity-90 shadow-brand text-white border-0">
            Start Creating Today <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-3xl" />
          <div className="relative bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground">Creator Dashboard</div>
                <div className="text-lg font-bold">@yourchannel</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">LIVE</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Users, label: "Subscribers", value: "124.5K", trend: "+12%" },
                { icon: Video, label: "Videos", value: "248", trend: "+3" },
                { icon: BarChart3, label: "Views (30d)", value: "2.1M", trend: "+18%" },
                { icon: IndianRupee, label: "Earnings", value: "₹84,200", trend: "+22%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border p-4 bg-background">
                  <s.icon className="w-4 h-4 text-primary mb-2" />
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-xs text-success font-medium">{s.trend}</div>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div className="rounded-xl border border-border p-4 bg-background">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">Views Trend</div>
                <div className="text-xs text-muted-foreground">7 days</div>
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {[40, 65, 50, 80, 70, 95, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary-glow opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
