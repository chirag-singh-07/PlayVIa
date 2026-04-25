import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateLogs, fmtDateTime, type LogRecord } from "@/lib/adminMock";
import { Search, Download, ScrollText } from "lucide-react";
import { toast } from "sonner";

export default function LogsPage() {
  const [list] = useState<LogRecord[]>(() => generateLogs());
  const [q, setQ] = useState("");
  const [admin, setAdmin] = useState("all");
  const [type, setType] = useState("all");

  const admins = useMemo(() => Array.from(new Set(list.map((l) => l.admin))), [list]);

  const filtered = useMemo(() => list.filter((l) => {
    if (admin !== "all" && l.admin !== admin) return false;
    if (type !== "all" && l.type !== type) return false;
    if (q && !`${l.action} ${l.target} ${l.ip}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [list, q, admin, type]);

  function exportCSV() {
    const header = "Date,Admin,Action,Type,Target,IP\n";
    const rows = filtered.map((l) => `"${fmtDateTime(l.date)}","${l.admin}","${l.action}","${l.type}","${l.target}","${l.ip}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `playvia-logs-${Date.now()}.csv`;
    a.click();
    toast.success("Logs exported");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">Audit trail of every admin action</p>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search action, target or IP..." className="pl-9" />
        </div>
        <Select value={admin} onValueChange={setAdmin}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Admin" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All admins</SelectItem>
            {admins.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Create">Create</SelectItem>
            <SelectItem value="Edit">Edit</SelectItem>
            <SelectItem value="Delete">Delete</SelectItem>
            <SelectItem value="Login">Login</SelectItem>
            <SelectItem value="Logout">Logout</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" />Export CSV</Button>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead className="w-44">Time</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Target</TableHead>
            <TableHead className="hidden md:table-cell">IP</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 100).map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{fmtDateTime(l.date)}</TableCell>
                <TableCell className="text-sm">{l.admin}</TableCell>
                <TableCell className="text-sm font-medium">{l.action}</TableCell>
                <TableCell><StatusBadge status={l.type} /></TableCell>
                <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">{l.target}</TableCell>
                <TableCell className="hidden md:table-cell text-xs font-mono">{l.ip}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />No logs match
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        {filtered.length > 100 && <div className="p-3 text-center text-xs text-muted-foreground border-t">Showing first 100 of {filtered.length} entries</div>}
      </Card>
    </div>
  );
}
