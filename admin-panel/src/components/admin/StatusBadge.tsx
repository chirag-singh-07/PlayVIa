import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  // video / generic
  Published: "bg-success/10 text-success border-success/20",
  Active: "bg-success/10 text-success border-success/20",
  Completed: "bg-success/10 text-success border-success/20",
  Visible: "bg-success/10 text-success border-success/20",
  Approved: "bg-success/10 text-success border-success/20",
  Paid: "bg-success/10 text-success border-success/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Sent: "bg-success/10 text-success border-success/20",

  Processing: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  Scheduled: "bg-warning/10 text-warning border-warning/20",
  Reported: "bg-warning/10 text-warning border-warning/20",

  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
  Banned: "bg-destructive/10 text-destructive border-destructive/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Spam: "bg-destructive/10 text-destructive border-destructive/20",

  Draft: "bg-muted text-muted-foreground border-border",
  Hidden: "bg-muted text-muted-foreground border-border",
  Dismissed: "bg-muted text-muted-foreground border-border",
  Archived: "bg-muted text-muted-foreground border-border",
  Paused: "bg-muted text-muted-foreground border-border",
  Logout: "bg-muted text-muted-foreground border-border",

  Live: "bg-success/10 text-success border-success/20",
  Beta: "bg-warning/10 text-warning border-warning/20",

  Create: "bg-success/10 text-success border-success/20",
  Edit: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Delete: "bg-destructive/10 text-destructive border-destructive/20",
  Login: "bg-muted text-muted-foreground border-border",

  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = MAP[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap", style, className)}>
      {status}
    </span>
  );
}
