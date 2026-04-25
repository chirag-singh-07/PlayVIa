import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDate } from "@/lib/adminMock";
import { Search, Eye, Trash2, AlertTriangle, X, Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function ReportsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "video" | "user" | "comment">("all");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllReports();
      setList(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdate = async (id: string, s: string) => {
    try {
      await adminService.resolveReport(id, s);
      toast.success(`Report ${s}`);
      fetchReports();
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  const filtered = useMemo(() => list.filter((r) => {
    if (tab !== "all" && r.targetType !== tab) return false;
    if (priority !== "all" && r.priority !== priority) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q && !(`${r.targetId} ${r.reporter?.username} ${r.reason}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [list, tab, q, priority, status]);

  if (loading && list.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Triage user-submitted reports across content</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All ({list.length})</TabsTrigger>
          <TabsTrigger value="video">Videos ({list.filter((r) => r.targetType === "video").length})</TabsTrigger>
          <TabsTrigger value="user">Users ({list.filter((r) => r.targetType === "user").length})</TabsTrigger>
          <TabsTrigger value="comment">Comments ({list.filter((r) => r.targetType === "comment").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search target, reporter or reason..." className="pl-9" />
        </div>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Target ID</TableHead>
              <TableHead className="hidden md:table-cell">Reported By</TableHead>
              <TableHead className="hidden lg:table-cell">Reason</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r._id}>
                <TableCell><span className="text-xs font-semibold uppercase">{r.targetType}</span></TableCell>
                <TableCell className="font-mono text-xs max-w-[120px] truncate">{r.targetId}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{r.reporter?.username}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{r.reason}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(r.createdAt)}</TableCell>
                <TableCell><StatusBadge status={r.priority} /></TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => handleUpdate(r._id, "resolved")} title="Resolve"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleUpdate(r._id, "dismissed")} title="Dismiss"><X className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" title="Remove content"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                <Flag className="w-8 h-8 mx-auto mb-2 opacity-50" />No reports match
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
