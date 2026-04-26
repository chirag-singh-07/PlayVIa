import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

const GRADIENTS = [
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-purple-500 to-pink-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
];

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const [error, setError] = useState(false);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Deterministic gradient based on name
  const gradientIndex = name
    ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % GRADIENTS.length
    : 0;

  const showFallback = !src || src === "" || src.includes("anonymous-avatar") || error;

  if (!showFallback) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("w-9 h-9 rounded-full object-cover border border-border shadow-sm", className)}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border border-white/10",
        GRADIENTS[gradientIndex],
        className
      )}
    >
      {initials}
    </div>
  );
}
