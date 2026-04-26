import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  gradient?: string;
}

export const StatCard = ({ label, value, icon: Icon, delta, gradient = "bg-gradient-primary" }: Props) => {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="hover-lift border-0 shadow-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shadow-glow", gradient)}>
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          {delta !== undefined && (
            <div className={cn("text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full", positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {Math.abs(delta)}%
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
};