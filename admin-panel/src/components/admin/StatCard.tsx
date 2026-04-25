import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  Icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  spark?: number[];
}

export function StatCard({ label, value, trend, trendLabel, Icon, iconColor = "text-primary", iconBg = "bg-primary/10", spark }: Props) {
  const positive = trend >= 0;
  const data = (spark ?? [3, 5, 4, 7, 6, 9, 8, 11, 10, 12]).map((v) => ({ v }));
  const sparkColor = positive ? "hsl(var(--success))" : "hsl(var(--destructive))";

  return (
    <Card className="p-5 hover:shadow-card transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight truncate">{value}</div>
          <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-semibold", positive ? "text-success" : "text-destructive")}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {positive ? "+" : ""}{trend}%
            <span className="text-muted-foreground font-normal ml-1">{trendLabel}</span>
          </div>
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>

      <div className="absolute -bottom-2 left-0 right-0 h-12 opacity-60 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} fill={`url(#spark-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
