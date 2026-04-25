import { Link, useLocation } from "react-router-dom";
import { Bell, Search, Moon, Sun, Menu, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/videos": "Videos",
  "/admin/categories": "Categories",
  "/admin/comments": "Comments",
  "/admin/reports": "Reports",
  "/admin/users": "All Users",
  "/admin/creators": "Creators",
  "/admin/banned": "Banned Users",
  "/admin/revenue": "Revenue",
  "/admin/withdrawals": "Withdrawals",
  "/admin/ads": "Ad Management",
  "/admin/app-versions": "App Versions",
  "/admin/notifications": "Push Notifications",
  "/admin/banners": "Banners",
  "/admin/settings": "General Settings",
  "/admin/admins": "Admin Users",
  "/admin/logs": "Activity Logs",
  "/admin/profile": "My Profile",
  "/admin/inbox": "Inbox",
};

interface Props {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: Props) {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { admin, logout } = useAdminAuth(false);
  const title = TITLES[pathname] ?? "Admin";

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 md:px-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Link to="/admin/dashboard" className="hover:text-foreground">Admin</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium truncate">{title}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight truncate">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search anything..." className="pl-9 w-56 lg:w-72 bg-muted border-transparent focus-visible:bg-background" />
          </div>

          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Inbox">
            <Link to="/admin/inbox">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                7
              </span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-gradient-brand text-white text-sm font-bold flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
                {admin?.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "A"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{admin?.name}</div>
                <div className="text-xs text-muted-foreground font-normal">{admin?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile"><User className="w-4 h-4 mr-2" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings"><Settings className="w-4 h-4 mr-2" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
