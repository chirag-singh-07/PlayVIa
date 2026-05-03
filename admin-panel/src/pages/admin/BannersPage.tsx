import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { fmtDate } from "@/lib/adminMock";
import { adminService } from "@/lib/adminService";
import { Plus, ChevronUp, ChevronDown, Trash2, Image as ImageIcon, Pencil, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    link: "", 
    imageUrl: "",
    position: "home_top", 
    startDate: "", 
    endDate: "", 
    active: true,
    order: 0
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: adminService.getBanners,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editing) {
        return adminService.updateBanner(editing._id, data);
      } else {
        return adminService.addBanner(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success(editing ? "Banner updated" : "Banner created");
      setOpen(false);
    },
    onError: () => toast.error("Failed to save banner")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Banner deleted");
    },
    onError: () => toast.error("Failed to delete banner")
  });

  function openNew() { 
    setEditing(null); 
    setForm({ 
      title: "", 
      link: "", 
      imageUrl: "",
      position: "home_top", 
      startDate: new Date().toISOString().split("T")[0], 
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0], 
      active: true,
      order: banners.length + 1
    }); 
    setOpen(true); 
  }

  function openEdit(b: any) {
    setEditing(b);
    setForm({ 
      title: b.title, 
      link: b.link, 
      imageUrl: b.imageUrl || "",
      position: b.position, 
      startDate: b.startDate?.slice(0, 10) || "", 
      endDate: b.endDate?.slice(0, 10) || "", 
      active: b.active,
      order: b.order
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    saveMutation.mutate(form);
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
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">Promotional banners across home and player screens</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="gap-2 shadow-glow"><Plus className="w-4 h-4" />Add Banner</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. IPL 2024 Live" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Position</Label>
                  <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_top">Home Top</SelectItem>
                      <SelectItem value="home_middle">Home Middle</SelectItem>
                      <SelectItem value="player_bottom">Player Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Display Order</Label>
                  <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                  <Button variant="outline" size="icon" className="shrink-0"><ImageIcon className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Redirect Link</Label>
                <div className="flex gap-2">
                  <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/category/sports" />
                  <Button variant="outline" size="icon" className="shrink-0"><LinkIcon className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
                <div>
                  <Label className="cursor-pointer text-base">Active Status</Label>
                  <p className="text-xs text-muted-foreground">Toggle visibility in the app</p>
                </div>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editing ? "Save Changes" : "Create Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b: any) => (
          <Card key={b._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-muted/50 bg-card/50 backdrop-blur-sm">
            <div className="aspect-[21/9] bg-muted relative overflow-hidden">
              {b.imageUrl ? (
                <img src={b.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => openEdit(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => deleteMutation.mutate(b._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
                {b.position.replace("_", " ")}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{b.title}</h3>
                <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${b.active ? "bg-success shadow-[0_0_8px_hsl(var(--success))]" : "bg-muted-foreground"}`} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LinkIcon className="w-3 h-3" />
                <span className="truncate">{b.link}</span>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-muted/50">
                <span className="font-medium">{fmtDate(b.startDate)} - {fmtDate(b.endDate)}</span>
                <span className="font-bold text-foreground">Order: {b.order}</span>
              </div>
            </div>
          </Card>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
            <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-lg">No banners found</p>
            <Button variant="ghost" className="mt-2" onClick={openNew}>Create your first banner</Button>
          </div>
        )}
      </div>
    </div>
  );
}
