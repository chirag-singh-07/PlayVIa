import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreatorSidebar } from "./CreatorSidebar";
import { CreatorHeader } from "./CreatorHeader";

export const CreatorLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-muted/30">
      <CreatorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CreatorHeader />
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);