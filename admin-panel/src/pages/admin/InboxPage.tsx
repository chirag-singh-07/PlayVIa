import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell, Search, CheckCheck, Trash2, Flag, Wallet, UserPlus, AlertTriangle,
  Megaphone, Server, MessageSquare, Inbox as InboxIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const fmtDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

type Category = "report" | "withdrawal" | "user" | "system" | "ad" | "comment";

interface NotifItem {
  id: string;
  category: Category;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  priority?: "low" | "normal" | "high";
}

const ICONS: Record<Category, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  report:     { icon: Flag,          color: "text-destructive", bg: "bg-destructive/10", label: "Report" },
  withdrawal: { icon: Wallet,        color: "text-warning",     bg: "bg-warning/10",     label: "Withdrawal" },
  user:       { icon: UserPlus,      color: "text-primary",     bg: "bg-primary/10",     label: "User" },
  system:     { icon: Server,        color: "text-muted-foreground", bg: "bg-muted",     label: "System" },
  ad:         { icon: Megaphone,     color: "text-success",     bg: "bg-success/10",     label: "Ads" },
  comment:    { icon: MessageSquare, color: "text-primary",     bg: "bg-primary/10",     label: "Comment" },
};

function seed(): NotifItem[] {
  const now = Date.now();
  const items: Omit<NotifItem, "id" | "time">[] = [
    { category: "report", title: "New high-priority report", message: "Video 'Mumbai Street Food Tour' was reported 5 times in the last hour for misleading content.", read: false, priority: "high" },
    { category: "withdrawal", title: "Withdrawal request — ₹48,500", message: "Creator Arjun Sharma requested a payout to UPI account arjun@okaxis.", read: false, priority: "normal" },
    { category: "report", title: "Comment flagged for hate speech", message: "A comment on 'Cricket Highlights — IND vs AUS' was auto-flagged by the AI moderation system.", read: false, priority: "high" },
    { category: "user", title: "New creator verified", message: "Priya Nair completed creator verification and is now eligible for monetization.", read: false },
    { category: "system", title: "Daily backup completed", message: "Database backup finished successfully at 03:00 IST. Total size: 24.6 GB.", read: true },
    { category: "ad", title: "Ad campaign budget reached", message: "'Summer Sale 2026' campaign has used 95% of its allocated daily budget.", read: false, priority: "normal" },
    { category: "withdrawal", title: "Payout processed", message: "₹12,300 paid out to Sneha Patel via bank transfer. Reference: TXN91827364.", read: true },
    { category: "comment", title: "100 new comments need review", message: "Comment moderation queue has crossed the 100-item threshold.", read: true },
    { category: "system", title: "CDN region failover", message: "Mumbai CDN node experienced high latency. Traffic auto-routed to Bengaluru.", read: true, priority: "high" },
    { category: "user", title: "Suspicious login attempt", message: "Multiple failed admin login attempts from IP 185.220.101.42. Account locked.", read: true, priority: "high" },
    { category: "ad", title: "New advertiser onboarded", message: "Zomato signed up for the Premium Ad package — ₹2,50,000/month.", read: true },
    { category: "report", title: "Copyright takedown received", message: "DMCA notice filed against video ID v_7821 by Sony Music India.", read: true, priority: "high" },
  ];
  return items.map((it, i) => ({
    ...it,
    id: `n_${i + 1}`,
    time: new Date(now - i * 1000 * 60 * (Math.floor(Math.random() * 90) + 15)),
  }));
}

function timeAgo(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return fmtDate(d);
}

export default function InboxPage() {
  const [items, setItems] = useState<NotifItem[]>(() => seed());
  const [filter, setFilter] = useState<"all" | "unread" | Category>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unreadCount = items.filter((i) => !i.read).length;

  const filtered = useMemo(() => items.filter((i) => {
    if (filter === "unread" && i.read) return false;
    if (filter !== "all" && filter !== "unread" && i.category !== filter) return false;
    if (q && !`${i.title} ${i.message}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [items, filter, q]);

  const selected = items.find((i) => i.id === selectedId) ?? filtered[0];

  function open(id: string) {
    setSelectedId(id);
    setItems((p) => p.map((i) => i.id === id ? { ...i, read: true } : i));
  }
  function markAllRead() {
    setItems((p) => p.map((i) => ({ ...i, read: true })));
    toast.success("All notifications marked as read");
  }
  function clearAll() {
    setItems([]);
    setSelectedId(null);
    toast.success("Inbox cleared");
  }
  function remove(id: string) {
    setItems((p) => p.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Inbox
            {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground">Admin notifications, alerts, and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={clearAll} disabled={items.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <Card className="p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notifications..." className="pl-9" />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
            <TabsTrigger value="withdrawal">Payouts</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
        {/* List */}
        <Card className="p-0 overflow-hidden">
          <div className="max-h-[640px] overflow-y-auto divide-y divide-border">
            {filtered.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <InboxIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <div className="font-medium">No notifications</div>
                <div className="text-sm">You're all caught up.</div>
              </div>
            )}
            {filtered.map((n) => {
              const meta = ICONS[n.category];
              const Icon = meta.icon;
              const isActive = selected?.id === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => open(n.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-muted/60",
                    isActive && "bg-muted",
                    !n.read && "bg-primary/5"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-lg grid place-items-center shrink-0", meta.bg)}>
                    <Icon className={cn("w-4 h-4", meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <span className={cn("text-sm truncate", !n.read ? "font-semibold" : "font-medium")}>{n.title}</span>
                      {n.priority === "high" && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                    <div className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.time)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Detail */}
        <Card className="p-0 overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("w-11 h-11 rounded-xl grid place-items-center shrink-0", ICONS[selected.category].bg)}>
                      {(() => { const I = ICONS[selected.category].icon; return <I className={cn("w-5 h-5", ICONS[selected.category].color)} />; })()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{ICONS[selected.category].label}</Badge>
                        {selected.priority === "high" && <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">High priority</Badge>}
                      </div>
                      <h3 className="text-lg font-bold mt-1 leading-tight">{selected.title}</h3>
                      <div className="text-xs text-muted-foreground mt-1">{timeAgo(selected.time)} · {fmtDate(selected.time)}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(selected.id)} aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm leading-relaxed text-foreground/90">{selected.message}</p>
              </div>
              <Separator />
              <div className="p-4 flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => toast.info("Snoozed for 1 hour")}>Snooze</Button>
                <Button size="sm" className="bg-gradient-brand text-white" onClick={() => toast.success("Opening related item")}>
                  View details
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <div className="font-medium">Select a notification</div>
              <div className="text-sm">Choose an item from the list to view details.</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
