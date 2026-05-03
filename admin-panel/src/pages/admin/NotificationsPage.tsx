import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fmtDateTime, type NotificationRecord } from "@/lib/adminMock";
import { Bell, Send, Smartphone, Loader2, Users, Crown, UserCheck, Calendar, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Users");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [scheduleAt, setScheduleAt] = useState("");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: adminService.getAnnouncements,
  });

  const sendMutation = useMutation({
    mutationFn: (data: any) => adminService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
      toast.success("Notification sent successfully");
      setTitle("");
      setMessage("");
    },
    onError: () => toast.error("Failed to send notification")
  });

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    sendMutation.mutate({
      title,
      message,
      target,
      scheduledAt: when === "now" ? new Date().toISOString() : scheduleAt,
      status: when === "now" ? "Sent" : "Scheduled"
    });
  };

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
          <h1 className="text-2xl font-bold">Push Notifications</h1>
          <p className="text-sm text-muted-foreground">Reach your audience with instant announcements</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 p-6 border-none shadow-sm bg-card/50 backdrop-blur-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg">Compose Notification</h3>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notification Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="🎬 New trending video!" 
                maxLength={60}
                className="bg-muted/20 border-none"
              />
              <div className="text-[10px] text-right text-muted-foreground">{title.length}/60 characters</div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message Body</Label>
              <Textarea 
                rows={4} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="What do you want to tell your users?" 
                maxLength={180}
                className="bg-muted/20 border-none resize-none"
              />
              <div className="text-[10px] text-right text-muted-foreground">{message.length}/180 characters</div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</Label>
              <Select value={target} onValueChange={(v) => setTarget(v)}>
                <SelectTrigger className="bg-muted/20 border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">
                    <div className="flex items-center gap-2"><Users className="w-3 h-3" /> All Users</div>
                  </SelectItem>
                  <SelectItem value="Creators">
                    <div className="flex items-center gap-2"><UserCheck className="w-3 h-3" /> Creators Only</div>
                  </SelectItem>
                  <SelectItem value="Premium">
                    <div className="flex items-center gap-2"><Crown className="w-3 h-3 text-warning" /> Premium Subscribers</div>
                  </SelectItem>
                  <SelectItem value="Specific">
                    <div className="flex items-center gap-2"><Bell className="w-3 h-3" /> Specific Segment</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Schedule</Label>
              <RadioGroup value={when} onValueChange={(v) => setWhen(v as "now" | "later")} className="grid grid-cols-2 gap-3 mt-2">
                <label className={`flex items-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition-all ${when === "now" ? "border-primary bg-primary/5" : "border-transparent bg-muted/20 hover:bg-muted/30"}`}>
                  <RadioGroupItem value="now" className="sr-only" />
                  <CheckCircle2 className={`w-4 h-4 ${when === "now" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Send Now</span>
                </label>
                <label className={`flex items-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition-all ${when === "later" ? "border-primary bg-primary/5" : "border-transparent bg-muted/20 hover:bg-muted/30"}`}>
                  <RadioGroupItem value="later" className="sr-only" />
                  <Calendar className={`w-4 h-4 ${when === "later" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Schedule</span>
                </label>
              </RadioGroup>
            </div>

            {when === "later" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Schedule Time</Label>
                <Input 
                  type="datetime-local" 
                  value={scheduleAt} 
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="bg-muted/20 border-none"
                />
              </div>
            )}

            <Button 
              className="w-full h-12 shadow-glow font-bold text-base" 
              onClick={handleSend}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {when === "now" ? "Send Notification" : "Schedule Notification"}
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-none shadow-sm bg-card/50 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg">Push Preview</h3>
            </div>
            
            <div className="bg-muted/30 rounded-3xl p-8 flex items-center justify-center border-2 border-dashed border-muted">
              <div className="w-full max-w-[280px] bg-background/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-4 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shrink-0 shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-primary tracking-tighter">PLAYVIA</span>
                      <span className="text-[10px] text-muted-foreground">now</span>
                    </div>
                    <div className="font-bold text-sm mt-0.5 truncate">{title || "Notification title"}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {message || "Your message will appear here for users to read..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Reach</div>
                  <div className="text-lg font-black text-primary">
                    {target === "All Users" ? "524,891" : target === "Creators" ? "12,400" : target === "Premium" ? "38,200" : "Specific Users"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="p-4 border-b border-muted/50 flex items-center justify-between">
              <h3 className="font-bold">Recent History</h3>
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                Sent & Scheduled
              </div>
            </div>
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((n: NotificationRecord) => (
                    <TableRow key={n.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="max-w-[180px]">
                        <div className="font-bold truncate text-xs">{n.title}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">{fmtDateTime(n.scheduledAt)}</div>
                      </TableCell>
                      <TableCell className="text-[10px] font-medium">{n.target}</TableCell>
                      <TableCell className="text-right">
                        {n.status === "Sent" ? (
                           <div className="flex items-center justify-end gap-1 font-bold text-success text-xs">
                             <TrendingUp className="w-3 h-3" /> {n.openRate}%
                           </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell><StatusBadge status={n.status} /></TableCell>
                    </TableRow>
                  ))}
                  {list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-10" />
                        <p className="text-xs">No history found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
