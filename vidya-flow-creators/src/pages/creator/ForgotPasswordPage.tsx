import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/AuthShell";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setSent(data.email);
      toast.success("Reset OTP sent! Check your inbox.");
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        navigate(`/creator/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };


  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We've sent a password reset link to ${sent}. The link expires in 30 minutes.`}
        side="security"
        footer={
          <Link to="/creator/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        }
      >
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Didn't get the email? Check your spam folder, or
          </p>
          <button
            onClick={() => setSent(null)}
            className="text-sm text-primary font-medium hover:underline mt-1"
          >
            try a different email
          </button>
        </div>
        <Button
          onClick={() => navigate("/creator/reset-password?token=demo")}
          variant="outline"
          className="w-full mt-4"
        >
          Open reset link (demo)
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="No worries — enter your email and we'll send you a reset link."
      side="security"
      footer={
        <Link to="/creator/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary shadow-glow hover:shadow-elegant transition-smooth h-11"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending link...</>
            ) : (
              <><Send className="h-4 w-4 mr-2" /> Send reset link</>
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}