import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { videos, subscribers, formatNumber, formatINR } from "@/data/mock";
import { Ban, CheckCircle, Eye, XCircle, Clock, Building2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PayoutRequest, getPayoutRequests, updatePayoutStatus } from "@/lib/payouts";

export const AdminUsersPage = () => (
  <div className="space-y-6 max-w-[1400px]">
    <div><h1 className="text-3xl font-bold">Users</h1><p className="text-muted-foreground">Manage creators and viewers.</p></div>
    <Card className="border-0 shadow-card"><CardHeader><CardTitle>{subscribers.length} users</CardTitle></CardHeader><CardContent>
      <Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Activity</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{subscribers.map((s, i) => (
          <TableRow key={s.id}><TableCell><div className="flex items-center gap-3"><Avatar><AvatarImage src={s.avatar} /><AvatarFallback>{s.name[0]}</AvatarFallback></Avatar><div><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.name.toLowerCase().replace(" ", ".")}@gmail.com</div></div></div></TableCell>
            <TableCell><Badge variant={i % 3 === 0 ? "default" : "secondary"}>{i % 3 === 0 ? "Creator" : "Viewer"}</Badge></TableCell>
            <TableCell className="text-sm text-muted-foreground">{s.videos} videos watched</TableCell>
            <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => toast("Profile opened")}><Eye className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("User banned")}><Ban className="h-4 w-4" /></Button></TableCell>
          </TableRow>))}</TableBody></Table>
    </CardContent></Card>
  </div>
);

export const AdminVideosPage = () => (
  <div className="space-y-6 max-w-[1400px]">
    <div><h1 className="text-3xl font-bold">Videos</h1><p className="text-muted-foreground">Moderate platform content.</p></div>
    <Card className="border-0 shadow-card"><CardHeader><CardTitle>{videos.length} videos</CardTitle></CardHeader><CardContent>
      <Table><TableHeader><TableRow><TableHead>Video</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>{videos.map((v) => (
          <TableRow key={v.id}><TableCell><div className="flex items-center gap-3"><img src={v.thumbnail} className="h-10 w-16 rounded object-cover" /><div className="font-medium max-w-xs truncate">{v.title}</div></div></TableCell>
            <TableCell><Badge variant={v.status === "Published" ? "default" : "secondary"}>{v.status}</Badge></TableCell>
            <TableCell>{formatNumber(v.views)}</TableCell>
            <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => toast.success("Approved")}><CheckCircle className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Removed")}><Ban className="h-4 w-4" /></Button></TableCell>
          </TableRow>))}</TableBody></Table>
    </CardContent></Card>
  </div>
);

export const AdminPayoutsPage = () => {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);

  useEffect(() => {
    const refresh = () => setRequests(getPayoutRequests());
    refresh();
    window.addEventListener("payouts-change", refresh);
    return () => window.removeEventListener("payouts-change", refresh);
  }, []);

  const pending = requests.filter((r) => r.status === "pending");
  const totalPending = pending.reduce((s, r) => s + r.amount, 0);
  const totalPaid = requests.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);

  const handle = (id: string, status: PayoutRequest["status"], msg: string) => {
    updatePayoutStatus(id, status);
    toast.success(msg);
  };

  const statusBadge = (s: PayoutRequest["status"]) => {
    const map = {
      pending: { v: "Pending", cls: "bg-warning/15 text-warning border-warning/30", Icon: Clock },
      approved: { v: "Approved", cls: "bg-primary/15 text-primary border-primary/30", Icon: CheckCircle },
      paid: { v: "Paid", cls: "bg-success/15 text-success border-success/30", Icon: CheckCircle },
      rejected: { v: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: XCircle },
    } as const;
    const m = map[s];
    return (
      <Badge variant="outline" className={`gap-1 ${m.cls}`}>
        <m.Icon className="h-3 w-3" />
        {m.v}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">Review and approve creator withdrawal requests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-card"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending requests</p><p className="text-2xl font-bold mt-1">{pending.length}</p></CardContent></Card>
        <Card className="border-0 shadow-card"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending amount</p><p className="text-2xl font-bold mt-1">{formatINR(totalPending)}</p></CardContent></Card>
        <Card className="border-0 shadow-card"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Lifetime paid</p><p className="text-2xl font-bold mt-1 text-success">{formatINR(totalPaid)}</p></CardContent></Card>
      </div>

      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle>{requests.length} payout request{requests.length === 1 ? "" : "s"}</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No payout requests yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.creatorName}</div>
                      <div className="text-xs text-muted-foreground">{r.creatorEmail}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatINR(r.amount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        {r.method === "upi" ? <Smartphone className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                        {r.method.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.destination}
                      {r.method === "bank" && <div className="text-xs">{r.bank.bankName} • {r.bank.ifsc}</div>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.requestedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handle(r.id, "rejected", "Request rejected")}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="bg-gradient-primary" onClick={() => handle(r.id, "approved", "Request approved")}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => handle(r.id, "paid", "Marked as paid")}>
                          Mark paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminReportsPage = () => (
  <div className="space-y-6 max-w-[1400px]">
    <div><h1 className="text-3xl font-bold">Reports</h1><p className="text-muted-foreground">User-flagged content.</p></div>
    <div className="grid gap-3">{videos.slice(0, 6).map((v, i) => (
      <Card key={v.id} className="border-0 shadow-card"><CardContent className="p-4 flex items-center gap-4">
        <img src={v.thumbnail} className="h-14 w-24 rounded object-cover" />
        <div className="flex-1 min-w-0"><div className="font-medium truncate">{v.title}</div><div className="text-xs text-muted-foreground">Reported by {3 + i} users · Reason: {["Spam","Misleading","Copyright","Inappropriate"][i % 4]}</div></div>
        <Button size="sm" variant="outline" onClick={() => toast.success("Dismissed")}>Dismiss</Button>
        <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast.error("Removed")}>Remove</Button>
      </CardContent></Card>))}</div>
  </div>
);