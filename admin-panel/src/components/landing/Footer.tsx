import { Link } from "react-router-dom";
import { Heart, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press Kit", to: "/about#press" },
      { label: "Blog", to: "/about#blog" },
      { label: "Contact", to: "/#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Cookie Policy", to: "/cookies" },
      { label: "Community Guidelines", to: "/community-guidelines" },
      { label: "DMCA Policy", to: "/dmca" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/#contact" },
      { label: "Report a Bug", to: "/#contact" },
      { label: "Feature Request", to: "/#contact" },
      { label: "Creator Support", to: "/#contact" },
      { label: "Advertise with Us", to: "/advertise" },
    ],
  },
];

const SOCIALS = [Instagram, Twitter, Youtube, Linkedin];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="[&_span]:text-background">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-background/70 max-w-xs leading-relaxed">
              India's #1 video streaming app. Watch, upload &amp; share videos in your language — free forever.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs text-background/60 flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 fill-primary text-primary" /> in India
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-background/60">
            © {new Date().getFullYear()} PlayVia. All rights reserved.
          </div>
          <Link to="/admin/login" className="text-xs text-background/40 hover:text-background/80 transition-colors">
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
