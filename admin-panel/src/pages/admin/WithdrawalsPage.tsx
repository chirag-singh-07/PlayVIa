import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateWithdrawals, fmtDate, fmtINR, type Withdrawal } from "@/lib/adminMock";
import { Search, Check, X, BadgeIndianRupee, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function WithdrawalsPage() {
  const [list, setList] = useState<Withdrawal[]>(() => generateWithdrawals());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const pending = list.filter((w) => w.status === "Pending");
  const totalPending = pending.reduce((s, w) => s + w.amount, 0);
  const paidTotal = list.filter((w) => w.status === "Paid").reduce((s, w) => s + w.amount, 0);

  const filtered = useMemo(() => list.filter((w) => {
    if (status !== "all" && w.status !== status) return false;
    if (q && !`${w.creator} ${w.account} ${w.id}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, status]);

  function update(id: string, s: Withdrawal["status"]) {
    setList((p) => p.map((w) => w.id === id ? { ...w, status: s } : w));
    toast.success(`Withdrawal ${s.toLowerCase()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <p className="text-sm text-muted-foreground">Process creator payout requests</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-warning/30"><div className="text-xs text-muted-foreground">Pending requests</div><div className="text-2xl font-bold mt-1 text-warning">{pending.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending amount</div><div className="text-2xl font-bold mt-1">{fmtINR(totalPending)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Paid (all-time)</div><div className="text-2xl font-bold mt-1 text-success">{fmtINR(paidTotal)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total requests</div><div className="text-2xl font-bold mt-1">{list.length}</div></Card>
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
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Method</TableHead>
            <TableHead className="hidden md:table-cell">Account</TableHead>
            <TableHead className="hidden lg:table-cell">Requested</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w.id} className={w.status === "Pending" ? "bg-warning/5" : ""}>
                <TableCell className="font-mono text-xs">{w.id}</TableCell>
                <TableCell><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full ${w.avatarColor} text-white grid place-items-center text-xs font-semibold`}>{w.creator.split(" ").map((n) => n[0]).join("")}</div><span className="font-medium">{w.creator}</span></div></TableCell>
                <TableCell className="text-right font-semibold">{fmtINR(w.amount)}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{w.method}</TableCell>
                <TableCell className="hidden md:table-cell text-sm font-mono">{w.account}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{fmtDate(w.requested)}</TableCell>
                <TableCell><StatusBadge status={w.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {w.status === "Pending" && <>
                    <Button size="sm" variant="ghost" className="text-success" onClick={() => update(w.id, "Approved")}><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => update(w.id, "Rejected")}><X className="w-4 h-4" /></Button>
                  </>}
                  {(w.status === "Approved" || w.status === "Processing") && (
                    <Button size="sm" variant="ghost" onClick={() => update(w.id, "Paid")}><BadgeIndianRupee className="w-4 h-4 mr-1" />Mark Paid</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />No withdrawals match
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
