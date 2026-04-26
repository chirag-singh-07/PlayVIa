import { StatCard } from "@/components/creator/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, IndianRupee, Video as VideoIcon, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
import { formatNumber, formatINR } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { useCreatorStats, useCreatorAnalytics } from "@/hooks/useCreator";

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useCreatorStats();
  const { data: analyticsData, isLoading: analyticsLoading } = useCreatorAnalytics();

  if (statsLoading || analyticsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, recentVideos, topVideos } = statsData || {};
  const { viewsOverTime, earningsOverTime } = analyticsData || {};

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your channel today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Views" value={formatNumber(stats?.totalViews || 0)} icon={Eye} delta={12.5} gradient="bg-gradient-primary" />
        <StatCard label="Subscribers" value={formatNumber(stats?.subscriberCount || 0)} icon={Users} delta={8.2} gradient="bg-gradient-secondary" />
        <StatCard label="Earnings" value={formatINR(stats?.totalEarnings || 0)} icon={IndianRupee} delta={24.1} gradient="bg-gradient-primary" />
        <StatCard label="Videos" value={String(stats?.totalVideos || 0)} icon={VideoIcon} delta={3.4} gradient="bg-gradient-secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Views over time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={viewsOverTime || []}>
                <defs><linearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#vgrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Earnings (12 months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={earningsOverTime || []}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ fill: "hsl(var(--secondary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentVideos?.map((v: any) => (
              <div key={v._id} className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-smooth">
                <img src={v.thumbnailUrl || "/placeholder.svg"} className="h-16 w-28 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{formatNumber(v.views || 0)} views</div>
                  <Badge variant={v.isPublished ? "default" : "secondary"} className="mt-1 text-xs">
                    {v.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))}
            {recentVideos?.length === 0 && (
              <p className="text-center py-6 text-muted-foreground">No videos uploaded yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardHeader><CardTitle>Top performing</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topVideos?.map((v: any, i: number) => (
              <div key={v._id} className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-smooth">
                <div className="text-2xl font-bold text-gradient w-6">{i + 1}</div>
                <img src={v.thumbnailUrl || "/placeholder.svg"} className="h-12 w-20 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{formatNumber(v.views || 0)} views</div>
                </div>
              </div>
            ))}
            {topVideos?.length === 0 && (
              <p className="text-center py-6 text-muted-foreground">No data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}