import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, GripVertical, FolderTree, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", slug: "", icon: "📁", description: "", active: true,
  });

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminService.getCategories,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return adminService.updateCategory(editing._id, form);
      } else {
        return adminService.addCategory(form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(editing ? "Category updated" : "Category created");
      setOpen(false);
    },
    onError: () => toast.error("Failed to save category")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
      setDeleteConfirm(null);
    },
    onError: () => toast.error("Failed to delete category")
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminService.updateCategory(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to update category status")
  });

  const total = useMemo(() => list.reduce((s: number, c: any) => s + (c.videosCount || 0), 0), [list]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "📁", description: "", active: true });
    setOpen(true);
  }
  
  function openEdit(c: any) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, icon: c.icon || "📁", description: c.description || "", active: c.active });
    setOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editing ? "Save" : "Create"}
              </Button>
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
            {list.map((c: any) => (
              <TableRow key={c._id}>
                <TableCell>
                  <div className="flex flex-col items-center">
                    <button className="text-muted-foreground hover:text-foreground cursor-grab"><GripVertical className="w-4 h-4" /></button>
                  </div>
                </TableCell>
                <TableCell className="text-2xl">{c.icon}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">{c.description}</TableCell>
                <TableCell className="text-right font-semibold">{(c.videosCount || 0).toLocaleString("en-IN")}</TableCell>
                <TableCell><Switch checked={c.active} onCheckedChange={(v) => toggleMutation.mutate({ id: c._id, active: v })} disabled={toggleMutation.isPending} /></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(c._id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
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

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)} 
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
