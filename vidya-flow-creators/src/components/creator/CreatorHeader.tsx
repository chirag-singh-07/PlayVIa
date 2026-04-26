import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";

export const CreatorHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="h-16 border-b glass sticky top-0 z-40 flex items-center px-4 gap-3">
      <SidebarTrigger />
      <div className="hidden md:flex items-center max-w-md flex-1 relative">
        <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input placeholder="Search videos, comments..." className="pl-9 bg-muted/50 border-0" />
      </div>
      <div className="flex-1 md:hidden" />
      <Button asChild size="sm" className="bg-gradient-primary shadow-glow hidden sm:flex">
        <Link to="/creator/upload"><Upload className="h-4 w-4 mr-2" />Upload</Link>
      </Button>
      <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20"><AvatarImage src={user?.avatar} /><AvatarFallback>{user?.name[0]}</AvatarFallback></Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel><div className="font-medium">{user?.name}</div><div className="text-xs text-muted-foreground font-normal">{user?.email}</div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/creator/settings")}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}><LogOut className="h-4 w-4 mr-2" />Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};