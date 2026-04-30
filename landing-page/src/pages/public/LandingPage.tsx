import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Play, Upload, Download, Globe, Sparkles, Wifi, BarChart3, IndianRupee, Radio, Star, ArrowRight, TrendingUp, Users, Zap, Eye, Heart, Music, Gamepad2, Utensils, Plane, Film, GraduationCap, Smartphone, Apple, Shield, Headphones, MessageCircle, Award, CheckCircle2, Mail } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { reviews, faqs, successStories, formatINR } from "@/data/mock";

const earningsData = [
  { views: "1K", amount: 50 },
  { views: "10K", amount: 500 },
  { views: "50K", amount: 2500 },
  { views: "100K", amount: 5000 },
  { views: "500K", amount: 25000 },
  { views: "1M", amount: 50000 },
  { views: "2M", amount: 100000 },
];

const stats = [
  { value: "10M+", label: "Downloads", icon: Download },
  { value: "50K+", label: "Creators", icon: Users },
  { value: "₹2Cr+", label: "Paid to Creators", icon: IndianRupee },
  { value: "150M+", label: "Daily Views", icon: Eye },
];

const viewerFeatures = [
  { icon: Play, title: "HD Streaming", desc: "Crystal clear up to 4K with adaptive bitrate." },
  { icon: Wifi, title: "Offline Mode", desc: "Download and watch anywhere, anytime." },
  { icon: Globe, title: "10+ Languages", desc: "Hindi, English, Tamil, Telugu and more." },
  { icon: Sparkles, title: "Smart Recommendations", desc: "AI-powered feed tailored just for you." },
];

const creatorFeatures = [
  { icon: Upload, title: "Easy Uploads", desc: "Upload videos in seconds with auto-processing." },
  { icon: IndianRupee, title: "Monetization", desc: "Start earning from your first 1000 views." },
  { icon: BarChart3, title: "Analytics Studio", desc: "Deep insights into your audience and growth." },
  { icon: Radio, title: "Live Streaming", desc: "Go live with zero-lag streaming and live chat." },
];

const categories = [
  { icon: Film, label: "Entertainment", color: "from-pink-500 to-rose-500" },
  { icon: Music, label: "Music", color: "from-purple-500 to-indigo-500" },
  { icon: Gamepad2, label: "Gaming", color: "from-blue-500 to-cyan-500" },
  { icon: Utensils, label: "Food", color: "from-orange-500 to-amber-500" },
  { icon: Plane, label: "Travel", color: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap, label: "Education", color: "from-violet-500 to-fuchsia-500" },
  { icon: TrendingUp, label: "Tech", color: "from-sky-500 to-blue-600" },
  { icon: Heart, label: "Lifestyle", color: "from-red-500 to-pink-500" },
];

const languages = [
  "हिन्दी", "English", "தமிழ்", "తెలుగు", "বাংলা", "मराठी", "ಕನ್ನಡ", "മലയാളം", "ગુજરાતી", "ਪੰਜਾਬੀ",
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Everything you need to get started.",
    features: ["HD streaming", "Ad-supported", "Basic creator tools", "Community access"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹149",
    period: "/month",
    desc: "For serious viewers and growing creators.",
    features: ["4K streaming, no ads", "Offline downloads", "Advanced analytics", "Priority support", "Higher revenue share"],
    cta: "Start 7-day trial",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "₹499",
    period: "/month",
    desc: "For pro creators & teams.",
    features: ["Multi-user studio", "Live streaming pro", "Brand sponsorship hub", "Dedicated manager", "Highest payouts"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const press = ["YourStory", "Inc42", "ET Tech", "TechCrunch India", "Mint", "Forbes India"];

const creatorTools = [
  { icon: Sparkles, title: "AI Thumbnail Studio", desc: "Generate scroll-stopping thumbnails in one click." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track views, retention and revenue as it happens." },
  { icon: MessageCircle, title: "Community Tab", desc: "Polls, posts and stories to engage between uploads." },
  { icon: Shield, title: "Copyright Shield", desc: "Auto-detect and protect your original content." },
  { icon: Headphones, title: "Royalty-free Music", desc: "10,000+ tracks ready to drop into any video." },
  { icon: Award, title: "Creator Rewards", desc: "Monthly bonuses for top-performing channels." },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function LandingPage() {
  const [tab, setTab] = useState<"viewers" | "creators">("viewers");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-gradient-soft -z-10" />
        <div className="container relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-primary text-primary-foreground border-0 px-4 py-1.5">
              <Sparkles className="h-3 w-3 mr-1.5" /> India's #1 Creator Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Watch, Create &{" "}
              <span className="text-gradient">Go Viral</span>
              <br /> India's Own Video Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Stream videos, upload your content, and grow your audience — all in one app. Earn up to <span className="font-bold text-foreground">₹1,00,000/month</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="h-12 px-8 hover-lift">
                <Play className="mr-2 h-4 w-4 fill-current" /> Watch Videos
              </Button>
              <Button asChild size="lg" className="h-12 px-8 bg-gradient-primary hover:opacity-90 shadow-glow animate-glow-pulse">
                <Link to="/creator/signup"><Upload className="mr-2 h-4 w-4" /> Start Creating</Link>
              </Button>
            </div>
          </motion.div>

          {/* Toggle Tabs */}
          <motion.div {...fadeUp} className="mt-16 max-w-5xl mx-auto">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="mx-auto grid w-full max-w-md grid-cols-2 h-12 glass">
                <TabsTrigger value="viewers" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">For Viewers</TabsTrigger>
                <TabsTrigger value="creators" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">For Creators</TabsTrigger>
              </TabsList>
              <TabsContent value="viewers" className="mt-8">
                <Card className="glass shadow-elegant border-0 overflow-hidden">
                  <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Endless entertainment, in your language</h3>
                      <p className="text-muted-foreground mb-6">Discover trending videos, follow your favorite creators, and never miss a moment. HD streaming with offline downloads.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["10+ Languages", "Offline mode", "HD/4K quality", "Smart feed"].map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm"><Zap className="h-4 w-4 text-primary" />{f}</div>
                        ))}
                      </div>
                    </div>
                    <div className="relative h-64 rounded-2xl bg-gradient-primary flex items-center justify-center overflow-hidden">
                      <Play className="h-20 w-20 text-primary-foreground fill-primary-foreground animate-float" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="creators" className="mt-8">
                <Card className="glass shadow-elegant border-0 overflow-hidden">
                  <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Build your audience, earn real money</h3>
                      <p className="text-muted-foreground mb-6">Upload, monetize, and analyze. Top creators earn ₹1,00,000+ every month from their channels.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["Quick payouts", "Studio analytics", "Live streaming", "₹1L+ /month"].map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4 text-primary" />{f}</div>
                        ))}
                      </div>
                    </div>
                    <div className="relative h-64 rounded-2xl bg-gradient-secondary flex items-center justify-center overflow-hidden">
                      <BarChart3 className="h-20 w-20 text-primary-foreground animate-float" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 border-y bg-muted/20">
        <div className="container">
          <p className="text-center text-sm font-medium text-muted-foreground mb-10">TRUSTED BY CREATORS ACROSS INDIA</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary mb-3 shadow-glow"><s.icon className="h-5 w-5 text-primary-foreground" /></div>
                <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {press.map((p) => (
              <span key={p} className="text-sm font-semibold tracking-wide text-muted-foreground">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-4">Explore</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Something for <span className="text-gradient">every mood</span></h2>
            <p className="text-muted-foreground text-lg">Dive into the categories India loves the most.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {categories.map((c, i) => (
              <motion.div key={c.label} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Card className="hover-lift border-0 shadow-card cursor-pointer group">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-card group-hover:scale-110 transition-smooth`}>
                      <c.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold">{c.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SPLIT */}
      <section id="features" className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for everyone</h2>
            <p className="text-muted-foreground text-lg">Whether you watch or create, we've got you covered.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[{ title: "For Viewers", color: "bg-gradient-primary", items: viewerFeatures }, { title: "For Creators", color: "bg-gradient-secondary", items: creatorFeatures }].map((group) => (
              <motion.div key={group.title} {...fadeUp}>
                <Card className="h-full hover-lift border-0 shadow-card overflow-hidden">
                  <div className={`${group.color} p-6 text-primary-foreground`}>
                    <h3 className="text-2xl font-bold">{group.title}</h3>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {group.items.map((f) => (
                      <div key={f.title} className="flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><f.icon className="h-5 w-5 text-primary" /></div>
                        <div>
                          <div className="font-semibold">{f.title}</div>
                          <div className="text-sm text-muted-foreground">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-4"><Globe className="h-3 w-3 mr-1.5 inline" /> Languages</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Watch in <span className="text-gradient">your language</span></h2>
            <p className="text-muted-foreground text-lg">Content from every corner of India — dubbed, subtitled, native.</p>
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {languages.map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Badge variant="outline" className="px-5 py-2 text-base bg-card hover:bg-gradient-primary hover:text-primary-foreground hover:border-transparent transition-smooth cursor-pointer">
                  {l}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CREATOR EARNINGS */}
      <section id="earnings" className="py-24 bg-mesh">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
            <Badge className="mb-4 bg-gradient-primary text-primary-foreground border-0">💰 Earnings</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Turn your views into <span className="text-gradient">real money</span></h2>
            <p className="text-muted-foreground text-lg">Transparent revenue share. No hidden fees. Direct UPI payouts.</p>
          </motion.div>
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <Card className="glass border-0 shadow-elegant overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[{ v: "10K", a: "₹500" }, { v: "100K", a: "₹5,000" }, { v: "1M", a: "₹50,000" }].map((e) => (
                    <div key={e.v} className="text-center p-4 rounded-2xl bg-background/50">
                      <div className="text-sm text-muted-foreground">{e.v} views</div>
                      <div className="text-3xl font-bold text-gradient">{e.a}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="views" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => formatINR(v)} />
                    <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#earnGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="text-center mt-6">
                  <Button asChild size="lg" className="bg-gradient-primary shadow-glow"><Link to="/creator/signup">Start Earning Now <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CREATOR TOOLS */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-4">Creator Tools</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">A studio in your pocket</h2>
            <p className="text-muted-foreground text-lg">Pro-grade tools that take you from idea to viral — fast.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {creatorTools.map((t, i) => (
              <motion.div key={t.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Card className="hover-lift border-0 shadow-card h-full group">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-smooth">
                      <t.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Product</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Beautiful experience, end-to-end</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "App UI", subtitle: "Watch & discover", gradient: "bg-gradient-primary", icon: Play },
              { title: "Creator Dashboard", subtitle: "Studio analytics", gradient: "bg-gradient-secondary", icon: BarChart3 },
            ].map((s) => (
              <motion.div key={s.title} {...fadeUp} className="hover-lift">
                <Card className="overflow-hidden border-0 shadow-elegant">
                  <div className={`${s.gradient} aspect-[4/3] flex items-center justify-center relative`}>
                    <s.icon className="h-32 w-32 text-primary-foreground/80 animate-float" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
                      <div className="text-primary-foreground font-bold text-xl">{s.title}</div>
                      <div className="text-primary-foreground/80 text-sm">{s.subtitle}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE STREAMING SPOTLIGHT */}
      <section className="py-24 bg-mesh">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div {...fadeUp}>
              <Badge className="mb-4 bg-gradient-secondary text-primary-foreground border-0">
                <Radio className="h-3 w-3 mr-1.5 animate-pulse" /> LIVE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Go <span className="text-gradient">live</span> with zero lag</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Stream in 1080p with real-time chat, super-chats, and instant replays. Connect with your audience the moment it matters.
              </p>
              <div className="space-y-3 mb-8">
                {["Multi-camera switching", "Super Chat tips in INR", "Instant clip & share", "Stream from mobile or desktop"].map((f) => (
                  <div key={f} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>{f}</span></div>
                ))}
              </div>
              <Button size="lg" className="bg-gradient-primary shadow-glow"><Radio className="mr-2 h-4 w-4" /> Try Live Streaming</Button>
            </motion.div>
            <motion.div {...fadeUp} className="relative">
              <Card className="overflow-hidden border-0 shadow-elegant">
                <div className="aspect-video bg-gradient-secondary relative flex items-center justify-center">
                  <Radio className="h-24 w-24 text-primary-foreground animate-float" />
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground border-0">
                    <span className="h-2 w-2 rounded-full bg-current mr-1.5 animate-pulse" /> LIVE • 12.4K watching
                  </Badge>
                </div>
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20"><AvatarFallback>RV</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">Mumbai Indians vs CSK Watch Party</div>
                    <div className="text-xs text-muted-foreground">@rahulvlogs</div>
                  </div>
                  <Heart className="h-5 w-5 text-destructive fill-destructive" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get started in minutes</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {[
              { title: "For Viewers", color: "text-primary", steps: [{ icon: Download, label: "Download" }, { icon: Eye, label: "Browse" }, { icon: Play, label: "Watch" }] },
              { title: "For Creators", color: "text-secondary", steps: [{ icon: Users, label: "Signup" }, { icon: Upload, label: "Upload" }, { icon: IndianRupee, label: "Earn" }] },
            ].map((flow) => (
              <motion.div key={flow.title} {...fadeUp}>
                <h3 className={`text-xl font-bold mb-8 ${flow.color}`}>{flow.title}</h3>
                <div className="space-y-6">
                  {flow.steps.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0"><s.icon className="h-6 w-6 text-primary-foreground" /></div>
                      <div>
                        <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                        <div className="text-lg font-semibold">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-muted/20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, <span className="text-gradient">honest pricing</span></h2>
            <p className="text-muted-foreground text-lg">Free to start. Upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <motion.div key={p.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className={`h-full border-0 shadow-card hover-lift relative overflow-hidden ${p.highlighted ? "ring-2 ring-primary shadow-elegant" : ""}`}>
                  {p.highlighted && (
                    <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{p.desc}</p>
                    <ul className="space-y-3 mb-8">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${p.highlighted ? "bg-gradient-primary shadow-glow" : ""}`} variant={p.highlighted ? "default" : "outline"}>
                      {p.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Creators who made it big</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {successStories.map((s, i) => (
              <motion.div key={s.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="hover-lift border-0 shadow-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.handle}</div>
                      </div>
                    </div>
                    <p className="text-sm mb-4 italic">"{s.quote}"</p>
                    <div className="flex justify-between pt-4 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">Earnings</div>
                        <div className="font-bold text-gradient">{s.earnings}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                        <div className="font-bold text-success">{s.growth}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE APP DOWNLOAD */}
      <section className="py-24">
        <div className="container">
          <Card className="border-0 shadow-elegant overflow-hidden bg-gradient-primary text-primary-foreground max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center p-10 md:p-16">
              <motion.div {...fadeUp}>
                <Badge className="mb-4 bg-background/20 text-primary-foreground border-0 backdrop-blur">
                  <Smartphone className="h-3 w-3 mr-1.5" /> Mobile App
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Take PayVia <br />everywhere you go</h2>
                <p className="opacity-90 text-lg mb-8">Available on iOS and Android. Optimized for 2G to 5G networks across India.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 h-14 px-6">
                    <Apple className="mr-3 h-6 w-6" />
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Download on the</div>
                      <div className="font-bold -mt-0.5">App Store</div>
                    </div>
                  </Button>
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 h-14 px-6">
                    <Play className="mr-3 h-6 w-6 fill-current" />
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Get it on</div>
                      <div className="font-bold -mt-0.5">Google Play</div>
                    </div>
                  </Button>
                </div>
              </motion.div>
              <motion.div {...fadeUp} className="relative h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-background/10 rounded-3xl backdrop-blur-sm" />
                <Smartphone className="h-48 w-48 animate-float relative z-10" />
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Reviews</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by viewers <span className="text-gradient">and creators</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((r, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Card className="hover-lift border-0 shadow-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}
                    </div>
                    <p className="text-sm mb-4">"{r.text}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={r.avatar} /><AvatarFallback>{r.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium text-sm">{r.name}</div>
                        <Badge variant="secondary" className="text-xs">{r.role}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-muted/20">
        <div className="container max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary mb-6 shadow-glow">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay in the loop</h2>
            <p className="text-muted-foreground text-lg mb-8">Weekly creator tips, platform updates, and earnings inspiration. No spam.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="flex-1 h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              />
              <Button type="submit" size="lg" className="bg-gradient-primary shadow-glow h-12">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">Join 250,000+ creators & viewers already subscribed.</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Frequently asked questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="border rounded-2xl px-6 bg-card shadow-card">
                <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Start Watching", desc: "Discover trending Indian content in your language.", cta: "Watch Now", icon: Play, gradient: "bg-gradient-primary" },
              { title: "Become a Creator", desc: "Upload your first video and start earning today.", cta: "Sign up free", icon: Upload, gradient: "bg-gradient-secondary", to: "/creator/signup" },
            ].map((c) => (
              <Card key={c.title} className={`${c.gradient} border-0 text-primary-foreground overflow-hidden hover-lift`}>
                <CardContent className="p-10">
                  <c.icon className="h-10 w-10 mb-6" />
                  <h3 className="text-3xl font-bold mb-3">{c.title}</h3>
                  <p className="opacity-90 mb-6">{c.desc}</p>
                  <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                    <Link to={c.to ?? "#"}>{c.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}