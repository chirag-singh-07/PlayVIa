import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const REVIEWS = [
  { name: "Priya Sharma", city: "Mumbai", text: "Best Indian app I've used! Tamil and Hindi videos in one place. Amazing quality even on 4G.", color: "bg-pink-500" },
  { name: "Rahul Verma", city: "Delhi", text: "Offline downloads saved my long train journey. Super smooth playback and clean UI.", color: "bg-blue-500" },
  { name: "Aisha Khan", city: "Bengaluru", text: "Started uploading last month and already crossed 10K subscribers. The tools are creator-friendly.", color: "bg-amber-500" },
  { name: "Vikram Iyer", city: "Chennai", text: "Dark mode + 4K + Telugu support = perfect. My whole family uses PlayVia now.", color: "bg-emerald-500" },
  { name: "Sneha Patel", city: "Ahmedabad", text: "Notifications are spot on, never miss my favorite cooking shows. UI is so clean!", color: "bg-purple-500" },
  { name: "Arjun Reddy", city: "Hyderabad", text: "Smartest search ever. Found niche regional videos I couldn't find anywhere else.", color: "bg-rose-500" },
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            REVIEWS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">What Our Users Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">Loved by 10 million+ Indians.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${r.color} text-white font-bold flex items-center justify-center`}>
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-semibold text-sm">{r.name}</div>
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">{r.city}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
