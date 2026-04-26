import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/creator/StatCard";
import { IndianRupee, Wallet, Clock, Loader2 } from "lucide-react";
import { formatINR, formatNumber } from "@/data/mock";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import { useCreatorStats, useCreatorAnalytics } from "@/hooks/useCreator";

export default function EarningsPage() {
  const [upi, setUpi] = useState("");
  const [amount, setAmount] = useState("");
  
  const { data: statsData, isLoading: statsLoading } = useCreatorStats();
  const { data: analyticsData, isLoading: analyticsLoading } = useCreatorAnalytics();

  if (statsLoading || analyticsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, topVideos } = statsData || {};
  const { earningsOverTime } = analyticsData || {};

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track revenue and request payouts.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total earnings" value={formatINR(stats?.totalEarnings || 0)} icon={IndianRupee} delta={24} />
        <StatCard label="This month" value={formatINR((stats?.totalEarnings || 0) * 0.4)} icon={Wallet} delta={12} gradient="bg-gradient-secondary" />
        <StatCard label="Pending payout" value={formatINR((stats?.totalEarnings || 0) * 0.1)} icon={Clock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-card">
          <CardHeader><CardTitle>Revenue trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={earningsOverTime || []}>
                <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--success))" fill="url(#eg)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card bg-gradient-primary text-primary-foreground">
          <CardHeader><CardTitle>Withdraw funds</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-primary-foreground/80">UPI / Bank</Label>
              <Input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@upi" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
            </div>
            <div>
              <Label className="text-primary-foreground/80">Amount (₹)</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="500" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
            </div>
            <Button variant="secondary" className="w-full bg-background text-foreground hover:bg-background/90" onClick={() => { if (!upi || !amount) return toast.error("Fill all fields"); toast.success("Withdrawal requested"); setUpi(""); setAmount(""); }}>
              Request Payout
            </Button>
            <p className="text-xs text-primary-foreground/80">Min ₹500. Processed every Friday.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle>Top video performance</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Views</TableHead><TableHead className="text-right">Estimated</TableHead></TableRow></TableHeader>
            <TableBody>
              {topVideos?.map((v: any) => (
                <TableRow key={v._id}>
                  <TableCell className="font-medium max-w-md truncate">{v.title}</TableCell>
                  <TableCell>{formatNumber(v.views || 0)}</TableCell>
                  <TableCell className="text-right font-semibold text-success">{formatINR((v.views || 0) * 0.15)}</TableCell>
                </TableRow>
              ))}
              {topVideos?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}