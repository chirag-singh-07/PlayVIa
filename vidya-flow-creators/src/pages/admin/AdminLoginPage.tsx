import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error("Fill all fields");
    
    setLoading(true);
    try {
      const user = await login(email, pwd);
      if (user.role !== 'admin') {
        toast.error("Unauthorized access. Admin only.");
        return;
      }
      toast.success("Welcome, admin");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4">
      <Card className="w-full max-w-md glass shadow-elegant border-0">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-glow"><Shield className="h-5 w-5 text-primary-foreground" /></div>
            <span className="font-bold text-xl">Admin Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Sign in to admin</h1>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@viralindia.com" /></div>
            <div><Label>Password</Label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-secondary shadow-glow">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">Not an admin? <Link to="/" className="text-primary hover:underline">Back to home</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}