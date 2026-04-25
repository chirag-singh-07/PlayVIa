import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand transition-transform group-hover:scale-105">
        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
      </div>
      <span className="text-xl font-extrabold tracking-tight">
        Play<span className="text-gradient-brand">Via</span>
      </span>
    </Link>
  );
}
