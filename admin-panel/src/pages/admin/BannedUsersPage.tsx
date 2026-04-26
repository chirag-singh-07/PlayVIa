import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDate } from "@/lib/adminMock";
import { Search, Undo2, Clock, UserX, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";
import { UserAvatar } from "@/components/admin/UserAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BannedUsersPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setList(data.filter((u: any) => u.isBanned));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnban = async (id: string) => {
    try {
      await adminService.toggleUserBan(id);
      toast.success("User unbanned");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unban user");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = useMemo(() => list.filter((b) => !q || `${b.username} ${b.email}`.toLowerCase().includes(q.toLowerCase())), [list, q]);

  if (loading && list.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banned Users</h1>
        <p className="text-sm text-muted-foreground">{list.length} accounts under enforcement</p>
      </div>

      <Card className="p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="hidden md:table-cell">Banned On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar src={b.avatar} name={b.username} />
                    <div>
                      <div className="font-medium">{b.username}</div>
                      <div className="text-xs text-muted-foreground">{b.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">Violation of terms</TableCell>
                <TableCell><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">Permanent</span></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{fmtDate(b.updatedAt)}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => handleUnban(b._id)}><Undo2 className="w-4 h-4 mr-1" />Unban</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(b._id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />No banned users
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This account is already banned, but deleting it
              will permanently remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
