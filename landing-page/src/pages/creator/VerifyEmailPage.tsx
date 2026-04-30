import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthShell } from "@/components/auth/AuthShell";
import { verifyOtp, resendOtp, login } from "@/lib/auth";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const verify = async (value: string) => {
    if (value.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(email, value);
      toast.success("Email verified successfully!");
      navigate("/creator/login");
    } catch (error: any) {
      setError(error.message || "Invalid OTP");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (v: string) => {
    setCode(v);
    if (v.length === 6) verify(v);
  };

  const resend = async () => {
    setLoading(true);
    try {
      await resendOtp(email);
      setResendIn(30);
      toast.success("New code sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };



  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}. Enter it below to activate your account.`
          : "Enter the 6-digit code we just sent to your inbox."
      }
      side="security"
      footer={
        <Link to="/creator/signup" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Use a different email
        </Link>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow mb-6">
          <MailCheck className="h-7 w-7 text-primary-foreground" />
        </div>

        <InputOTP maxLength={6} value={code} onChange={onChange} disabled={loading}>
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="!h-14 !w-12 !rounded-lg !border-l text-xl font-semibold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && <p className="text-sm text-destructive mt-3">{error}</p>}

        <div className="mt-6 w-full">
          <Button
            onClick={() => verify(code)}
            disabled={loading || code.length !== 6}
            className="w-full bg-gradient-primary shadow-glow hover:shadow-elegant transition-smooth h-11"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...</>
            ) : (
              <><ShieldCheck className="h-4 w-4 mr-2" /> Verify email</>
            )}
          </Button>
        </div>

        <div className="mt-5 text-sm text-muted-foreground">
          Didn't get the code?{" "}
          {resendIn > 0 ? (
            <span>Resend in <span className="font-medium text-foreground">{resendIn}s</span></span>
          ) : (
            <button onClick={resend} className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" /> Resend code
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Tip: any 6-digit code works in this demo (except <code className="font-mono">000000</code>).
        </p>
      </div>
    </AuthShell>
  );
}