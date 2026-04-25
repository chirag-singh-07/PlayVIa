import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { generateCategories, type Category } from "@/lib/adminMock";
import { Plus, Pencil, Trash2, GripVertical, FolderTree } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [list, setList] = useState<Category[]>(() => generateCategories());
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Category, "id" | "videos" | "order">>({
    name: "", slug: "", icon: "📁", description: "", active: true,
  });

  const total = useMemo(() => list.reduce((s, c) => s + c.videos, 0), [list]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "📁", description: "", active: true });
    setOpen(true);
  }
  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, icon: c.icon, description: c.description, active: c.active });
    setOpen(true);
  }
  function save() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editing) {
      setList((p) => p.map((x) => x.id === editing.id ? { ...x, ...form } : x));
      toast.success("Category updated");
    } else {
      setList((p) => [...p, { ...form, id: `cat_${Date.now()}`, videos: 0, order: p.length + 1 }]);
      toast.success("Category created");
    }
    setOpen(false);
  }
  function remove(id: string) {
    setList((p) => p.filter((x) => x.id !== id));
    toast.success("Category deleted");
  }
  function toggle(id: string) {
    setList((p) => p.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  }
  function move(id: string, dir: -1 | 1) {
    setList((p) => {
      const i = p.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.length) return p;
      const copy = [...p];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy.map((x, idx) => ({ ...x, order: idx + 1 }));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">{list.length} categories • {total.toLocaleString("en-IN")} videos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div><Label>Icon</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="text-center text-xl" /></div>
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} /></div>
              </div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div><Label className="cursor-pointer">Active</Label><p className="text-xs text-muted-foreground">Show category in app feed</p></div>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Videos</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex flex-col items-center">
                    <button onClick={() => move(c.id, -1)} className="text-muted-foreground hover:text-foreground"><GripVertical className="w-4 h-4" /></button>
                  </div>
                </TableCell>
                <TableCell className="text-2xl">{c.icon}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">{c.description}</TableCell>
                <TableCell className="text-right font-semibold">{c.videos.toLocaleString("en-IN")}</TableCell>
                <TableCell><Switch checked={c.active} onCheckedChange={() => toggle(c.id)} /></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-50" />No categories yet
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
