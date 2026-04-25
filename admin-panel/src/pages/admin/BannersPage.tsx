import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { generateBanners, fmtDate, type BannerRecord } from "@/lib/adminMock";
import { Plus, ChevronUp, ChevronDown, Trash2, Image as ImageIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function BannersPage() {
  const [list, setList] = useState<BannerRecord[]>(() => generateBanners());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BannerRecord | null>(null);
  const [form, setForm] = useState({ title: "", link: "", position: "Home Top" as BannerRecord["position"], startDate: "", endDate: "", active: true });

  function openNew() { setEditing(null); setForm({ title: "", link: "", position: "Home Top", startDate: "", endDate: "", active: true }); setOpen(true); }
  function openEdit(b: BannerRecord) {
    setEditing(b);
    setForm({ title: b.title, link: b.link, position: b.position, startDate: b.startDate.slice(0, 10), endDate: b.endDate.slice(0, 10), active: b.active });
    setOpen(true);
  }
  function save() {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    if (editing) {
      setList((p) => p.map((x) => x.id === editing.id ? { ...x, ...form, startDate: form.startDate || x.startDate, endDate: form.endDate || x.endDate } : x));
      toast.success("Banner updated");
    } else {
      setList((p) => [...p, {
        id: `bnr_${Date.now()}`, title: form.title, link: form.link, position: form.position,
        startDate: form.startDate || new Date().toISOString(),
        endDate: form.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
        active: form.active, order: p.length + 1, gradient: "from-red-500 to-orange-500", clicks: 0,
      }]);
      toast.success("Banner created");
    }
    setOpen(false);
  }
  function move(id: string, dir: -1 | 1) {
    setList((p) => {
      const i = p.findIndex((x) => x.id === id); const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const copy = [...p]; [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy.map((x, idx) => ({ ...x, order: idx + 1 }));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">Promotional banners across home and player screens</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />Add Banner</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Link URL</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/category/sports" /></div>
              <div><Label>Position</Label>
                <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v as BannerRecord["position"] })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Top">Home Top</SelectItem>
                    <SelectItem value="Home Middle">Home Middle</SelectItem>
                    <SelectItem value="Player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><Label>End date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div><Label className="cursor-pointer">Active</Label><p className="text-xs text-muted-foreground">Show banner in app</p></div>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Create"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((b) => (
          <Card key={b.id} className="overflow-hidden">
            <div className={`aspect-[16/8] bg-gradient-to-br ${b.gradient} grid place-items-center text-primary-foreground p-4`}>
              <div className="text-center"><ImageIcon className="w-7 h-7 mx-auto opacity-80" /><div className="font-bold mt-2 line-clamp-2">{b.title}</div></div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted">{b.position}</span>
                <span className={`text-xs font-semibold ${b.active ? "text-success" : "text-muted-foreground"}`}>{b.active ? "● Active" : "○ Inactive"}</span>
              </div>
              <div className="text-xs text-muted-foreground">→ {b.link}</div>
              <div className="text-xs text-muted-foreground">{fmtDate(b.startDate)} – {fmtDate(b.endDate)} • {b.clicks.toLocaleString("en-IN")} clicks</div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => move(b.id, -1)}><ChevronUp className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => move(b.id, 1)}><ChevronDown className="w-4 h-4" /></Button>
                </div>
                <div>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setList((p) => p.filter((x) => x.id !== b.id)); toast.success("Deleted"); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
