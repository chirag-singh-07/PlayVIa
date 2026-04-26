import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/AuthShell";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const schema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(100)
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const form = useForm<FormValues>({ 
    resolver: zodResolver(schema), 
    defaultValues: { otp: "", password: "", confirm: "" } 
  });
  const pwd = form.watch("password");

  const checks = useMemo(
    () => [
      { ok: (pwd || "").length >= 8, label: "At least 8 characters" },
      { ok: /[A-Z]/.test(pwd || ""), label: "One uppercase letter" },
      { ok: /[0-9]/.test(pwd || ""), label: "One number" },
      { ok: /[^A-Za-z0-9]/.test(pwd || ""), label: "One special character (recommended)" },
    ],
    [pwd],
  );

  const onSubmit = async (data: FormValues) => {
    if (!email) {
      toast.error("Missing email address");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, data.otp, data.password);
      setDone(true);
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Password updated" subtitle="Your new password is ready. Sign in to continue." side="security">
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center mb-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">You can now use your new password to access PayVia Studio.</p>
        </div>
        <Button onClick={() => navigate("/creator/login")} className="w-full bg-gradient-primary shadow-glow h-11">
          Continue to sign in
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle={email ? `Enter the code sent to ${email} and your new password.` : "Set a new password for your account."}
      side="security"
      footer={<Link to="/creator/login" className="text-primary font-semibold hover:underline">Back to sign in</Link>}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex justify-center py-2">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} className="!h-12 !w-10 !rounded-lg !border text-lg font-semibold" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type={show ? "text" : "password"} className="pl-9 pr-10" placeholder="••••••••" {...field} />
                      <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type={show ? "text" : "password"} className="pl-9" placeholder="••••••••" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className={`h-3.5 w-3.5 ${c.ok ? "text-success" : "text-muted-foreground/50"}`} />
                <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-glow hover:shadow-elegant transition-smooth h-11">
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
            ) : (
              <><ShieldCheck className="h-4 w-4 mr-2" /> Update password</>
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}