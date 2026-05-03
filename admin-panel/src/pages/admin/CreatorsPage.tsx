import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDate, fmtCompact, fmtINR } from "@/lib/adminMock";
import { Check, X, Mail, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";
import { UserAvatar } from "@/components/admin/UserAvatar";

export default function CreatorsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("applications");

  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ["admin-creator-apps"],
    queryFn: adminService.getCreatorApplications,
  });

  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ["admin-channels"],
    queryFn: adminService.getChannels,
  });

  const decideMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateCreatorApplication(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-creator-apps"] });
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      toast.success(`Application ${variables.status.toLowerCase()}`);
    },
    onError: () => toast.error("Failed to update application")
  });

  const pending = apps.filter((a: any) => a.status === "Pending");
  const verified = channels;
  const top = useMemo(() => [...verified].sort((a: any, b: any) => b.subscribersCount - a.subscribersCount).slice(0, 8), [verified]);

  const totalSubs = verified.reduce((s: number, a: any) => s + (a.subscribersCount || 0), 0);
  const totalVideos = verified.reduce((s: number, a: any) => s + (a.videoCount || 0), 0);
  const totalViews = verified.reduce((s: number, a: any) => s + (a.totalViews || 0), 0);

  if (appsLoading || channelsLoading) {
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
          <h1 className="text-2xl font-bold">Creators</h1>
          <p className="text-sm text-muted-foreground">{pending.length} pending applications • {verified.length} verified creators</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending</div><div className="text-2xl font-bold mt-1 text-warning">{pending.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Verified</div><div className="text-2xl font-bold mt-1 text-success">{verified.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Subs</div><div className="text-2xl font-bold mt-1">{fmtCompact(totalSubs)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Videos</div><div className="text-2xl font-bold mt-1">{fmtCompact(totalVideos)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Views</div><div className="text-2xl font-bold mt-1">{fmtCompact(totalViews)}</div></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="applications">Applications ({pending.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30"><TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Applied</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {pending.map((a: any) => (
                  <TableRow key={a._id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar src={a.user?.avatar} name={a.user?.username || "Creator"} />
                        <div>
                          <div className="font-medium">{a.user?.username || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{a.user?.email || "No email"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" className="text-success h-8 w-8 p-0" onClick={() => decideMutation.mutate({ id: a._id, status: "Approved" })} disabled={decideMutation.isPending}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive h-8 w-8 p-0" onClick={() => decideMutation.mutate({ id: a._id, status: "Rejected" })} disabled={decideMutation.isPending}><X className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast("Email sent")}><Mail className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pending.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No pending applications</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30"><TableRow>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Videos</TableHead>
                <TableHead className="text-right">Total Views</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="hidden md:table-cell text-right">Joined</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {verified.map((a: any) => (
                  <TableRow key={a._id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar src={a.owner?.avatar || a.avatar} name={a.owner?.username || a.name || "Creator"} />
                        <div className="font-medium">{a.owner?.username || a.name || "Unknown"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{fmtCompact(a.videoCount || 0)}</TableCell>
                    <TableCell className="text-right font-medium text-primary">{fmtCompact(a.totalViews || 0)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmtCompact(a.subscribersCount)}</TableCell>
                    <TableCell className="hidden md:table-cell text-right text-sm text-muted-foreground tabular-nums">{fmtDate(a.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 text-warning" /><h3 className="font-semibold text-lg">Creator Rankings</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {top.map((c: any, i: number) => (
                <div key={c._id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/40 transition-all group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${i === 0 ? "bg-warning text-warning-foreground" : i < 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <UserAvatar src={c.owner?.avatar || c.avatar} name={c.owner?.username || c.name} className="w-12 h-12" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold group-hover:text-primary transition-colors">{c.owner?.username || c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Loader2 className="w-3 h-3" /> {fmtCompact(c.videoCount)} videos</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>{fmtCompact(c.totalViews)} views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black tracking-tight">{fmtCompact(c.subscribersCount)}</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Subs</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
