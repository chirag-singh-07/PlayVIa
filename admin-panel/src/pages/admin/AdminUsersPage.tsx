import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateAdminAccounts, fmtDateTime, type AdminAccount } from "@/lib/adminMock";
import { Plus, ShieldOff, Pencil, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ALL_PERMS = ["videos.manage", "users.manage", "comments.moderate", "reports.handle", "revenue.view", "settings.edit", "admins.manage"] as const;
const ROLE_DEFAULTS: Record<AdminAccount["role"], string[]> = {
  "Super Admin": [...ALL_PERMS],
  "Moderator": ["videos.manage", "users.manage", "comments.moderate", "reports.handle"],
  "Support": ["users.manage", "reports.handle"],
  "Analyst": ["revenue.view"],
};

export default function AdminUsersPage() {
  const [list, setList] = useState<AdminAccount[]>(() => generateAdminAccounts());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Moderator" as AdminAccount["role"] });
  const [perms, setPerms] = useState<string[]>(ROLE_DEFAULTS["Moderator"]);

  function changeRole(r: AdminAccount["role"]) { setForm({ ...form, role: r }); setPerms(ROLE_DEFAULTS[r]); }
  function add() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) { toast.error("All fields required"); return; }
    setList((p) => [...p, {
      id: `adm_${Date.now()}`, name: form.name, email: form.email, role: form.role,
      lastLogin: new Date().toISOString(), status: "Active", avatarColor: "bg-primary",
    }]);
    toast.success("Admin added");
    setOpen(false);
    setForm({ name: "", email: "", password: "", role: "Moderator" });
  }
  function revoke(id: string) {
    setList((p) => p.map((a) => a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a));
    toast.success("Access updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-sm text-muted-foreground">{list.length} admins • {list.filter((a) => a.status === "Active").length} active</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Add Admin</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New admin user</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Temporary password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <div><Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => changeRole(v as AdminAccount["role"])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ALL_PERMS.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50">
                      <Checkbox checked={perms.includes(perm)} onCheckedChange={(v) => setPerms((p) => v ? [...p, perm] : p.filter((x) => x !== perm))} />
                      <span className="font-mono text-xs">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={add}>Create Admin</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Last login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${a.avatarColor} text-white grid place-items-center text-sm font-semibold`}>{a.name.split(" ").map((n) => n[0]).join("")}</div><div className="font-medium">{a.name}</div></div></TableCell>
                <TableCell className="hidden md:table-cell text-sm">{a.email}</TableCell>
                <TableCell><span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"><ShieldCheck className="w-3 h-3" />{a.role}</span></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDateTime(a.lastLogin)}</TableCell>
                <TableCell><StatusBadge status={a.status} /></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => toast("Edit permissions")}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => revoke(a.id)}><ShieldOff className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
