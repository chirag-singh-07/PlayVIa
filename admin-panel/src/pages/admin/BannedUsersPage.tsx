import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateBanned, fmtDate, type BannedRecord } from "@/lib/adminMock";
import { Search, Undo2, Clock, UserX } from "lucide-react";
import { toast } from "sonner";

export default function BannedUsersPage() {
  const [list, setList] = useState<BannedRecord[]>(() => generateBanned());
  const [q, setQ] = useState("");

  const filtered = useMemo(() => list.filter((b) => !q || `${b.name} ${b.email} ${b.reason}`.toLowerCase().includes(q.toLowerCase())), [list, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banned Users</h1>
        <p className="text-sm text-muted-foreground">{list.length} accounts under enforcement</p>
      </div>

      <Card className="p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email or reason..." className="pl-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="hidden md:table-cell">Banned On</TableHead>
            <TableHead className="hidden lg:table-cell">By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${b.avatarColor} text-white grid place-items-center text-sm font-semibold`}>{b.name.split(" ").map((n) => n[0]).join("")}</div><div><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.email}</div></div></div></TableCell>
                <TableCell className="hidden md:table-cell">{b.reason}</TableCell>
                <TableCell><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${b.duration === "Permanent" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20"}`}>{b.duration}</span></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(b.bannedDate)}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{b.bannedBy}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => { setList((p) => p.filter((x) => x.id !== b.id)); toast.success("User unbanned"); }}><Undo2 className="w-4 h-4 mr-1" />Unban</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast("Ban extended")}><Clock className="w-4 h-4 mr-1" />Extend</Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />No banned users
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
