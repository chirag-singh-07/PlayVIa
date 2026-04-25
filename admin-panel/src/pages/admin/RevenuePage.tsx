import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { IndianRupee, Calendar, TrendingUp, Wallet, Download, FileText } from "lucide-react";
import { generateTransactions, fmtINR, fmtCompact, fmtDate, revenueByMonth, revenueBySource, revenueByCategory } from "@/lib/adminMock";
import { toast } from "sonner";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "var(--shadow-card)",
};

export default function RevenuePage() {
  const transactions = generateTransactions(40);

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-2xl font-extrabold tracking-tight">Revenue</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("CSV exported")}><Download className="w-4 h-4 mr-2" /> CSV</Button>
          <Button variant="outline" onClick={() => toast.success("PDF exported")}><FileText className="w-4 h-4 mr-2" /> PDF</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Today" value="₹42,800" trend={9.3} trendLabel="vs yesterday" Icon={IndianRupee} />
        <StatCard label="This Week" value="₹2,18,400" trend={12.7} trendLabel="this week" Icon={Calendar} iconColor="text-success" iconBg="bg-success/10" />
        <StatCard label="This Month" value="₹8,42,500" trend={18.2} trendLabel="this month" Icon={TrendingUp} iconColor="text-warning" iconBg="bg-warning/10" />
        <StatCard label="Total Revenue" value="₹1.24 Cr" trend={24.6} trendLabel="all time" Icon={Wallet} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 md:p-6">
          <h3 className="font-bold text-base mb-1">Revenue Over Time</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 12 months</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtINR(v), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#revArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-bold text-base mb-1">By Source</h3>
          <p className="text-xs text-muted-foreground mb-4">This month</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueBySource} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                  {revenueBySource.map((s, i) => <Cell key={i} fill={s.color} stroke="hsl(var(--background))" strokeWidth={2} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtINR(v), ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {revenueBySource.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground ml-auto tabular-nums">{fmtINR(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue by category */}
      <Card className="p-5 md:p-6">
        <h3 className="font-bold text-base mb-1">Revenue by Category</h3>
        <p className="text-xs text-muted-foreground mb-4">Top earning categories this month</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByCategory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v)} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} formatter={(v: number) => [fmtINR(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Transactions table */}
      <Card className="overflow-hidden">
        <div className="px-5 md:px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-base">Transactions</h3>
          <div className="text-xs text-muted-foreground">{transactions.length} entries</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.type}</td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">{fmtINR(t.amount)}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
