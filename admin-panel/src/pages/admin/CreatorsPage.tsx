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

  if (appsLoading || channelsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Creators</h1>
        <p className="text-sm text-muted-foreground">{pending.length} pending applications • {verified.length} verified creators</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending</div><div className="text-2xl font-bold mt-1">{pending.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Verified</div><div className="text-2xl font-bold mt-1">{verified.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Subs</div><div className="text-2xl font-bold mt-1">{fmtCompact(verified.reduce((s: number, a: any) => s + (a.subscribersCount || 0), 0))}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Est. Payouts</div><div className="text-2xl font-bold mt-1">{fmtINR(verified.length * 12_400)}</div></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="applications">Applications ({pending.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Applied</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {pending.map((a: any) => (
                  <TableRow key={a._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar src={a.user?.avatar} name={a.user?.username} />
                        <div>
                          <div className="font-medium">{a.user?.username}</div>
                          <div className="text-xs text-muted-foreground">{a.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-success" 
                        onClick={() => decideMutation.mutate({ id: a._id, status: "Approved" })}
                        disabled={decideMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => decideMutation.mutate({ id: a._id, status: "Rejected" })}
                        disabled={decideMutation.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast("Email sent to creator")}><Mail className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pending.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No pending applications</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-4">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="text-right">Est. Revenue</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {verified.map((a: any) => (
                  <TableRow key={a._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar src={a.owner?.avatar} name={a.owner?.username} />
                        <div className="font-medium">{a.owner?.username}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{fmtCompact(a.subscribersCount)}</TableCell>
                    <TableCell className="text-right font-semibold text-success">{fmtINR(a.subscribersCount * 0.4 | 0)}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(a.createdAt)}</TableCell>
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
              {top.map((c: any, i: number) => (
                <div key={c._id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${i === 0 ? "bg-warning/20 text-warning" : i < 3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <UserAvatar src={c.owner?.avatar} name={c.owner?.username} />
                  <div className="flex-1 min-w-0"><div className="font-medium truncate">{c.owner?.username}</div><div className="text-xs text-muted-foreground">@{c.name}</div></div>
                  <div className="text-right"><div className="font-bold">{fmtCompact(c.subscribersCount)}</div><div className="text-xs text-muted-foreground">subscribers</div></div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
