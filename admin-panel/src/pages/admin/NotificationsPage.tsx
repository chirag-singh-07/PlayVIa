import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDateTime } from "@/lib/adminMock";
import { Bell, Send, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function NotificationsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Users");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [scheduleAt, setScheduleAt] = useState("");

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAnnouncements();
      setList(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function send() {
    if (!title.trim() || !message.trim()) { toast.error("Title and message are required"); return; }
    if (when === "later" && !scheduleAt) { toast.error("Pick a schedule time"); return; }
    
    try {
      await adminService.createAnnouncement({
        title,
        message,
        target,
        when,
        scheduleAt,
      });
      
      toast.success(when === "later" ? "Notification scheduled" : "Notification sent");
      setTitle(""); setMessage(""); setScheduleAt("");
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to send notification");
    }
  }

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
        <h1 className="text-2xl font-bold">Push Notifications</h1>
        <p className="text-sm text-muted-foreground">Send announcements to users, creators or segments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Send className="w-4 h-4" />Compose</h3>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="🎬 New trending video!" maxLength={60} /><div className="text-xs text-muted-foreground mt-1">{title.length}/60</div></div>
            <div><Label>Message</Label><Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What do you want to tell your users?" maxLength={180} /><div className="text-xs text-muted-foreground mt-1">{message.length}/180</div></div>
            <div>
              <Label>Target audience</Label>
              <Select value={target} onValueChange={(v) => setTarget(v as NotificationRecord["target"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users (524,891)</SelectItem>
                  <SelectItem value="Creators">Creators (12,400)</SelectItem>
                  <SelectItem value="Premium">Premium (38,200)</SelectItem>
                  <SelectItem value="Specific">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>When to send</Label>
              <RadioGroup value={when} onValueChange={(v) => setWhen(v as "now" | "later")} className="mt-2 grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 border rounded-md p-3 cursor-pointer ${when === "now" ? "border-primary bg-primary/5" : ""}`}><RadioGroupItem value="now" />Send now</label>
                <label className={`flex items-center gap-2 border rounded-md p-3 cursor-pointer ${when === "later" ? "border-primary bg-primary/5" : ""}`}><RadioGroupItem value="later" />Schedule</label>
              </RadioGroup>
              {when === "later" && <Input type="datetime-local" className="mt-2" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />}
            </div>
            <Button onClick={send} className="w-full"><Send className="w-4 h-4 mr-1" />{when === "later" ? "Schedule Notification" : "Send Notification"}</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" />Preview</h3>
          <div className="bg-gradient-to-b from-muted to-background rounded-2xl p-6 min-h-[280px] flex items-start justify-center">
            <div className="w-full max-w-xs bg-background rounded-xl shadow-card border p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary grid place-items-center shrink-0"><Bell className="w-5 h-5 text-primary-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-muted-foreground">PLAYVIA</span><span className="text-xs text-muted-foreground">now</span></div>
                  <div className="font-semibold text-sm mt-0.5 truncate">{title || "Notification title"}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{message || "Your message will appear here..."}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Estimated reach: <span className="font-semibold text-foreground">{target === "All Users" ? "524,891" : target === "Creators" ? "12,400" : target === "Premium" ? "38,200" : "Custom"} users</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b"><h3 className="font-semibold">Sent History</h3></div>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Target</TableHead>
            <TableHead className="text-right">Recipients</TableHead>
            <TableHead className="text-right hidden md:table-cell">Open rate</TableHead>
            <TableHead className="hidden lg:table-cell">Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {list.map((n) => (
              <TableRow key={n._id}>
                <TableCell><div className="font-medium">{n.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{n.message}</div></TableCell>
                <TableCell className="hidden md:table-cell text-sm">{n.target}</TableCell>
                <TableCell className="text-right">{(n.recipientsCount || 0).toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-right hidden md:table-cell">{n.status === "Sent" ? `${n.openRate || 0}%` : "—"}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{fmtDateTime(n.scheduledAt || n.createdAt)}</TableCell>
                <TableCell><StatusBadge status={n.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
