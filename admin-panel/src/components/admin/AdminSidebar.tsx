import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Film, FolderTree, MessageSquare, Flag,
  Users, Star, UserX, IndianRupee, Wallet, Megaphone,
  Smartphone, Bell, Image as ImageIcon, Settings, ShieldCheck, ScrollText,
  ChevronLeft, LogOut, Play, HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const SECTIONS = [
  { label: "Overview", items: [{ to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" }] },
  {
    label: "Content",
    items: [
      { to: "/admin/videos", icon: Film, label: "Videos" },
      { to: "/admin/categories", icon: FolderTree, label: "Categories" },
      { to: "/admin/comments", icon: MessageSquare, label: "Comments" },
      { to: "/admin/reports", icon: Flag, label: "Reports", badge: 12 },
    ],
  },
  {
    label: "Users",
    items: [
      { to: "/admin/users", icon: Users, label: "All Users" },
      { to: "/admin/creators", icon: Star, label: "Creators" },
      { to: "/admin/banned", icon: UserX, label: "Banned Users" },
    ],
  },
  {
    label: "Monetization",
    items: [
      { to: "/admin/revenue", icon: IndianRupee, label: "Revenue" },
      { to: "/admin/withdrawals", icon: Wallet, label: "Withdrawals", badge: 4 },
      { to: "/admin/ads", icon: Megaphone, label: "Ad Management" },
    ],
  },
  {
    label: "App Management",
    items: [
      { to: "/admin/app-versions", icon: Smartphone, label: "App Versions" },
      { to: "/admin/notifications", icon: Bell, label: "Notifications" },
      { to: "/admin/banners", icon: ImageIcon, label: "Banners" },
      { to: "/admin/storage", icon: HardDrive, label: "Storage & Quotas" },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/settings", icon: Settings, label: "General" },
      { to: "/admin/admins", icon: ShieldCheck, label: "Admin Users" },
      { to: "/admin/logs", icon: ScrollText, label: "Activity Logs" },
    ],
  },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed, onToggle, mobile = false, onNavigate }: Props) {
  const { admin, logout } = useAdminAuth(false);
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        mobile ? "w-72" : collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2 min-w-0" onClick={onNavigate}>
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand shrink-0">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
          {!collapsed && (
            <div className="font-extrabold text-lg tracking-tight truncate">
              Play<span className="text-gradient-brand">Via</span>
            </div>
          )}
        </NavLink>
        {!mobile && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 shrink-0" aria-label="Toggle sidebar">
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* Admin profile */}
      {admin && (
        <div className={cn("px-3 py-4 border-b border-sidebar-border", collapsed && !mobile && "px-2")}>
          <div className={cn("flex items-center gap-3", collapsed && !mobile && "justify-center")}>
            <div className="w-9 h-9 rounded-full bg-gradient-brand text-white font-bold flex items-center justify-center shrink-0">
              {admin.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            {(!collapsed || mobile) && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{admin.name}</div>
                <div className="text-xs text-muted-foreground truncate">{admin.role}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            {(!collapsed || mobile) && (
              <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && !mobile && "justify-center px-2"
                    )}
                    title={collapsed && !mobile ? item.label : undefined}
                  >
                    <item.icon className={cn("w-[18px] h-[18px] shrink-0", active && "text-primary")} />
                    {(!collapsed || mobile) && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {"badge" in item && item.badge && (
                          <span className="px-1.5 min-w-[20px] h-5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn("w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10", collapsed && !mobile && "justify-center px-2")}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span className="ml-2">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
