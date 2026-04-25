import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateCreatorApplications, fmtDate, fmtCompact, fmtINR, type CreatorApplication } from "@/lib/adminMock";
import { Check, X, Mail, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function CreatorsPage() {
  const [apps, setApps] = useState<CreatorApplication[]>(() => generateCreatorApplications());

  const pending = apps.filter((a) => a.status === "Pending");
  const verified = apps.filter((a) => a.status === "Approved");

  function decide(id: string, status: CreatorApplication["status"]) {
    setApps((p) => p.map((a) => a.id === id ? { ...a, status } : a));
    toast.success(`Application ${status.toLowerCase()}`);
  }

  const top = useMemo(() => [...verified].sort((a, b) => b.subscribers - a.subscribers).slice(0, 8), [verified]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Creators</h1>
        <p className="text-sm text-muted-foreground">{pending.length} pending applications • {verified.length} verified creators</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending</div><div className="text-2xl font-bold mt-1">{pending.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Verified</div><div className="text-2xl font-bold mt-1">{verified.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Subs</div><div className="text-2xl font-bold mt-1">{fmtCompact(verified.reduce((s, a) => s + a.subscribers, 0))}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Est. Payouts</div><div className="text-2xl font-bold mt-1">{fmtINR(verified.length * 12_400)}</div></Card>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications ({pending.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Channel</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="text-right hidden md:table-cell">Videos</TableHead>
                <TableHead className="hidden md:table-cell">Applied</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {apps.filter((a) => a.status === "Pending").map((a) => (
                  <TableRow key={a.id}>
                    <TableCell><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${a.avatarColor} text-white grid place-items-center text-sm font-semibold`}>{a.name.split(" ").map((n) => n[0]).join("")}</div><div><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.email}</div></div></div></TableCell>
                    <TableCell className="text-sm">@{a.channel}</TableCell>
                    <TableCell className="text-right font-semibold">{fmtCompact(a.subscribers)}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{a.videos}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(a.appliedDate)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" className="text-success" onClick={() => decide(a.id, "Approved")}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => decide(a.id, "Rejected")}><X className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => toast("Email sent to creator")}><Mail className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pending.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No pending applications</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-4">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Creator</TableHead><TableHead>Channel</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="text-right">Videos</TableHead>
                <TableHead className="text-right">Est. Revenue</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {verified.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${a.avatarColor} text-white grid place-items-center text-sm font-semibold`}>{a.name.split(" ").map((n) => n[0]).join("")}</div><div className="font-medium">{a.name}</div></div></TableCell>
                    <TableCell className="text-sm">@{a.channel}</TableCell>
                    <TableCell className="text-right font-semibold">{fmtCompact(a.subscribers)}</TableCell>
                    <TableCell className="text-right">{a.videos}</TableCell>
                    <TableCell className="text-right font-semibold text-success">{fmtINR(a.subscribers * 0.4 | 0)}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(a.appliedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-warning" /><h3 className="font-semibold">Top Creators by Subscribers</h3></div>
            <div className="space-y-3">
              {top.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${i === 0 ? "bg-warning/20 text-warning" : i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <div className={`w-9 h-9 rounded-full ${c.avatarColor} text-white grid place-items-center text-sm font-semibold`}>{c.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{c.name}</div><div className="text-xs text-muted-foreground">@{c.channel} • {c.videos} videos</div></div>
                  <div className="text-right"><div className="font-bold">{fmtCompact(c.subscribers)}</div><div className="text-xs text-muted-foreground">subscribers</div></div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
