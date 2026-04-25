import { motion } from "framer-motion";
import { Download, UserPlus, PlayCircle, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: Download, title: "Download the App", desc: "Click the download button and install the APK." },
  { icon: UserPlus, title: "Create Free Account", desc: "Sign up with email or Google in 30 seconds." },
  { icon: PlayCircle, title: "Start Watching", desc: "Browse thousands of Indian videos instantly." },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Get Started in 3 Simple Steps
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-4">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center px-4"
            >
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand">
                  <s.icon className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-primary text-primary text-sm font-bold flex items-center justify-center shadow-card">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground max-w-xs mx-auto">{s.desc}</p>

              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-3 w-5 h-5 text-primary" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
