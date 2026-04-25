import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getAdmin } from "@/hooks/useAdminAuth";

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const admin = getAdmin();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!admin) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;

  return (
    <div className="min-h-screen flex bg-muted/40 dark:bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AdminSidebar collapsed={false} onToggle={() => {}} mobile onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
