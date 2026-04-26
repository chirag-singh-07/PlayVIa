import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Video, Upload, BarChart3, IndianRupee, MessageCircle, Users, Settings, Play, Wallet } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const main = [
  { title: "Dashboard", url: "/creator/dashboard", icon: LayoutDashboard },
];
const content = [
  { title: "My Videos", url: "/creator/videos", icon: Video },
  { title: "Upload Video", url: "/creator/upload", icon: Upload },
];
const insights = [
  { title: "Analytics", url: "/creator/analytics", icon: BarChart3 },
  { title: "Earnings", url: "/creator/earnings", icon: IndianRupee },
  { title: "Payouts", url: "/creator/payouts", icon: Wallet },
  { title: "Comments", url: "/creator/comments", icon: MessageCircle },
  { title: "Subscribers", url: "/creator/subscribers", icon: Users },
];
const config = [
  { title: "Settings", url: "/creator/settings", icon: Settings },
];

export const CreatorSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={`${active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-muted"} rounded-xl transition-smooth`}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-5 border-b">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          </div>
          {!collapsed && <div><div className="font-bold leading-tight">PayVia</div><div className="text-xs text-muted-foreground">Studio</div></div>}
        </div>
        {renderGroup("Overview", main)}
        {renderGroup("Content", content)}
        {renderGroup("Insights", insights)}
        {renderGroup("Configuration", config)}
      </SidebarContent>
    </Sidebar>
  );
};