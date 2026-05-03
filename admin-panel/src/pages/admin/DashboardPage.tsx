import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Users, Film, Eye, IndianRupee, MoreHorizontal, ArrowUpRight, Check, X, Loader2 } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  trafficSources, fmtCompact, fmtDate, fmtINR,
} from "@/lib/adminMock";
import { adminService } from "@/lib/adminService";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "var(--shadow-card)",
};

export default function DashboardPage() {
  const { data: stats = { 
    totalUsers: 0, 
    totalVideos: 0, 
    viewsToday: "0", 
    monthlyRevenue: "₹0",
    dauData: [],
    uploadsData: [],
    revenueByMonth: []
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  const { data: recentVideos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["admin-recent-videos"],
    queryFn: adminService.getRecentVideos,
  });

  const { data: recentUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: adminService.getRecentUsers,
  });

  const { data: pendingReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["admin-pending-reports"],
    queryFn: adminService.getReports,
  });

  const loading = statsLoading || videosLoading || usersLoading || reportsLoading;

  const topVideos = [...recentVideos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} trend={12.5} trendLabel="this month" Icon={Users}
          iconColor="text-primary" iconBg="bg-primary/10" spark={[3, 4, 5, 4, 6, 7, 8, 7, 9, 10]} />
        <StatCard label="Total Videos" value={stats.totalVideos.toLocaleString()} trend={8.3} trendLabel="this month" Icon={Film}
          iconColor="text-success" iconBg="bg-success/10" spark={[5, 6, 5, 7, 8, 7, 9, 10, 11, 12]} />
        <StatCard label="Views Today" value={stats.viewsToday} trend={5.1} trendLabel="today" Icon={Eye}
          iconColor="text-warning" iconBg="bg-warning/10" spark={[6, 8, 7, 9, 10, 11, 9, 12, 11, 13]} />
        <StatCard label="Monthly Revenue" value={stats.monthlyRevenue} trend={18.2} trendLabel="this month" Icon={IndianRupee}
          iconColor="text-primary" iconBg="bg-primary/10" spark={[4, 5, 7, 6, 9, 10, 12, 11, 14, 15]} />
      </div>

      {/* Row 2 — DAU + Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-base">Daily Active Users</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 30 days (Mixed Data)</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold">{stats.dauData.length > 0 ? fmtCompact(stats.dauData[stats.dauData.length - 1].users) : "0"}</div>
              <div className="text-xs text-success font-semibold flex items-center gap-1 justify-end">
                <ArrowUpRight className="w-3 h-3" /> +12.4%
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dauData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dauLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtCompact(v), "Users"]} />
                <Line type="monotone" dataKey="users" stroke="url(#dauLine)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 md:p-6">
          <div className="mb-4">
            <h3 className="font-bold text-base">Traffic Sources</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Where users come from</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {trafficSources.map((s, i) => <Cell key={i} fill={s.color} stroke="hsl(var(--background))" strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {trafficSources.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3 — Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 md:p-6">
          <div className="mb-4">
            <h3 className="font-bold text-base">Video Uploads</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 14 days</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.uploadsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="uploads" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 md:p-6">
          <div className="mb-4">
            <h3 className="font-bold text-base">Revenue by Month</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 12 months (₹)</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueByMonth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtINR(v), "Revenue"]} />
                <Bar dataKey="revenue" fill="url(#revBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 4 — Recent videos + recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Recent Videos</h3>
            <Button variant="ghost" size="sm" asChild><a href="/admin/videos">View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" /></a></Button>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left font-medium pb-2">Video</th>
                  <th className="text-left font-medium pb-2 hidden md:table-cell">Creator</th>
                  <th className="text-right font-medium pb-2">Views</th>
                  <th className="text-center font-medium pb-2 hidden sm:table-cell">Status</th>
                  <th className="text-right font-medium pb-2 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentVideos.map((v: any) => (
                  <tr key={v._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={v.thumbnailUrl || "/placeholder-thumb.png"} className="w-16 h-10 rounded object-cover shrink-0" alt="" />
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[220px]">{v.title}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{v.channel?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-muted-foreground">{v.channel?.name}</td>
                    <td className="text-right font-medium tabular-nums">{fmtCompact(v.views)}</td>
                    <td className="hidden sm:table-cell text-center"><StatusBadge status={v.isPublished ? "Active" : "Draft"} /></td>
                    <td className="hidden lg:table-cell text-right text-muted-foreground tabular-nums">{fmtDate(v.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Recent Users</h3>
            <Button variant="ghost" size="sm" asChild><a href="/admin/users">View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" /></a></Button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u: any) => (
              <div key={u._id} className="flex items-center gap-3">
                <img src={u.avatar || "/placeholder-avatar.png"} className="w-9 h-9 rounded-full shrink-0" alt="" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{u.username}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={u.isBanned ? "Banned" : "Active"} />
                  <div className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{fmtDate(u.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 5 — Top videos + Pending reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 md:p-6">
          <h3 className="font-bold text-base mb-4">Top Performing Videos</h3>
          <div className="space-y-3">
            {topVideos.map((v: any, i: number) => (
              <div key={v._id} className="flex items-center gap-3">
                <div className="w-6 text-center text-sm font-extrabold text-muted-foreground tabular-nums">{i + 1}</div>
                <img src={v.thumbnailUrl || "/placeholder-thumb.png"} className="w-12 h-12 rounded object-cover shrink-0" alt="" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.channel?.name} • {v.category}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold tabular-nums">{fmtCompact(v.views)}</div>
                  <div className="text-xs text-muted-foreground">views</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Pending Reports</h3>
            <Button variant="ghost" size="sm" asChild><a href="/admin/reports">All reports <ArrowUpRight className="w-3.5 h-3.5 ml-1" /></a></Button>
          </div>
          <div className="space-y-3">
            {pendingReports.map((r: any) => (
              <div key={r._id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={r.priority || "Medium"} />
                    <span className="text-xs text-muted-foreground">{r.reason}</span>
                  </div>
                  <div className="text-sm font-medium truncate">{r.target}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" aria-label="Approve">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="Dismiss">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {pendingReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No pending reports</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
