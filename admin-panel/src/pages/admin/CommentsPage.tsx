import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateComments, fmtDate, type CommentRecord } from "@/lib/adminMock";
import { Search, EyeOff, Trash2, ShieldAlert, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function CommentsPage() {
  const [list, setList] = useState<CommentRecord[]>(() => generateComments());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => list.filter((c) => {
    if (status !== "all" && c.status !== status) return false;
    if (q && !(`${c.text} ${c.user} ${c.video}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [list, q, status]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  function toggleAll() {
    setSelected((p) => {
      if (allSelected) { const n = new Set(p); filtered.forEach((c) => n.delete(c.id)); return n; }
      const n = new Set(p); filtered.forEach((c) => n.add(c.id)); return n;
    });
  }
  function setStatusOne(id: string, s: CommentRecord["status"]) {
    setList((p) => p.map((c) => c.id === id ? { ...c, status: s } : c));
  }
  function bulkAction(s: CommentRecord["status"] | "delete") {
    if (selected.size === 0) { toast.error("Select comments first"); return; }
    if (s === "delete") {
      setList((p) => p.filter((c) => !selected.has(c.id)));
      toast.success(`${selected.size} comments deleted`);
    } else {
      setList((p) => p.map((c) => selected.has(c.id) ? { ...c, status: s } : c));
      toast.success(`${selected.size} comments marked as ${s}`);
    }
    setSelected(new Set());
  }

  const counts = useMemo(() => ({
    all: list.length,
    Visible: list.filter((c) => c.status === "Visible").length,
    Hidden: list.filter((c) => c.status === "Hidden").length,
    Reported: list.filter((c) => c.status === "Reported").length,
    Spam: list.filter((c) => c.status === "Spam").length,
  }), [list]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comments</h1>
        <p className="text-sm text-muted-foreground">Moderate user comments across all videos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { k: "all", label: "Total", v: counts.all },
          { k: "Visible", label: "Visible", v: counts.Visible },
          { k: "Hidden", label: "Hidden", v: counts.Hidden },
          { k: "Reported", label: "Reported", v: counts.Reported },
          { k: "Spam", label: "Spam", v: counts.Spam },
        ].map((s) => (
          <Card key={s.k} className={`p-4 cursor-pointer transition-all ${status === s.k ? "ring-2 ring-primary" : "hover:shadow-card"}`} onClick={() => setStatus(s.k)}>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search comments, user, or video..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Visible">Visible</SelectItem>
            <SelectItem value="Hidden">Hidden</SelectItem>
            <SelectItem value="Reported">Reported</SelectItem>
            <SelectItem value="Spam">Spam</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => bulkAction("Hidden")}><EyeOff className="w-4 h-4 mr-1" />Hide</Button>
          <Button variant="outline" size="sm" onClick={() => bulkAction("Spam")}><ShieldAlert className="w-4 h-4 mr-1" />Spam</Button>
          <Button variant="destructive" size="sm" onClick={() => bulkAction("delete")}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="hidden md:table-cell">User</TableHead>
              <TableHead className="hidden lg:table-cell">Video</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell><Checkbox checked={selected.has(c.id)} onCheckedChange={(v) => {
                  setSelected((p) => { const n = new Set(p); v ? n.add(c.id) : n.delete(c.id); return n; });
                }} /></TableCell>
                <TableCell className="max-w-xs"><span className="line-clamp-2 text-sm">{c.text}</span></TableCell>
                <TableCell className="hidden md:table-cell text-sm">{c.user}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[180px] truncate">{c.video}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(c.date)}</TableCell>
                <TableCell className="text-right text-sm">{c.likes.toLocaleString("en-IN")}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => setStatusOne(c.id, "Hidden")} title="Hide"><EyeOff className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatusOne(c.id, "Spam")} title="Spam"><ShieldAlert className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setList((p) => p.filter((x) => x.id !== c.id)); toast.success("Deleted"); }}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />No comments match
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
