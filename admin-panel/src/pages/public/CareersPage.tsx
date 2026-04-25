import { LegalLayout } from "@/components/landing/LegalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const ROLES = [
  { title: "React Native Developer", location: "Mumbai", type: "Full-time", dept: "Engineering" },
  { title: "Backend Engineer", location: "Remote (India)", type: "Full-time", dept: "Engineering" },
  { title: "Content Moderator", location: "Bengaluru", type: "Full-time", dept: "Operations" },
  { title: "Marketing Manager", location: "Mumbai", type: "Full-time", dept: "Marketing" },
  { title: "UI/UX Designer", location: "Remote (India)", type: "Full-time", dept: "Design" },
  { title: "Customer Support Lead", location: "Mumbai", type: "Full-time", dept: "Support" },
];

export default function CareersPage() {
  return (
    <LegalLayout
      title="Join Our Team"
      subtitle="Build the future of Indian video with us. Remote-friendly, equity for all, and a mission you'll love."
    >
      <div className="not-prose grid sm:grid-cols-2 gap-4">
        {ROLES.map((r) => (
          <Card key={r.title} className="p-6 hover:shadow-card hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
              <Briefcase className="w-3.5 h-3.5" /> {r.dept}
            </div>
            <h3 className="text-lg font-bold mb-2">{r.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-5">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.location}</span>
              <span>•</span>
              <span>{r.type}</span>
            </div>
            <Button size="sm" className="bg-gradient-brand text-white border-0">
              Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="not-prose mt-10 text-center text-muted-foreground text-sm">
        Don't see your role? Email us at{" "}
        <a href="mailto:careers@playvia.app" className="text-primary font-medium">careers@playvia.app</a>
      </div>
    </LegalLayout>
  );
}
