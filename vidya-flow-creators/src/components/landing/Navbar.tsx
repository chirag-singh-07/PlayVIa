import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "#features", label: "Features" },
  { to: "#earnings", label: "Earnings" },
  { to: "#stories", label: "Creators" },
  { to: "#faq", label: "FAQ" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${scrolled ? "glass shadow-card" : "bg-transparent"}`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-bold text-lg">PayVia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth story-link">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost"><Link to="/creator/login">Sign in</Link></Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
            <Link to="/creator/signup">Start Creating</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {links.map((l) => (
                <a key={l.to} href={l.to} className="text-base font-medium">{l.label}</a>
              ))}
              <Button asChild variant="outline"><Link to="/creator/login">Sign in</Link></Button>
              <Button asChild className="bg-gradient-primary"><Link to="/creator/signup">Start Creating</Link></Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};