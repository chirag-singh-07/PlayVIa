import { LegalLayout } from "@/components/landing/LegalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, MousePointerClick, IndianRupee } from "lucide-react";

const STATS = [
  { Icon: Users, label: "Monthly active users", value: "10M+" },
  { Icon: Eye, label: "Daily video views", value: "2.4M+" },
  { Icon: MousePointerClick, label: "Average CTR", value: "3.2%" },
  { Icon: IndianRupee, label: "Starting CPM", value: "₹120" },
];

const PACKAGES = [
  { name: "Starter", price: "₹50,000", desc: "Per month", features: ["1M impressions", "Standard placements", "Monthly report"] },
  { name: "Growth", price: "₹2,00,000", desc: "Per month", features: ["5M impressions", "Premium placements", "Weekly report", "A/B testing"], featured: true },
  { name: "Enterprise", price: "Custom", desc: "Talk to us", features: ["Unlimited impressions", "Homepage takeovers", "Dedicated manager", "Custom creative"] },
];

export default function AdvertisePage() {
  return (
    <LegalLayout
      title="Advertise on PlayVia"
      subtitle="Reach 10 million engaged Indian viewers across 12+ languages."
    >
      <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5 text-center">
            <s.Icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <h2>Advertising Packages</h2>
      <div className="not-prose grid md:grid-cols-3 gap-5 mt-6">
        {PACKAGES.map((p) => (
          <Card
            key={p.name}
            className={`p-6 relative ${p.featured ? "border-primary border-2 shadow-brand" : ""}`}
          >
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="font-bold text-lg">{p.name}</div>
            <div className="mt-3 text-3xl font-extrabold">{p.price}</div>
            <div className="text-xs text-muted-foreground">{p.desc}</div>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
            <Button className={`mt-6 w-full ${p.featured ? "bg-gradient-brand text-white border-0" : ""}`} variant={p.featured ? "default" : "outline"}>
              Get Started
            </Button>
          </Card>
        ))}
      </div>

      <h2 className="mt-12">Talk to our ad team</h2>
      <p>
        Email <a href="mailto:ads@playvia.app" className="text-primary font-medium">ads@playvia.app</a> with your
        goals and budget. We typically respond within one business day.
      </p>
    </LegalLayout>
  );
}
