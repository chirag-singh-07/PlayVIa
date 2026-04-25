import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { generateAppVersions, fmtDate, fmtCompact, type AppVersion } from "@/lib/adminMock";
import { Smartphone, Upload, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AppVersionsPage() {
  const [list, setList] = useState<AppVersion[]>(() => generateAppVersions());
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [force, setForce] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const live = list.find((v) => v.status === "Live");

  function publish() {
    if (!version.trim() || !notes.trim()) { toast.error("Version and release notes are required"); return; }
    setList((p) => [
      { id: `ver_${Date.now()}`, version, releaseNotes: notes, date: new Date().toISOString(), downloads: 0, forceUpdate: force, status: "Live", size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "45.2 MB" },
      ...p.map((v) => ({ ...v, status: "Archived" as const })),
    ]);
    toast.success(`v${version} published as Live`);
    setVersion(""); setNotes(""); setForce(false); setFile(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">App Versions</h1>
        <p className="text-sm text-muted-foreground">Manage APK releases and force-update flags</p>
      </div>

      {live && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 grid place-items-center"><Smartphone className="w-7 h-7 text-primary" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold">v{live.version}</h2>
                <StatusBadge status="Live" />
                {live.forceUpdate && <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning"><AlertTriangle className="w-3 h-3" />Force update</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{live.releaseNotes}</p>
              <div className="text-xs text-muted-foreground mt-2">Released {fmtDate(live.date)} • {live.size} • {fmtCompact(live.downloads)} downloads</div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Upload className="w-4 h-4" />Publish New Version</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Version number</Label><Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 2.2.0" /></div>
          <div>
            <Label>APK file</Label>
            <label className="mt-2 flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{file ? file.name : "Drop APK or click to upload"}</span>
              <input type="file" accept=".apk" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="md:col-span-2"><Label>Release notes</Label><Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What's new in this version..." /></div>
          <div className="md:col-span-2 flex items-center justify-between rounded-md border p-3">
            <div><Label className="cursor-pointer">Force update</Label><p className="text-xs text-muted-foreground">Users must update before continuing to use the app</p></div>
            <Switch checked={force} onCheckedChange={setForce} />
          </div>
        </div>
        <div className="flex justify-end mt-4"><Button onClick={publish}><CheckCircle2 className="w-4 h-4 mr-1" />Publish Version</Button></div>
      </Card>

      <Card>
        <div className="p-4 border-b"><h3 className="font-semibold">Version History</h3></div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Version</TableHead>
            <TableHead className="hidden md:table-cell">Release Notes</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
            <TableHead className="hidden md:table-cell">Force</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {list.map((v) => (
              <TableRow key={v.id}>
                <TableCell><div className="font-semibold">v{v.version}</div><div className="text-xs text-muted-foreground">{v.size}</div></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-md truncate">{v.releaseNotes}</TableCell>
                <TableCell className="text-sm">{fmtDate(v.date)}</TableCell>
                <TableCell className="text-right font-semibold">{fmtCompact(v.downloads)}</TableCell>
                <TableCell className="hidden md:table-cell">{v.forceUpdate ? <span className="text-warning text-xs font-semibold">Yes</span> : <span className="text-muted-foreground text-xs">No</span>}</TableCell>
                <TableCell><StatusBadge status={v.status} /></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setList((p) => p.filter((x) => x.id !== v.id)); toast.success("Version archived"); }}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
