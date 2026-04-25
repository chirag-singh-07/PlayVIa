import { LegalLayout } from "@/components/landing/LegalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const TEAM = [
  { name: "Aditya Mehta", role: "Founder & CEO", color: "bg-red-500" },
  { name: "Kavya Nair", role: "CTO", color: "bg-blue-500" },
  { name: "Rohan Singh", role: "Head of Design", color: "bg-purple-500" },
  { name: "Meera Iyer", role: "Head of Content", color: "bg-emerald-500" },
];

const VALUES = [
  { Icon: Target, title: "Made for India", desc: "Every feature designed with Indian users, languages, and networks in mind." },
  { Icon: Heart, title: "Creator First", desc: "We empower regional creators with tools and fair monetization." },
  { Icon: Users, title: "Community Driven", desc: "Our 10M+ users shape the product through constant feedback." },
  { Icon: Shield, title: "Privacy Always", desc: "We never sell your data. Your content, your control." },
];

const TIMELINE = [
  { year: "2021", title: "Founded in Mumbai", desc: "Started with a simple mission: a video app built for Bharat." },
  { year: "2022", title: "1 Million Downloads", desc: "Crossed our first major milestone in just 8 months." },
  { year: "2023", title: "Creator Monetization", desc: "Launched the creator program; ₹2 crore paid out in year one." },
  { year: "2024", title: "10M+ Users", desc: "Became one of India's top homegrown streaming platforms." },
  { year: "2025", title: "iOS & Web", desc: "Expanding beyond Android to bring PlayVia everywhere." },
];

export default function AboutPage() {
  return (
    <LegalLayout
      title="About PlayVia"
      subtitle="We're building India's most-loved video platform — from Mumbai, with love."
    >
      <h2>Our Story</h2>
      <p>
        PlayVia started in 2021 with a simple observation: India's 600+ million internet users deserved a video
        platform built for <em>them</em> — their languages, their networks, their stories. Existing global apps
        treated India as an afterthought. We set out to change that.
      </p>
      <p>
        Today, PlayVia is a home to creators across 12+ Indian languages, watched by over 10 million people every
        month. We're proudly bootstrapped, profitable, and 100% based in India.
      </p>

      <h2 className="mt-12">Our Mission</h2>
      <blockquote className="border-l-4 border-primary pl-5 my-6 italic text-xl text-foreground/90">
        "To give every Indian a voice and every viewer a window into the rich diversity of our country."
      </blockquote>

      <h2 className="mt-12 mb-6">Our Values</h2>
      <div className="grid sm:grid-cols-2 gap-4 not-prose">
        {VALUES.map((v) => (
          <Card key={v.title} className="p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <v.Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold mb-1">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 mb-6">Our Journey</h2>
      <div className="not-prose space-y-4">
        {TIMELINE.map((t) => (
          <div key={t.year} className="flex gap-4 md:gap-6">
            <div className="shrink-0 w-16 md:w-20">
              <div className="text-xl md:text-2xl font-extrabold text-gradient-brand">{t.year}</div>
            </div>
            <div className="flex-1 border-l-2 border-border pl-5 pb-5">
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-6">Meet the Team</h2>
      <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4">
        {TEAM.map((m) => (
          <Card key={m.name} className="p-5 text-center">
            <div className={`w-16 h-16 rounded-full ${m.color} text-white text-xl font-bold flex items-center justify-center mx-auto mb-3`}>
              {m.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="font-semibold text-sm">{m.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.role}</div>
          </Card>
        ))}
      </div>

      <div className="not-prose mt-12 rounded-2xl p-8 text-center bg-gradient-brand text-white">
        <h3 className="text-2xl font-extrabold">Want to join us?</h3>
        <p className="mt-2 text-white/90">We're hiring across engineering, design, and content.</p>
        <Button asChild size="lg" variant="outline" className="mt-5 bg-white text-primary border-white hover:bg-white/90">
          <Link to="/careers">See Open Roles <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </div>
    </LegalLayout>
  );
}
