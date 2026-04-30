import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Video, IndianRupee, Flag, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/payouts", label: "Payouts", icon: IndianRupee },
  { to: "/admin/reports", label: "Reports", icon: Flag },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 hidden md:flex flex-col bg-card border-r">
        <div className="p-5 border-b flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-glow"><Shield className="h-4 w-4 text-primary-foreground" /></div>
          <div><div className="font-bold leading-tight">PayVia</div><div className="text-xs text-muted-foreground">Admin</div></div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => {
            const active = loc.pathname === it.to;
            return (
              <NavLink key={it.to} to={it.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${active ? "bg-gradient-secondary text-primary-foreground shadow-glow" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                <it.icon className="h-4 w-4" /> {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t flex items-center gap-3">
          <Avatar><AvatarFallback>{user?.name?.[0] ?? "A"}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{user?.name}</div><div className="text-xs text-muted-foreground truncate">{user?.email}</div></div>
          <Button size="icon" variant="ghost" onClick={() => { logout(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>
        </div>
      </aside>
      <main className="flex-1 p-6 animate-fade-in min-w-0"><Outlet /></main>
    </div>
  );
};