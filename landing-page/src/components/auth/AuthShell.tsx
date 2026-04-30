import { Link } from "react-router-dom";
import { Play, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "viewer" | "creator" | "security";
}

const sideContent = {
  creator: {
    icon: Sparkles,
    eyebrow: "Creator Studio",
    title: "Turn your passion into a paycheck.",
    body: "Join 50,000+ Indian creators publishing on PayVia. Upload, grow, and get paid every Friday.",
    stats: [
      { v: "₹2Cr+", l: "Paid out" },
      { v: "50K+", l: "Creators" },
      { v: "150M+", l: "Daily views" },
    ],
  },
  viewer: {
    icon: TrendingUp,
    eyebrow: "Welcome to PayVia",
    title: "India's home for video, in your language.",
    body: "Stream HD videos, follow your favourite creators, and discover what's trending today.",
    stats: [
      { v: "10M+", l: "Downloads" },
      { v: "12+", l: "Languages" },
      { v: "4.7★", l: "App rating" },
    ],
  },
  security: {
    icon: ShieldCheck,
    eyebrow: "Account security",
    title: "We keep your account safe.",
    body: "Two-factor verification, encrypted sessions, and instant alerts for any new sign-in.",
    stats: [
      { v: "256-bit", l: "Encryption" },
      { v: "24/7", l: "Monitoring" },
      { v: "0", l: "Data sold" },
    ],
  },
};

export const AuthShell = ({ title, subtitle, children, footer, side = "creator" }: AuthShellProps) => {
  const content = sideContent[side];
  const Icon = content.icon;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex bg-gradient-hero p-12 flex-col justify-between text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10 w-fit">
          <div className="h-10 w-10 rounded-xl bg-background/20 backdrop-blur flex items-center justify-center">
            <Play className="h-5 w-5 fill-current" />
          </div>
          <span className="font-bold text-xl">PayVia</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur px-3 py-1 text-xs font-medium mb-6">
            <Icon className="h-3.5 w-3.5" />
            {content.eyebrow}
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">{content.title}</h2>
          <p className="opacity-90 text-lg max-w-md">{content.body}</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {content.stats.map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-bold">{s.v}</div>
              <div className="text-sm opacity-80">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 bg-mesh opacity-50 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl">PayVia</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}

          {children}

          {footer && <div className="mt-8 text-sm text-center text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
};

import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export const SocialAuthRow = ({ onGoogleSuccess }: { onGoogleSuccess?: (token: string) => void }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      if (onGoogleSuccess) onGoogleSuccess(response.access_token);
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleAppleClick = () => {
    toast.info("Apple login coming soon!", {
      description: "We're working hard to bring Apple Sign-In to PayVia Studio.",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => googleLogin()}
        className="h-10 rounded-md border border-input bg-background hover:bg-muted/50 transition-smooth text-sm font-medium flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6L19 3.7C17.1 2 14.7 1 12 1 7.3 1 3.3 3.7 1.4 7.7l3.4 2.6C5.7 7.4 8.6 5 12 5z"/>
          <path fill="#4285F4" d="M23 12c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.3 3.4l3.5 2.7c2.1-1.9 3.3-4.8 3.3-8.3z"/>
          <path fill="#FBBC05" d="M4.8 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.4 7.1C.5 8.6 0 10.3 0 12s.5 3.4 1.4 4.9l3.4-2.6z"/>
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.9 1.1-3.4 0-6.3-2.4-7.2-5.4L1.4 16c1.9 4 5.9 7 10.6 7z"/>
        </svg>
        Google
      </button>
      <button
        type="button"
        onClick={handleAppleClick}
        className="h-10 rounded-md border border-input bg-background hover:bg-muted/50 transition-smooth text-sm font-medium flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M16.4 1.5c0 1.1-.4 2.2-1.2 3-.8.9-2 1.5-3.1 1.4-.1-1.1.4-2.2 1.2-3 .8-.8 2-1.4 3.1-1.4zM20.5 17c-.6 1.4-.9 2-1.7 3.3-1.1 1.7-2.6 3.8-4.5 3.8-1.7 0-2.1-1.1-4.4-1.1-2.3 0-2.8 1.1-4.5 1.1-1.9 0-3.4-1.9-4.5-3.6C-1.4 16.4-1.7 10 1.4 6.6 3.6 4.2 7.1 3.4 9.7 5.4c.9-.3 2-.7 3.4-.7 1.7 0 2.7.5 3.6.9 2.7-1.5 6 .3 6.3 4.6-.6.4-3 1.7-2.5 6.8z"/>
        </svg>
        Apple
      </button>
    </div>
  );
};

export const Divider = ({ children = "or continue with" }: { children?: string }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    <div className="relative flex justify-center">
      <span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">{children}</span>
    </div>
  </div>
);