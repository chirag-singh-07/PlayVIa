import { Navigate } from "react-router-dom";

export default function AdminPlaceholder({ title }: { title: string }) {
  // Phase 1 stub — full admin dashboard ships in next phase.
  const isAuthed = !!localStorage.getItem("playvia-admin-auth");
  if (!isAuthed) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center">
        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Coming in Phase 2</div>
        <h1 className="text-3xl font-extrabold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-6">
          You're signed in. The full admin dashboard — tables, charts, moderation, and revenue tools —
          is being built in the next phase.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("playvia-admin-auth");
              window.location.href = "/admin/login";
            }}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium"
          >
            Sign out
          </button>
          <a href="/" className="px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-medium shadow-brand">
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
