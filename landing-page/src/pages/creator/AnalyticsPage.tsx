import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, CartesianGrid } from "recharts";
import { formatNumber } from "@/data/mock";
import { StatCard } from "@/components/creator/StatCard";
import { Eye, Clock, TrendingUp, Users, Loader2 } from "lucide-react";
import { useCreatorAnalytics, useCreatorStats } from "@/hooks/useCreator";

export default function AnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading } = useCreatorAnalytics();
  const { data: statsData, isLoading: statsLoading } = useCreatorStats();

  if (analyticsLoading || statsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, topVideos } = statsData || {};
  const { viewsOverTime } = analytics || {};

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Last 30 days performance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Views" value={formatNumber(stats?.totalViews || 0)} icon={Eye} delta={18.4} />
        <StatCard label="Videos" value={String(stats?.totalVideos || 0)} icon={Clock} delta={9.1} gradient="bg-gradient-secondary" />
        <StatCard label="Subscribers" value={formatNumber(stats?.subscriberCount || 0)} icon={Users} delta={22.3} />
        <StatCard label="Earnings" value={`₹${stats?.totalEarnings || 0}`} icon={TrendingUp} delta={2.1} gradient="bg-gradient-secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Views (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={viewsOverTime || []}>
                <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#ag)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Top Videos by Views</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={(topVideos || []).map((v: any) => ({ name: v.title.slice(0, 14) + "...", views: v.views || 0 }))}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-15} height={50} textAnchor="end" />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}