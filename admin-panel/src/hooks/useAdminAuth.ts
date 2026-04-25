import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  ts: number;
}

export function getAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem("playvia-admin-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      email: parsed.email,
      name: parsed.name ?? parsed.email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      role: parsed.role ?? "Super Admin",
      ts: parsed.ts,
    };
  } catch {
    return null;
  }
}

export function useAdminAuth(redirect = true) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => getAdmin());
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin && redirect) navigate("/admin/login", { replace: true });
  }, [admin, redirect, navigate]);

  const logout = () => {
    localStorage.removeItem("playvia-admin-auth");
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  };

  return { admin, logout };
}
