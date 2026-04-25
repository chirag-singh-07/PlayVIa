// Mock data generators for the admin dashboard.

export const VIDEO_STATUSES = ["Published", "Processing", "Suspended", "Draft"] as const;
export type VideoStatus = typeof VIDEO_STATUSES[number];

export const USER_STATUSES = ["Active", "Banned", "Pending", "Suspended"] as const;
export type UserStatus = typeof USER_STATUSES[number];

export const CATEGORIES = ["Music", "Gaming", "Comedy", "News", "Education", "Movies", "Sports", "Cooking", "Tech", "Vlogs"];
const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rohan", "Priya", "Ananya", "Diya", "Saanvi", "Aadhya", "Kavya", "Meera", "Sneha", "Aisha", "Riya"];
const LAST = ["Sharma", "Verma", "Patel", "Iyer", "Reddy", "Nair", "Khan", "Singh", "Kumar", "Rao", "Mehta", "Gupta", "Joshi", "Mishra"];
const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const VIDEO_TITLES = [
  "Top 10 Bollywood Songs of 2024", "Street Food Tour in Old Delhi", "Mumbai Local Train Vlog", "How to Make Perfect Biryani",
  "Cricket Highlights: India vs Australia", "Diwali Decoration Ideas DIY", "Bangalore Tech Park Tour", "Best Hill Stations in India",
  "Telugu Movie Review", "Hindi Stand-up Comedy Show", "Yoga for Beginners — Hindi", "Stock Market Tips in Hindi",
  "Tamil Cinema Classics", "Kerala Travel Diaries", "PUBG Mobile Pro Gameplay", "Kids Learning ABCD in Tamil",
  "Marathi Wedding Highlights", "Kashmir Snow Vlog", "Chai Banane Ka Sahi Tarika", "Goa Beach Party 2024",
];

function rand<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Seeded for stability across renders
let seed = 1337;
function srand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function spick<T>(arr: readonly T[]) { return arr[Math.floor(srand() * arr.length)]; }
function sint(min: number, max: number) { return Math.floor(srand() * (max - min + 1)) + min; }

export interface Video {
  id: string; title: string; creator: string; category: string;
  views: number; likes: number; status: VideoStatus; date: string;
  duration: string; thumb: string;
}

const THUMB_GRADIENTS = [
  "from-red-500 to-orange-500", "from-purple-500 to-pink-500", "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500", "from-teal-500 to-green-500",
];

export function generateVideos(count = 60): Video[] {
  seed = 4242;
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - sint(0, 90));
    return {
      id: `vid_${(1000 + i).toString()}`,
      title: spick(VIDEO_TITLES) + (sint(0, 1) ? ` — Part ${sint(1, 5)}` : ""),
      creator: `${spick(FIRST)} ${spick(LAST)}`,
      category: spick(CATEGORIES),
      views: sint(1_200, 5_000_000),
      likes: sint(50, 240_000),
      status: spick(VIDEO_STATUSES),
      date: d.toISOString(),
      duration: `${sint(1, 25)}:${String(sint(0, 59)).padStart(2, "0")}`,
      thumb: spick(THUMB_GRADIENTS),
    };
  });
}

export interface AdminUserRecord {
  id: string; name: string; email: string; phone: string;
  role: "User" | "Creator" | "Premium";
  videos: number; date: string; status: UserStatus; verified: boolean;
  city: string; avatarColor: string;
}

const AVATAR_COLORS = ["bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500", "bg-cyan-500", "bg-indigo-500"];

export function generateUsers(count = 50): AdminUserRecord[] {
  seed = 9999;
  return Array.from({ length: count }, (_, i) => {
    const first = spick(FIRST);
    const last = spick(LAST);
    const d = new Date();
    d.setDate(d.getDate() - sint(0, 365));
    return {
      id: `usr_${(1000 + i).toString()}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${sint(1, 99)}@gmail.com`,
      phone: `+91 ${sint(70000, 99999)}${sint(10000, 99999)}`,
      role: ([ "User", "User", "User", "Creator", "Premium" ] as const)[sint(0, 4)],
      videos: sint(0, 240),
      date: d.toISOString(),
      status: spick(USER_STATUSES),
      verified: srand() > 0.5,
      city: spick(CITIES),
      avatarColor: spick(AVATAR_COLORS),
    };
  });
}

export interface Transaction {
  id: string; user: string; type: "Ad Revenue" | "Subscription" | "Purchase" | "Creator Payout";
  amount: number; status: "Completed" | "Pending" | "Failed"; date: string;
}

export function generateTransactions(count = 30): Transaction[] {
  seed = 7777;
  const types = ["Ad Revenue", "Subscription", "Purchase", "Creator Payout"] as const;
  const statuses = ["Completed", "Completed", "Completed", "Pending", "Failed"] as const;
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - sint(0, 60));
    return {
      id: `TXN${(100000 + i).toString()}`,
      user: `${spick(FIRST)} ${spick(LAST)}`,
      type: spick(types),
      amount: sint(50, 50_000),
      status: spick(statuses),
      date: d.toISOString(),
    };
  });
}

// Chart datasets ----------------------------------------------------

export const dauData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    day: `${d.getDate()}/${d.getMonth() + 1}`,
    users: 380000 + Math.round(Math.sin(i / 3) * 40000) + i * 2400 + (i % 7 === 0 ? -25000 : 0),
  };
});

export const trafficSources = [
  { name: "Direct", value: 42, color: "hsl(var(--primary))" },
  { name: "Google", value: 28, color: "hsl(var(--primary-glow))" },
  { name: "Social", value: 18, color: "hsl(var(--success))" },
  { name: "Referral", value: 12, color: "hsl(var(--warning))" },
];

export const uploadsData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    day: `${d.getDate()}/${d.getMonth() + 1}`,
    uploads: 80 + Math.round(Math.cos(i / 2) * 30) + i * 4,
  };
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const revenueByMonth = MONTHS.map((m, i) => ({
  month: m,
  revenue: 350000 + Math.round(Math.sin(i / 2) * 80000) + i * 35000,
}));

export const revenueBySource = [
  { name: "Ads", value: 4_82_500, color: "hsl(var(--primary))" },
  { name: "Subscriptions", value: 1_92_000, color: "hsl(var(--primary-glow))" },
  { name: "Purchases", value: 98_000, color: "hsl(var(--success))" },
  { name: "Creator Share", value: 70_000, color: "hsl(var(--warning))" },
];

export const revenueByCategory = CATEGORIES.slice(0, 8).map((c, i) => ({
  category: c, revenue: 50000 + ((i * 17 + 31) % 9) * 32000,
}));

// Format helpers ---------------------------------------------------
export function fmtINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
export function fmtCompact(n: number): string {
  if (n >= 10_000_000) return (n / 10_000_000).toFixed(1) + " Cr";
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(1) + " L";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ============= Phase 3 mock generators =============

export interface Category {
  id: string; name: string; slug: string; icon: string;
  description: string; videos: number; active: boolean; order: number;
}
const CATEGORY_META: Array<{ name: string; icon: string; desc: string }> = [
  { name: "Music", icon: "🎵", desc: "Bollywood, regional and indie tracks" },
  { name: "Gaming", icon: "🎮", desc: "Live streams, walkthroughs, esports" },
  { name: "Comedy", icon: "😂", desc: "Stand-up, sketches and roasts" },
  { name: "News", icon: "📰", desc: "National, regional and global news" },
  { name: "Education", icon: "📚", desc: "Tutorials, exam prep and lectures" },
  { name: "Movies", icon: "🎬", desc: "Trailers, reviews and short films" },
  { name: "Sports", icon: "🏏", desc: "Cricket, kabaddi, football & more" },
  { name: "Cooking", icon: "🍛", desc: "Indian recipes from every region" },
  { name: "Tech", icon: "💻", desc: "Reviews, unboxings and how-tos" },
  { name: "Vlogs", icon: "📹", desc: "Daily life and travel diaries" },
];
export function generateCategories(): Category[] {
  seed = 5151;
  return CATEGORY_META.map((c, i) => ({
    id: `cat_${i + 1}`,
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, "-"),
    icon: c.icon,
    description: c.desc,
    videos: sint(120, 9800),
    active: i !== 9 ? true : false,
    order: i + 1,
  }));
}

export interface CommentRecord {
  id: string; text: string; user: string; video: string;
  date: string; likes: number; status: "Visible" | "Hidden" | "Reported" | "Spam";
}
const COMMENT_TEXTS = [
  "Bahut acchi video hai bhai 🔥", "First comment!", "Please make a part 2",
  "This is amazing content, keep it up", "Bakwaas video, time waste",
  "Visit my channel for more such content", "Mast laga ye, share kar diya",
  "Quality has improved a lot, well done", "Click my profile for free recharge!",
  "Background music kaunsa hai?", "Mumbai se pyaar ❤️", "Saw this on Insta first",
  "Great editing! Which app do you use?", "Promote my channel guys, sub for sub",
  "Iss video me information galat hai", "Aap Tamil me bhi banao please",
];
export function generateComments(count = 40): CommentRecord[] {
  seed = 3131;
  const statuses = ["Visible", "Visible", "Visible", "Hidden", "Reported", "Spam"] as const;
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - sint(0, 30));
    return {
      id: `cmt_${10000 + i}`,
      text: spick(COMMENT_TEXTS),
      user: `${spick(FIRST)} ${spick(LAST)}`,
      video: spick(VIDEO_TITLES),
      date: d.toISOString(),
      likes: sint(0, 4200),
      status: spick(statuses),
    };
  });
}

export interface ReportRecord {
  id: string; type: "Video" | "User" | "Comment"; target: string;
  reportedBy: string; reason: string; date: string;
  priority: "High" | "Medium" | "Low"; status: "Pending" | "Under Review" | "Resolved" | "Dismissed";
}
const REASONS = ["Spam or misleading", "Hate speech", "Sexual content", "Violence", "Copyright violation", "Harassment", "Misinformation", "Child safety"];
export function generateReports(count = 35): ReportRecord[] {
  seed = 2424;
  const types = ["Video", "Video", "User", "Comment"] as const;
  const prios = ["High", "Medium", "Medium", "Low"] as const;
  const statuses = ["Pending", "Pending", "Under Review", "Resolved", "Dismissed"] as const;
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - sint(0, 21));
    const type = spick(types);
    return {
      id: `RPT${1000 + i}`,
      type,
      target: type === "User" ? `${spick(FIRST)} ${spick(LAST)}` : spick(VIDEO_TITLES),
      reportedBy: `${spick(FIRST)} ${spick(LAST)}`,
      reason: spick(REASONS),
      date: d.toISOString(),
      priority: spick(prios),
      status: spick(statuses),
    };
  });
}

export interface CreatorApplication {
  id: string; name: string; channel: string; subscribers: number;
  videos: number; appliedDate: string; status: "Pending" | "Approved" | "Rejected";
  email: string; avatarColor: string;
}
export function generateCreatorApplications(count = 18): CreatorApplication[] {
  seed = 1212;
  const statuses = ["Pending", "Pending", "Pending", "Approved", "Rejected"] as const;
  return Array.from({ length: count }, (_, i) => {
    const f = spick(FIRST), l = spick(LAST);
    const d = new Date(); d.setDate(d.getDate() - sint(0, 30));
    return {
      id: `crapp_${100 + i}`,
      name: `${f} ${l}`,
      channel: `${f}${l}Official`,
      subscribers: sint(1_000, 850_000),
      videos: sint(5, 320),
      appliedDate: d.toISOString(),
      status: spick(statuses),
      email: `${f.toLowerCase()}.${l.toLowerCase()}@gmail.com`,
      avatarColor: spick(AVATAR_COLORS),
    };
  });
}

export interface BannedRecord {
  id: string; name: string; email: string; reason: string;
  bannedDate: string; duration: string; bannedBy: string; avatarColor: string;
}
export function generateBanned(count = 22): BannedRecord[] {
  seed = 8181;
  const reasons = ["Spam content", "Harassment", "Copyright strikes", "Hate speech", "Fake account", "Adult content"];
  const durations = ["7 days", "30 days", "90 days", "Permanent", "Permanent"];
  const admins = ["Rahul Admin", "Priya Mod", "Ankit S.", "Neha M."];
  return Array.from({ length: count }, (_, i) => {
    const f = spick(FIRST), l = spick(LAST);
    const d = new Date(); d.setDate(d.getDate() - sint(0, 120));
    return {
      id: `ban_${500 + i}`,
      name: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@gmail.com`,
      reason: spick(reasons),
      bannedDate: d.toISOString(),
      duration: spick(durations),
      bannedBy: spick(admins),
      avatarColor: spick(AVATAR_COLORS),
    };
  });
}

export interface Withdrawal {
  id: string; creator: string; amount: number; method: "UPI" | "Bank Transfer";
  account: string; requested: string;
  status: "Pending" | "Approved" | "Processing" | "Paid" | "Rejected";
  avatarColor: string;
}
export function generateWithdrawals(count = 28): Withdrawal[] {
  seed = 6262;
  const statuses = ["Pending", "Pending", "Approved", "Processing", "Paid", "Paid", "Rejected"] as const;
  const methods = ["UPI", "UPI", "Bank Transfer"] as const;
  return Array.from({ length: count }, (_, i) => {
    const f = spick(FIRST), l = spick(LAST);
    const d = new Date(); d.setDate(d.getDate() - sint(0, 45));
    const method = spick(methods);
    return {
      id: `WD${10000 + i}`,
      creator: `${f} ${l}`,
      amount: sint(500, 95_000),
      method,
      account: method === "UPI"
        ? `${f.toLowerCase()}${sint(10, 99)}@okicici`
        : `HDFC •••• ${sint(1000, 9999)}`,
      requested: d.toISOString(),
      status: spick(statuses),
      avatarColor: spick(AVATAR_COLORS),
    };
  });
}

export interface AdCampaign {
  id: string; name: string; advertiser: string; budget: number; spent: number;
  impressions: number; clicks: number; ctr: number;
  status: "Active" | "Paused" | "Completed" | "Pending";
  startDate: string; endDate: string;
}
export function generateAdCampaigns(count = 15): AdCampaign[] {
  seed = 7373;
  const advertisers = ["Flipkart", "Myntra", "Zomato", "Swiggy", "PhonePe", "CRED", "BYJU's", "Unacademy", "Dream11", "Tata CLiQ"];
  const statuses = ["Active", "Active", "Paused", "Completed", "Pending"] as const;
  return Array.from({ length: count }, (_, i) => {
    const d1 = new Date(); d1.setDate(d1.getDate() - sint(5, 60));
    const d2 = new Date(); d2.setDate(d2.getDate() + sint(5, 60));
    const budget = sint(50_000, 12_00_000);
    const spent = Math.floor(budget * (srand() * 0.9));
    const impressions = sint(50_000, 5_000_000);
    const clicks = Math.floor(impressions * (0.005 + srand() * 0.04));
    return {
      id: `AD${1000 + i}`,
      name: `${spick(advertisers)} ${spick(["Festive", "Launch", "Diwali", "Sale", "Brand"])} Campaign`,
      advertiser: spick(advertisers),
      budget, spent, impressions, clicks,
      ctr: +(clicks / impressions * 100).toFixed(2),
      status: spick(statuses),
      startDate: d1.toISOString(),
      endDate: d2.toISOString(),
    };
  });
}

export interface AppVersion {
  id: string; version: string; releaseNotes: string; date: string;
  downloads: number; forceUpdate: boolean; status: "Live" | "Archived" | "Beta";
  size: string;
}
export function generateAppVersions(): AppVersion[] {
  seed = 4040;
  const versions = [
    { v: "2.1.0", notes: "New dark mode, faster startup, bug fixes for live streaming", status: "Live" as const, force: false },
    { v: "2.0.5", notes: "Critical security patch, improved video buffering", status: "Archived" as const, force: true },
    { v: "2.0.4", notes: "Comment moderation tools for creators", status: "Archived" as const, force: false },
    { v: "2.0.3", notes: "Push notification improvements", status: "Archived" as const, force: false },
    { v: "2.0.2", notes: "Tamil and Telugu UI translations added", status: "Archived" as const, force: false },
    { v: "2.0.1", notes: "Hotfix for login issues on Android 14", status: "Archived" as const, force: true },
    { v: "2.0.0", notes: "Major release: new home feed, creator dashboard, monetization", status: "Archived" as const, force: false },
  ];
  return versions.map((it, i) => {
    const d = new Date(); d.setDate(d.getDate() - i * 18 - sint(0, 5));
    return {
      id: `ver_${i + 1}`,
      version: it.v,
      releaseNotes: it.notes,
      date: d.toISOString(),
      downloads: sint(50_000, 2_500_000),
      forceUpdate: it.force,
      status: it.status,
      size: `${sint(42, 58)}.${sint(0, 9)} MB`,
    };
  });
}

export interface NotificationRecord {
  id: string; title: string; message: string; target: "All Users" | "Creators" | "Premium" | "Specific";
  scheduledAt: string; status: "Sent" | "Scheduled" | "Failed";
  recipients: number; openRate: number;
}
export function generateNotifications(count = 18): NotificationRecord[] {
  seed = 1919;
  const samples = [
    { t: "🎬 New trending video!", m: "Check out the latest viral video on PlayVia" },
    { t: "💰 Earn more this month", m: "New monetization options unlocked for creators" },
    { t: "🎉 Diwali offer", m: "Get Premium at 50% off this festive season" },
    { t: "🆕 App update available", m: "Update to v2.1.0 for the latest features" },
    { t: "⚠️ Maintenance scheduled", m: "We'll be down for 30 mins tonight at 2 AM IST" },
    { t: "🏆 You have 1.2M views!", m: "Your channel hit a new milestone, keep going" },
  ];
  const targets = ["All Users", "Creators", "Premium", "Specific"] as const;
  const statuses = ["Sent", "Sent", "Sent", "Scheduled", "Failed"] as const;
  return Array.from({ length: count }, (_, i) => {
    const s = samples[i % samples.length];
    const d = new Date(); d.setDate(d.getDate() - sint(-3, 30));
    return {
      id: `ntf_${500 + i}`,
      title: s.t, message: s.m,
      target: spick(targets),
      scheduledAt: d.toISOString(),
      status: spick(statuses),
      recipients: sint(5_000, 5_24_000),
      openRate: +(srand() * 60 + 10).toFixed(1),
    };
  });
}

export interface BannerRecord {
  id: string; title: string; link: string; position: "Home Top" | "Home Middle" | "Player";
  startDate: string; endDate: string; active: boolean; order: number;
  gradient: string; clicks: number;
}
export function generateBanners(): BannerRecord[] {
  seed = 5959;
  const items = [
    { title: "Watch IPL 2025 Highlights", link: "/category/sports", position: "Home Top" as const },
    { title: "Premium @ ₹49/month", link: "/premium", position: "Home Top" as const },
    { title: "Become a Creator", link: "/creator", position: "Home Middle" as const },
    { title: "Diwali Special Movies", link: "/category/movies", position: "Home Middle" as const },
    { title: "Download Videos Offline", link: "/features/offline", position: "Player" as const },
    { title: "Refer & Earn ₹100", link: "/refer", position: "Home Top" as const },
  ];
  return items.map((it, i) => {
    const d1 = new Date(); d1.setDate(d1.getDate() - sint(2, 30));
    const d2 = new Date(); d2.setDate(d2.getDate() + sint(10, 60));
    return {
      id: `bnr_${i + 1}`,
      title: it.title, link: it.link, position: it.position,
      startDate: d1.toISOString(), endDate: d2.toISOString(),
      active: i !== 5, order: i + 1,
      gradient: spick(THUMB_GRADIENTS),
      clicks: sint(1200, 95000),
    };
  });
}

export interface AdminAccount {
  id: string; name: string; email: string;
  role: "Super Admin" | "Moderator" | "Support" | "Analyst";
  lastLogin: string; status: "Active" | "Suspended"; avatarColor: string;
}
export function generateAdminAccounts(): AdminAccount[] {
  seed = 8484;
  const accounts: Array<Omit<AdminAccount, "id" | "lastLogin" | "avatarColor">> = [
    { name: "Rahul Sharma", email: "rahul@playvia.in", role: "Super Admin", status: "Active" },
    { name: "Priya Verma", email: "priya@playvia.in", role: "Moderator", status: "Active" },
    { name: "Ankit Singh", email: "ankit@playvia.in", role: "Moderator", status: "Active" },
    { name: "Neha Mehta", email: "neha@playvia.in", role: "Support", status: "Active" },
    { name: "Vikram Reddy", email: "vikram@playvia.in", role: "Analyst", status: "Active" },
    { name: "Sneha Iyer", email: "sneha@playvia.in", role: "Support", status: "Suspended" },
    { name: "Karan Patel", email: "karan@playvia.in", role: "Moderator", status: "Active" },
  ];
  return accounts.map((a, i) => {
    const d = new Date(); d.setHours(d.getHours() - sint(1, 240));
    return { ...a, id: `adm_${i + 1}`, lastLogin: d.toISOString(), avatarColor: spick(AVATAR_COLORS) };
  });
}

export interface LogRecord {
  id: string; admin: string; action: string;
  type: "Create" | "Edit" | "Delete" | "Login" | "Logout";
  target: string; ip: string; date: string;
}
export function generateLogs(count = 60): LogRecord[] {
  seed = 9494;
  const admins = ["Rahul Sharma", "Priya Verma", "Ankit Singh", "Neha Mehta", "Vikram Reddy", "Karan Patel"];
  const types = ["Create", "Edit", "Delete", "Login", "Edit", "Edit", "Logout"] as const;
  const verbs: Record<typeof types[number], string[]> = {
    Create: ["Created banner", "Added admin user", "Created category", "Sent notification"],
    Edit: ["Updated video status", "Edited user profile", "Changed settings", "Approved withdrawal", "Updated app version"],
    Delete: ["Deleted comment", "Removed video", "Banned user", "Archived banner"],
    Login: ["Logged in"],
    Logout: ["Logged out"],
  };
  return Array.from({ length: count }, (_, i) => {
    const t = spick(types);
    const d = new Date(); d.setMinutes(d.getMinutes() - sint(0, 60 * 24 * 14));
    return {
      id: `log_${20000 + i}`,
      admin: spick(admins),
      action: spick(verbs[t]),
      type: t,
      target: spick(["Video #vid_1023", "User #usr_1042", "Banner #bnr_2", "Category Music", "Withdrawal WD10042", "Settings", "—"]),
      ip: `${sint(49, 223)}.${sint(0, 255)}.${sint(0, 255)}.${sint(1, 254)}`,
      date: d.toISOString(),
    };
  });
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mn = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${mn}`;
}
