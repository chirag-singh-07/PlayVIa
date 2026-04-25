import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Camera, Mail, Phone, Shield, KeyRound, Smartphone, Monitor, LogOut, Save, Trash2,
  MapPin, Calendar, Globe, Award, Activity, CheckCircle2, XCircle, Copy, Eye, EyeOff,
  Github, Linkedin, Twitter, Languages, Clock, TrendingUp, Film, MessageSquare,
  Wallet, Flag, ShieldCheck, Sparkles, Download, AlertTriangle, QrCode, Link as LinkIcon, RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
}

const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", browser: "Chrome 124", location: "Mumbai, IN", ip: "103.21.58.142", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 15", browser: "Safari Mobile", location: "Mumbai, IN", ip: "49.36.142.88", lastActive: "2 hours ago" },
  { id: "s3", device: "Windows PC", browser: "Edge 122", location: "Bengaluru, IN", ip: "117.96.21.4", lastActive: "Yesterday, 18:42" },
  { id: "s4", device: "iPad Air", browser: "Safari 17", location: "Pune, IN", ip: "152.58.91.22", lastActive: "3 days ago" },
];

interface ActivityItem {
  id: string;
  icon: typeof Activity;
  iconColor: string;
  iconBg: string;
  title: string;
  meta: string;
  time: string;
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", icon: Flag, iconColor: "text-destructive", iconBg: "bg-destructive/10", title: "Resolved 5 content reports", meta: "Videos & comments moderation", time: "12 minutes ago" },
  { id: "a2", icon: Wallet, iconColor: "text-warning", iconBg: "bg-warning/10", title: "Approved withdrawal of ₹48,500", meta: "Creator: Arjun Sharma · UPI", time: "1 hour ago" },
  { id: "a3", icon: ShieldCheck, iconColor: "text-success", iconBg: "bg-success/10", title: "Verified creator account", meta: "Priya Nair · 142K subscribers", time: "3 hours ago" },
  { id: "a4", icon: Film, iconColor: "text-primary", iconBg: "bg-primary/10", title: "Featured 3 videos on home banner", meta: "Trending Bollywood category", time: "Yesterday, 16:42" },
  { id: "a5", icon: MessageSquare, iconColor: "text-primary", iconBg: "bg-primary/10", title: "Reviewed 87 flagged comments", meta: "Bulk moderation queue", time: "Yesterday, 14:18" },
  { id: "a6", icon: KeyRound, iconColor: "text-muted-foreground", iconBg: "bg-muted", title: "Updated security settings", meta: "Enabled 2FA enforcement", time: "2 days ago" },
];

const ACHIEVEMENTS = [
  { icon: Award, label: "1 Year of Service", desc: "Joined April 2025", color: "from-amber-500 to-orange-500", earned: true },
  { icon: ShieldCheck, label: "Top Moderator", desc: "Top 1% reviewer this quarter", color: "from-emerald-500 to-teal-500", earned: true },
  { icon: Sparkles, label: "Power User", desc: "10,000+ admin actions", color: "from-violet-500 to-fuchsia-500", earned: true },
  { icon: TrendingUp, label: "Quick Responder", desc: "Avg response < 2 hours", color: "from-rose-500 to-red-500", earned: true },
  { icon: CheckCircle2, label: "Perfect Audit", desc: "Zero policy violations", color: "from-blue-500 to-indigo-500", earned: false },
  { icon: Globe, label: "Global Reach", desc: "Sign in from 5 countries", color: "from-cyan-500 to-sky-500", earned: false },
];

const ACTIVITY_CHART = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  actions: Math.floor(40 + Math.sin(i / 2) * 25 + Math.random() * 30),
}));

const STATS = [
  { label: "Total actions", value: "12,847", change: "+8.2%", positive: true, icon: Activity, color: "text-primary" },
  { label: "Reports resolved", value: "1,432", change: "+12%", positive: true, icon: Flag, color: "text-destructive" },
  { label: "Payouts approved", value: "₹18.4L", change: "+4.1%", positive: true, icon: Wallet, color: "text-warning" },
  { label: "Avg response", value: "1h 42m", change: "-18m", positive: true, icon: Clock, color: "text-success" },
];

const API_KEYS = [
  { id: "k1", name: "Production CLI", key: "pv_live_••••••••••••a82f", created: "12/03/2026", lastUsed: "Today, 10:14" },
  { id: "k2", name: "Analytics export", key: "pv_live_••••••••••••f31c", created: "08/01/2026", lastUsed: "21/04/2026" },
];

function passwordStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const levels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];
  return { score: s, label: levels[s], color: colors[s], pct: (s / 5) * 100 };
}

export default function ProfilePage() {
  const { admin, logout } = useAdminAuth(false);

  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Senior platform administrator overseeing content moderation and creator payouts. Passionate about building safe communities and empowering Indian creators.");
  const [location, setLocation] = useState("Mumbai, Maharashtra");
  const [website, setWebsite] = useState("https://playvia.app");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("en");
  const [twitter, setTwitter] = useState("@playvia_admin");
  const [github, setGithub] = useState("playvia");
  const [linkedin, setLinkedin] = useState("in/playvia");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);

  const [emailReports, setEmailReports] = useState(true);
  const [emailWithdrawals, setEmailWithdrawals] = useState(true);
  const [emailWeekly, setEmailWeekly] = useState(false);
  const [emailMentions, setEmailMentions] = useState(true);
  const [pushAll, setPushAll] = useState(true);
  const [pushUrgent, setPushUrgent] = useState(true);
  const [smsCritical, setSmsCritical] = useState(false);

  const [theme, setTheme] = useState("system");
  const [density, setDensity] = useState("comfortable");
  const [startPage, setStartPage] = useState("/admin/dashboard");

  const initials = (name || "A").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const strength = useMemo(() => passwordStrength(newPwd), [newPwd]);
  const profileCompletion = useMemo(() => {
    const fields = [name, email, phone, bio, location, website, twitter, github, linkedin];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [name, email, phone, bio, location, website, twitter, github, linkedin]);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    toast.success("Profile updated successfully");
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPwd || !newPwd) return toast.error("Fill in all password fields");
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords do not match");
    if (strength.score < 3) return toast.error("Please choose a stronger password");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    toast.success("Password changed successfully");
  }

  function revokeSession(id: string) {
    setSessions((p) => p.filter((s) => s.id !== id));
    toast.success("Session revoked");
  }

  function revokeAllOther() {
    setSessions((p) => p.filter((s) => s.current));
    toast.success("All other sessions signed out");
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero header card */}
      <Card className="overflow-hidden">
        <div className="h-40 bg-gradient-brand relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 backdrop-blur-md bg-white/20 text-white border-white/30 hover:bg-white/30"
            onClick={() => toast.info("Cover photo upload (mock)")}
          >
            <Camera className="w-4 h-4 mr-2" /> Edit cover
          </Button>
        </div>
        <div className="px-6 pb-6 -mt-16 flex flex-col md:flex-row md:items-end gap-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-gradient-brand text-white text-3xl font-extrabold flex items-center justify-center ring-4 ring-background shadow-elevated">
              {initials}
            </div>
            <button
              onClick={() => toast.info("Avatar upload (mock)")}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-background border border-border shadow-card flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-success ring-2 ring-background" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold truncate">{name || "Admin"}</h2>
              <CheckCircle2 className="w-5 h-5 text-primary fill-primary/20" />
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{admin?.role ?? "Super Admin"}</Badge>
              <Badge variant="outline" className="text-success border-success/40">
                <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" /> Online
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined April 2025</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Profile link copied")}>
              <LinkIcon className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button size="sm" className="bg-gradient-brand text-white" onClick={() => toast.success("Profile saved")}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Profile completion */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Profile completion</div>
              <div className="text-sm text-muted-foreground">{profileCompletion}%</div>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {profileCompletion < 100 ? "Add the missing fields below to complete your profile." : "Your profile is complete — nice work!"}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-9 h-9 rounded-lg bg-muted grid place-items-center", s.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <Badge variant="outline" className={cn("text-[10px]", s.positive ? "text-success border-success/40" : "text-destructive border-destructive/40")}>
                  {s.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Awards</TabsTrigger>
          <TabsTrigger value="preferences">Prefs</TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="mt-4 space-y-6">
          <Card className="p-6">
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Personal information</h3>
                <p className="text-sm text-muted-foreground">Update your name, contact details, and bio.</p>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={admin?.role ?? "Super Admin"} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} />
                <div className="text-xs text-muted-foreground text-right">{bio.length}/280</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setName(admin?.name ?? ""); setEmail(admin?.email ?? ""); toast.info("Form reset"); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button type="submit" className="bg-gradient-brand text-white">
                  <Save className="w-4 h-4 mr-2" /> Save changes
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">Social profiles</h3>
              <p className="text-sm text-muted-foreground">Link your social accounts — visible to other admins only.</p>
            </div>
            <Separator />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter / X</Label>
                <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="username" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="in/username" />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">Localization</h3>
              <p className="text-sm text-muted-foreground">Set your timezone and preferred language.</p>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Clock className="w-4 h-4" /> Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST, UTC+4:00)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT, UTC+0:00)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST, UTC-5:00)</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Languages className="w-4 h-4" /> Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="mt-4 space-y-6">
          <Card className="p-6">
            <form onSubmit={changePassword} className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change password</h3>
                <p className="text-sm text-muted-foreground">Use a strong password — at least 8 characters with mixed case, numbers, and symbols.</p>
              </div>
              <Separator />
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Current password</Label>
                  <div className="relative">
                    <Input type={showPwd ? "text" : "password"} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPwd((s) => !s)}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New password</Label>
                  <Input type={showPwd ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm password</Label>
                  <Input type={showPwd ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                </div>
              </div>
              {newPwd && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className="font-semibold">{strength.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full transition-all", strength.color)} style={{ width: `${strength.pct}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mt-2">
                    <div className={cn("flex items-center gap-1.5", newPwd.length >= 8 && "text-success")}>
                      {newPwd.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 8+ characters
                    </div>
                    <div className={cn("flex items-center gap-1.5", /[A-Z]/.test(newPwd) && /[a-z]/.test(newPwd) && "text-success")}>
                      {/[A-Z]/.test(newPwd) && /[a-z]/.test(newPwd) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Upper & lower case
                    </div>
                    <div className={cn("flex items-center gap-1.5", /\d/.test(newPwd) && "text-success")}>
                      {/\d/.test(newPwd) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} A number
                    </div>
                    <div className={cn("flex items-center gap-1.5", /[^A-Za-z0-9]/.test(newPwd) && "text-success")}>
                      {/[^A-Za-z0-9]/.test(newPwd) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} A symbol
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button type="submit" className="bg-gradient-brand text-white">Update password</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-4 h-4" /> Two-factor authentication</h3>
              <p className="text-sm text-muted-foreground">Add extra security with one-time codes.</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 grid place-items-center"><QrCode className="w-5 h-5 text-success" /></div>
                <div>
                  <div className="font-medium">Authenticator app</div>
                  <div className="text-sm text-muted-foreground">Google Authenticator, Authy, or 1Password.</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Configure</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set up two-factor authentication</DialogTitle>
                      <DialogDescription>Scan this QR code with your authenticator app.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-48 h-48 bg-foreground rounded-lg grid place-items-center">
                        <QrCode className="w-32 h-32 text-background" />
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-xs text-muted-foreground">Or enter this code manually:</div>
                        <code className="text-sm font-mono bg-muted px-3 py-1.5 rounded">JBSW Y3DP EHPK 3PXP</code>
                      </div>
                      <div className="w-full space-y-2">
                        <Label>Verification code</Label>
                        <Input placeholder="000000" maxLength={6} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShow2FADialog(false)}>Cancel</Button>
                      <Button className="bg-gradient-brand text-white" onClick={() => { setShow2FADialog(false); toast.success("2FA enabled"); }}>
                        Enable 2FA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center"><Mail className="w-5 h-5 text-primary" /></div>
                <div>
                  <div className="font-medium">Login alerts</div>
                  <div className="text-sm text-muted-foreground">Email me whenever a new device signs in.</div>
                </div>
              </div>
              <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 grid place-items-center"><Globe className="w-5 h-5 text-warning" /></div>
                <div>
                  <div className="font-medium">IP allowlist</div>
                  <div className="text-sm text-muted-foreground">Restrict admin access to specific IPs.</div>
                </div>
              </div>
              <Switch checked={ipAllowlist} onCheckedChange={setIpAllowlist} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted grid place-items-center"><Clock className="w-5 h-5" /></div>
                <div>
                  <div className="font-medium">Session timeout</div>
                  <div className="text-sm text-muted-foreground">Auto-logout after inactivity.</div>
                </div>
              </div>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold">Active sessions</h3>
                <p className="text-sm text-muted-foreground">Devices currently signed into your account.</p>
              </div>
              {sessions.filter((s) => !s.current).length > 0 && (
                <Button variant="outline" size="sm" className="text-destructive" onClick={revokeAllOther}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out all other sessions
                </Button>
              )}
            </div>
            <Separator />
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted grid place-items-center shrink-0">
                      {s.device.toLowerCase().includes("iphone") || s.device.toLowerCase().includes("ipad") ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium flex flex-wrap items-center gap-2">
                        {s.device} · <span className="text-muted-foreground font-normal">{s.browser}</span>
                        {s.current && <Badge variant="outline" className="text-success border-success/40">Current</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{s.location} · {s.ip} · {s.lastActive}</div>
                    </div>
                  </div>
                  {!s.current && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revokeSession(s.id)}>
                      <LogOut className="w-4 h-4 mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold">API keys</h3>
                <p className="text-sm text-muted-foreground">Programmatic access tokens for automation.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("New API key generated")}>
                <KeyRound className="w-4 h-4 mr-2" /> Generate new key
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              {API_KEYS.map((k) => (
                <div key={k.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <div className="font-medium">{k.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{k.key}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Created {k.created} · Last used {k.lastUsed}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => copyKey(k.key)} aria-label="Copy"><Copy className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => toast.success("API key revoked")} aria-label="Revoke"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-destructive/40">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 grid place-items-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-destructive">Danger zone</h3>
                  <p className="text-sm text-muted-foreground mt-1">Permanent actions that cannot be undone.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => { logout(); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out everywhere
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your admin account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove your account, revoke all sessions, and reassign your owned content. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast.error("Account deletion is disabled in demo")}>
                        Yes, delete account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="mt-4 space-y-6">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2"><Mail className="w-4 h-4" /> Email notifications</h3>
              <p className="text-sm text-muted-foreground">Choose what we email you about.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              {[
                { label: "New content reports", desc: "When a video or comment is reported.", value: emailReports, set: setEmailReports },
                { label: "Withdrawal requests", desc: "When a creator requests a payout.", value: emailWithdrawals, set: setEmailWithdrawals },
                { label: "Mentions & assignments", desc: "When you're mentioned or assigned a task.", value: emailMentions, set: setEmailMentions },
                { label: "Weekly summary", desc: "Performance digest every Monday at 9 AM IST.", value: emailWeekly, set: setEmailWeekly },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{row.label}</div>
                    <div className="text-sm text-muted-foreground">{row.desc}</div>
                  </div>
                  <Switch checked={row.value} onCheckedChange={row.set} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4" /> Push & SMS</h3>
              <p className="text-sm text-muted-foreground">Real-time alerts on your devices.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">All push notifications</div>
                  <div className="text-sm text-muted-foreground">In-app push for all admin events.</div>
                </div>
                <Switch checked={pushAll} onCheckedChange={setPushAll} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Urgent alerts only</div>
                  <div className="text-sm text-muted-foreground">High-priority items even when DND is on.</div>
                </div>
                <Switch checked={pushUrgent} onCheckedChange={setPushUrgent} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">SMS for critical events</div>
                  <div className="text-sm text-muted-foreground">Security breaches, downtime, suspicious logins.</div>
                </div>
                <Switch checked={smsCritical} onCheckedChange={setSmsCritical} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-brand text-white" onClick={() => toast.success("Notification preferences saved")}>
                <Save className="w-4 h-4 mr-2" /> Save preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ACTIVITY */}
        <TabsContent value="activity" className="mt-4 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Activity in the last 14 days</h3>
                <p className="text-sm text-muted-foreground">Daily admin actions performed by you.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Activity report exported")}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACTIVITY_CHART}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="actions" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#actGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Recent activity</h3>
                <p className="text-sm text-muted-foreground">Your latest actions across the admin panel.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Opening full audit log")}>View all</Button>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-1">
              {RECENT_ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex gap-3 py-3 relative">
                    <div className={cn("w-9 h-9 rounded-lg grid place-items-center shrink-0 z-10", a.iconBg)}>
                      <Icon className={cn("w-4 h-4", a.iconColor)} />
                    </div>
                    {i < RECENT_ACTIVITY.length - 1 && <div className="absolute left-[18px] top-12 bottom-0 w-px bg-border" />}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="font-medium text-sm">{a.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.meta}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* ACHIEVEMENTS */}
        <TabsContent value="achievements" className="mt-4 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2"><Award className="w-4 h-4" /> Achievements</h3>
                <p className="text-sm text-muted-foreground">Badges earned for your contributions.</p>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length} earned
              </Badge>
            </div>
            <Separator className="mb-5" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.label}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      a.earned ? "border-border hover:shadow-card hover:-translate-y-0.5" : "border-dashed border-border opacity-50 grayscale"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br grid place-items-center mb-3 shadow-card", a.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold">{a.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
                    {!a.earned && <Badge variant="outline" className="mt-2 text-[10px]">Locked</Badge>}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences" className="mt-4 space-y-6">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">How the admin dashboard looks for you.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-muted-foreground">Light, dark, or follow system.</div>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Density</div>
                  <div className="text-sm text-muted-foreground">Compact tables fit more rows.</div>
                </div>
                <Select value={density} onValueChange={setDensity}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Default landing page</div>
                  <div className="text-sm text-muted-foreground">Where you go after signing in.</div>
                </div>
                <Select value={startPage} onValueChange={setStartPage}>
                  <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/admin/dashboard">Dashboard</SelectItem>
                    <SelectItem value="/admin/inbox">Inbox</SelectItem>
                    <SelectItem value="/admin/reports">Reports</SelectItem>
                    <SelectItem value="/admin/withdrawals">Withdrawals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-brand text-white" onClick={() => toast.success("Preferences saved")}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">Data & privacy</h3>
              <p className="text-sm text-muted-foreground">Control your data exports and visibility.</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Data export queued — you'll get an email")}>
                <Download className="w-4 h-4 mr-2" /> Download all my data (JSON)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Activity log exported (CSV)")}>
                <Download className="w-4 h-4 mr-2" /> Export activity log (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Privacy report opened")}>
                <Shield className="w-4 h-4 mr-2" /> View privacy report
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
