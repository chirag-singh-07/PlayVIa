import { Link } from "react-router-dom";
import { Play, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export const Footer = () => (
  <footer className="border-t bg-muted/30">
    <div className="container py-16 grid md:grid-cols-5 gap-10">
      <div>
        <Link to="/" className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center"><Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" /></div>
          <span className="font-bold text-lg">PayVia</span>
        </Link>
        <p className="text-sm text-muted-foreground">India's own video streaming and creator platform.</p>
        <div className="flex gap-3 mt-4">
          {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="h-9 w-9 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"><Icon className="h-4 w-4" /></a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#features" className="hover:text-foreground">Features</a></li>
          <li><a href="#earnings" className="hover:text-foreground">Creator Earnings</a></li>
          <li><Link to="/creator/signup" className="hover:text-foreground">Become a Creator</Link></li>
          <li><Link to="/admin/login" className="hover:text-foreground">Admin</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
          <li><Link to="/monetization" className="hover:text-foreground">Monetization Policy</Link></li>
          <li><Link to="/creator-agreement" className="hover:text-foreground">Creator Agreement</Link></li>
          <li><Link to="/copyright" className="hover:text-foreground">Copyright / DMCA</Link></li>
          <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
          <li><Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
          <li><Link to="/refund" className="hover:text-foreground">Refund Policy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Safety</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/community-guidelines" className="hover:text-foreground">Community Guidelines</Link></li>
          <li><Link to="/trust-safety" className="hover:text-foreground">Trust &amp; Safety</Link></li>
          <li><Link to="/acceptable-use" className="hover:text-foreground">Acceptable Use</Link></li>
          <li><Link to="/accessibility" className="hover:text-foreground">Accessibility</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">About</a></li>
          <li><a href="#" className="hover:text-foreground">Careers</a></li>
          <li><a href="#" className="hover:text-foreground">Press</a></li>
          <li><a href="#" className="hover:text-foreground">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} PayVia. Made with ❤️ in India.
    </div>
  </footer>
);