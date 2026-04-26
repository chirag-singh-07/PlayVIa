import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminService } from "@/lib/adminService";
import { Search, Check, X, BadgeIndianRupee, Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtINR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function WithdrawalsPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: adminService.getWithdrawals,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminService.updateWithdrawalStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      toast.success(`Withdrawal ${variables.status.toLowerCase()}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  });

  const pending = list.filter((w: any) => w.status === "pending");
  const totalPending = pending.reduce((s: number, w: any) => s + w.amount, 0);
  const paidTotal = list.filter((w: any) => w.status === "paid").reduce((s: number, w: any) => s + w.amount, 0);

  const filtered = useMemo(() => list.filter((w: any) => {
    if (status !== "all" && w.status !== status) return false;
    const searchStr = `${w.user?.username} ${w.details?.upi || ""} ${w.details?.accountNumber || ""} ${w._id}`.toLowerCase();
    if (q && !searchStr.includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, status]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <p className="text-sm text-muted-foreground">Process creator payout requests</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-warning/30">
          <div className="text-xs text-muted-foreground">Pending requests</div>
          <div className="text-2xl font-bold mt-1 text-warning">{pending.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Pending amount</div>
          <div className="text-2xl font-bold mt-1">{fmtINR(totalPending)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Paid (all-time)</div>
          <div className="text-2xl font-bold mt-1 text-success">{fmtINR(paidTotal)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total requests</div>
          <div className="text-2xl font-bold mt-1">{list.length}</div>
        </Card>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search creator, account, or ID..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead className="hidden md:table-cell">Account</TableHead>
              <TableHead className="hidden lg:table-cell">Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((w: any) => (
              <TableRow key={w._id} className={w.status === "pending" ? "bg-warning/5" : ""}>
                <TableCell className="font-mono text-xs truncate max-w-[80px]">{w._id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                      {w.user?.username?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <span className="font-medium">{w.user?.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{fmtINR(w.amount)}</TableCell>
                <TableCell className="hidden md:table-cell text-sm capitalize">{w.method}</TableCell>
                <TableCell className="hidden md:table-cell text-sm font-mono">
                  {w.method === "upi" ? w.details?.upi : `...${w.details?.accountNumber?.slice(-4)}`}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{fmtDate(w.createdAt)}</TableCell>
                <TableCell><StatusBadge status={w.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {w.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-success" 
                        onClick={() => updateMutation.mutate({ id: w._id, status: "approved" })}
                        disabled={updateMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => updateMutation.mutate({ id: w._id, status: "rejected" })}
                        disabled={updateMutation.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {(w.status === "approved") && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => updateMutation.mutate({ id: w._id, status: "paid" })}
                      disabled={updateMutation.isPending}
                    >
                      <BadgeIndianRupee className="w-4 h-4 mr-1" />Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />No withdrawals match
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
