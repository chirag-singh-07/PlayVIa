import { Card } from "@/components/ui/card";
import { Construction, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  Icon?: LucideIcon;
  features?: string[];
}

export function ComingSoonPage({ title, description, Icon = Construction, features }: Props) {
  return (
    <div className="max-w-3xl">
      <Card className="p-8 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand mb-5">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">In Development</div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{description}</p>

        {features && features.length > 0 && (
          <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
