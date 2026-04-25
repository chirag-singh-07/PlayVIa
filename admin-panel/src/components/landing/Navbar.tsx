import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/ThemeProvider";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "/about", external: true },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLink = (l: typeof NAV_LINKS[number]) => {
    if (l.external || !onLanding) {
      return (
        <Link
          key={l.label}
          to={l.external ? l.href : `/${l.href}`}
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {l.label}
        </Link>
      );
    }
    return (
      <a key={l.label} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        {l.label}
      </a>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-card" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-18">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(renderLink)}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button asChild className="hidden sm:inline-flex bg-gradient-brand hover:opacity-90 shadow-brand text-white border-0">
            <a href="#download">
              <Download className="w-4 h-4 mr-2" /> Download App
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => {
                  const Cmp: any = l.external ? Link : "a";
                  const props = l.external ? { to: l.href } : { href: l.href };
                  return (
                    <Cmp
                      key={l.label}
                      {...props}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                    >
                      {l.label}
                    </Cmp>
                  );
                })}
              </div>
              <Button asChild className="mt-6 bg-gradient-brand text-white border-0">
                <a href="#download" onClick={() => setOpen(false)}>
                  <Download className="w-4 h-4 mr-2" /> Download App
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
