import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/creator/StatCard";
import { Users, Video, IndianRupee, Flag } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { earningsOverTime, viewsOverTime, formatNumber, formatINR } from "@/data/mock";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div><h1 className="text-3xl font-bold">Admin overview</h1><p className="text-muted-foreground">Platform-wide metrics.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value="2.1M" icon={Users} delta={9.2} gradient="bg-gradient-secondary" />
        <StatCard label="Total videos" value="184K" icon={Video} delta={14.5} />
        <StatCard label="Revenue" value={formatINR(21000000)} icon={IndianRupee} delta={18.6} gradient="bg-gradient-secondary" />
        <StatCard label="Open reports" value="42" icon={Flag} delta={-12} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-card"><CardHeader><CardTitle>Platform views</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={viewsOverTime}>
              <defs><linearGradient id="ad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" fontSize={11} stroke="hsl(var(--muted-foreground))" /><YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={formatNumber} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area dataKey="views" stroke="hsl(var(--secondary))" fill="url(#ad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="border-0 shadow-card"><CardHeader><CardTitle>Revenue per month</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={earningsOverTime}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--muted-foreground))" /><YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  );
}