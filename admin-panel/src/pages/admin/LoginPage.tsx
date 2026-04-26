import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, ShieldCheck, Loader2, Zap, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/landing/Logo";
import { toast } from "sonner";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

const FEATURES = [
  { Icon: Activity, title: "Real-time analytics", desc: "Track views, revenue, and engagement live." },
  { Icon: Users, title: "Manage 10M+ users", desc: "Approve, ban, and review at scale." },
  { Icon: Zap, title: "Lightning fast", desc: "Built for speed with bulk actions." },
];

export default function AdminLoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data.role !== "admin") {
        toast.error("You are not authorized to access the admin portal.");
        setLoading(false);
        return;
      }

      localStorage.setItem("playvia-admin-auth", JSON.stringify({ ...response.data, ts: Date.now() }));
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-brand text-white p-12 flex-col justify-between">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(0 0% 100% / 0.4) 0, transparent 40%), radial-gradient(circle at 80% 80%, hsl(0 0% 0% / 0.3) 0, transparent 40%)",
          }}
        />
        <div className="relative">
          <div className="[&_span]:text-white [&_div]:bg-white/20 [&_div]:shadow-none">
            <Logo />
          </div>
          <h1 className="mt-16 text-4xl xl:text-5xl font-extrabold leading-tight">Admin Dashboard</h1>
          <p className="mt-4 text-white/90 text-lg max-w-md">
            Manage videos, users, revenue, and the whole PlayVia ecosystem from one place.
          </p>

          <div className="mt-12 space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <f.Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-white/80">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold w-fit">
          <ShieldCheck className="w-4 h-4" /> Secure Admin Access
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16 bg-background">
        <div className="lg:hidden mb-8">
          <Logo />
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Admin Portal</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome Back, Admin</h2>
          <p className="mt-2 text-muted-foreground">Sign in to access the PlayVia control panel.</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@playvia.app" className="pl-10" {...form.register("email")} />
              </div>
              {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked onCheckedChange={(v) => form.setValue("remember", !!v)} />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full h-12 bg-gradient-brand text-white border-0 shadow-brand hover:opacity-90">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </Button>

            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure connection</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Protected by 2FA</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Rate-limited for security. 5 attempts per minute.
            </p>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            PlayVia Admin v2.1.0 ·{" "}
            <Link to="/" className="text-primary hover:underline">Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
