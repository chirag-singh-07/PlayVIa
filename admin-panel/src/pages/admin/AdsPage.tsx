import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDate, fmtINR, fmtCompact } from "@/lib/adminMock";
import { adminService } from "@/lib/adminService";
import { Search, Pause, Play, Trash2, Megaphone, Loader2, ArrowUpRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdsPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: adminService.getAds,
  });

  const stats = useMemo(() => ({
    active: ads.filter((c: any) => c.status === "Active").length,
    revenue: ads.reduce((s: number, c: any) => s + (c.spent || 0), 0),
    impressions: ads.reduce((s: number, c: any) => s + (c.impressions || 0), 0),
    clicks: ads.reduce((s: number, c: any) => s + (c.clicks || 0), 0),
  }), [ads]);

  const filtered = useMemo(() => ads.filter((c: any) => {
    if (status !== "all" && c.status !== status) return false;
    if (q && !`${c.name} ${c.advertiser}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [ads, q, status]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      toast.success("Campaign updated");
    },
    onError: () => toast.error("Update failed")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      toast.success("Campaign deleted");
    },
    onError: () => toast.error("Delete failed")
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ad Management</h1>
          <p className="text-sm text-muted-foreground">Manage advertising campaigns running on PlayVia</p>
        </div>
        <Button className="shadow-glow" onClick={() => toast("Campaign builder coming soon")}>
          <Megaphone className="w-4 h-4 mr-2" />New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Ads</div>
          <div className="text-3xl font-black mt-2">{stats.active}</div>
          <div className="text-[10px] text-success font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +2 from yesterday
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Megaphone className="w-12 h-12" />
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ad Revenue</div>
          <div className="text-3xl font-black mt-2 text-success">{fmtINR(stats.revenue)}</div>
          <div className="text-[10px] text-success font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.5% this week
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-12 h-12" />
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Impressions</div>
          <div className="text-3xl font-black mt-2">{fmtCompact(stats.impressions)}</div>
          <Progress value={75} className="h-1 mt-3" />
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Clicks</div>
          <div className="text-3xl font-black mt-2">{fmtCompact(stats.clicks)}</div>
          <div className="text-[10px] text-muted-foreground mt-2">Avg. CTR: {(stats.clicks / (stats.impressions || 1) * 100).toFixed(2)}%</div>
        </Card>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3 border-none shadow-sm bg-card/50">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns or advertisers..." className="pl-9 bg-muted/20 border-none" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 bg-muted/20 border-none"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden bg-card/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Campaign Details</TableHead>
              <TableHead className="hidden md:table-cell">Advertiser</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right hidden lg:table-cell">CTR</TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c: any) => (
              <TableRow key={c._id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="max-w-[250px]">
                  <div className="font-bold truncate">{c.name}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Progress value={(c.spent / c.budget) * 100} className="h-1 flex-1" />
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{Math.round((c.spent / c.budget) * 100)}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm font-medium">{c.advertiser}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-bold">{fmtINR(c.budget)}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Spent: {fmtINR(c.spent)}</div>
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  <div className="font-mono font-bold text-primary">{c.ctr || 0}%</div>
                  <div className="text-[10px] text-muted-foreground">{fmtCompact(c.clicks || 0)} clicks</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="text-xs font-medium">{fmtDate(c.startDate)}</div>
                  <div className="text-[10px] text-muted-foreground">to {fmtDate(c.endDate)}</div>
                </TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => updateMutation.mutate({ id: c._id, data: { status: c.status === "Active" ? "Paused" : "Active" } })}
                  >
                    {c.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMutation.mutate(c._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No campaigns found matching filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
