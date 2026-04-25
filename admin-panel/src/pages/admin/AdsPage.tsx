import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateAdCampaigns, fmtDate, fmtINR, fmtCompact, type AdCampaign } from "@/lib/adminMock";
import { Search, Pause, Play, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function AdsPage() {
  const [list, setList] = useState<AdCampaign[]>(() => generateAdCampaigns());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const stats = useMemo(() => ({
    active: list.filter((c) => c.status === "Active").length,
    revenue: list.reduce((s, c) => s + c.spent, 0),
    impressions: list.reduce((s, c) => s + c.impressions, 0),
    clicks: list.reduce((s, c) => s + c.clicks, 0),
  }), [list]);

  const filtered = useMemo(() => list.filter((c) => {
    if (status !== "all" && c.status !== status) return false;
    if (q && !`${c.name} ${c.advertiser}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, status]);

  function toggle(id: string) {
    setList((p) => p.map((c) => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c));
  }
  function remove(id: string) {
    setList((p) => p.filter((c) => c.id !== id));
    toast.success("Campaign deleted");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ad Management</h1>
        <p className="text-sm text-muted-foreground">Manage advertising campaigns running on PlayVia</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Active campaigns</div><div className="text-2xl font-bold mt-1">{stats.active}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total revenue</div><div className="text-2xl font-bold mt-1 text-success">{fmtINR(stats.revenue)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Impressions</div><div className="text-2xl font-bold mt-1">{fmtCompact(stats.impressions)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Clicks</div><div className="text-2xl font-bold mt-1">{fmtCompact(stats.clicks)}</div></Card>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns or advertisers..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => toast("Campaign builder coming soon")}><Megaphone className="w-4 h-4 mr-1" />New Campaign</Button>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead className="hidden md:table-cell">Advertiser</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right hidden md:table-cell">Spent</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Impressions</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="hidden lg:table-cell">Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="max-w-[220px]">
                  <div className="font-medium truncate">{c.name}</div>
                  <Progress value={(c.spent / c.budget) * 100} className="h-1.5 mt-1.5 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{c.advertiser}</TableCell>
                <TableCell className="text-right font-semibold">{fmtINR(c.budget)}</TableCell>
                <TableCell className="text-right hidden md:table-cell">{fmtINR(c.spent)}</TableCell>
                <TableCell className="text-right hidden lg:table-cell">{fmtCompact(c.impressions)}</TableCell>
                <TableCell className="text-right font-semibold">{c.ctr}%</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">{fmtDate(c.startDate)} → {fmtDate(c.endDate)}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => toggle(c.id)}>{c.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
