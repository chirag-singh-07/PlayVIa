import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDate } from "@/lib/adminMock";
import { Search, Eye, Trash2, X, Flag, Loader2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"all" | "video" | "user" | "comment">("all");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: adminService.getAllReports,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.resolveReport(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success(`Report ${variables.status}`);
    },
    onError: () => toast.error("Failed to update report")
  });

  const filtered = useMemo(() => list.filter((r: any) => {
    if (tab !== "all" && r.targetType !== tab) return false;
    if (priority !== "all" && r.priority !== priority) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q && !(`${r.targetId} ${r.reporter?.username} ${r.reason}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [list, tab, q, priority, status]);

  const stats = useMemo(() => ({
    total: list.length,
    pending: list.filter((r: any) => r.status === "pending").length,
    resolved: list.filter((r: any) => r.status === "resolved").length,
    highPriority: list.filter((r: any) => r.priority === "High" && r.status === "pending").length,
  }), [list]);

  if (isLoading) {
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
          <h1 className="text-2xl font-bold">Content Reports</h1>
          <p className="text-sm text-muted-foreground">Manage and triage community reports</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{stats.highPriority} High Priority Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Reports</div>
          <div className="text-3xl font-black mt-2">{stats.total}</div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flag className="w-12 h-12" />
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending</div>
          <div className="text-3xl font-black mt-2 text-warning">{stats.pending}</div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Resolved</div>
          <div className="text-3xl font-black mt-2 text-success">{stats.resolved}</div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-12 h-12" />
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm bg-card/50 backdrop-blur-sm relative overflow-hidden group">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Critical</div>
          <div className="text-3xl font-black mt-2 text-destructive">{stats.highPriority}</div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full lg:w-auto">
          <TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="flex-1 lg:flex-none">All</TabsTrigger>
            <TabsTrigger value="video" className="flex-1 lg:flex-none">Videos</TabsTrigger>
            <TabsTrigger value="user" className="flex-1 lg:flex-none">Users</TabsTrigger>
            <TabsTrigger value="comment" className="flex-1 lg:flex-none">Comments</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports..." className="pl-9 bg-muted/20 border-none" />
          </div>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-36 bg-muted/20 border-none"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36 bg-muted/20 border-none"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Target Content</TableHead>
              <TableHead className="hidden md:table-cell">Reporter</TableHead>
              <TableHead className="hidden lg:table-cell">Reason & Context</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r: any) => (
              <TableRow key={r._id} className="hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">{r.targetType}</span>
                    <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">{r.targetId}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="font-medium text-sm">{r.reporter?.username}</div>
                  <div className="text-[10px] text-muted-foreground">{fmtDate(r.createdAt)}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[250px]">
                  <div className="text-sm font-semibold truncate">{r.reason}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.details || "No additional details provided"}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge status={r.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                      onClick={() => updateMutation.mutate({ id: r._id, status: "resolved" })} 
                      disabled={updateMutation.isPending}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
                      onClick={() => updateMutation.mutate({ id: r._id, status: "dismissed" })} 
                      disabled={updateMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => toast.error("Content removal not implemented yet")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                  <Flag className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-lg">Clean Sweep!</p>
                  <p className="text-sm">No reports matching your current filters.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
