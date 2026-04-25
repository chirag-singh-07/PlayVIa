import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, SortingState, useReactTable,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Search, Download, MoreHorizontal, Eye, Edit, Ban, Trash2,
  ChevronLeft, ChevronRight, ArrowUpDown, BadgeCheck, Mail, Phone, MapPin, Users, UserPlus, UserX, Star, Loader2,
} from "lucide-react";
import { generateUsers, fmtDate, USER_STATUSES, type AdminUserRecord } from "@/lib/adminMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";



export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [rowSelection, setRowSelection] = useState({});
  const [active, setActive] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (id: string) => {
    try {
      await adminService.toggleUserBan(id);
      toast.success("User status updated");
      fetchUsers();
      if (active && active._id === id) setActive(null);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const data = useMemo(() => users.filter((u) => {
    const q = search.trim().toLowerCase();
    const passQ = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const status = u.isBanned ? "Banned" : "Active";
    const passS = statusFilter === "all" || status === statusFilter;
    const passR = roleFilter === "all" || u.role === roleFilter;
    return passQ && passS && passR;
  }), [users, search, statusFilter, roleFilter]);


  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: "select", header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} aria-label="Select all" />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} onClick={(e) => e.stopPropagation()} aria-label="Select" />
      ), enableSorting: false,
    },
    {
      accessorKey: "username", header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <img src={row.original.avatar} className="w-9 h-9 rounded-full shrink-0" alt="" />
          <div className="min-w-0">
            <div className="font-medium flex items-center gap-1.5">
              <span className="truncate">{row.original.username}</span>
              {row.original.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
            </div>
            <div className="text-xs text-muted-foreground truncate">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: "email", header: "Email", cell: (info) => <span className="text-sm">{info.getValue<string>()}</span> },
    {
      accessorKey: "role", header: "Role",
      cell: (info) => {
        const r = info.getValue<string>();
        const c = r === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";
        return <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase", c)}>{r}</span>;
      },
    },
    {
      accessorKey: "createdAt", header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-foreground">
          Joined <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: (info) => <span className="text-sm text-muted-foreground tabular-nums">{fmtDate(info.getValue<string>())}</span>,
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.isBanned ? "Banned" : "Active"} /> },
    {
      id: "actions", header: "", enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActive(row.original)}><Eye className="w-4 h-4 mr-2" /> View Profile</DropdownMenuItem>
            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-warning focus:text-warning"
              onClick={(e) => {
                e.stopPropagation();
                handleBan(row.original._id);
              }}
            >
              <Ban className="w-4 h-4 mr-2" /> {row.original.isBanned ? "Unban" : "Ban"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [users]);

  const table = useReactTable({
    data, columns, state: { sorting, rowSelection },
    onSortingChange: setSorting, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  const selected = Object.keys(rowSelection).length;

  const stats = [
    { Icon: Users, label: "Total Users", value: users.length, color: "text-primary", bg: "bg-primary/10" },
    { Icon: UserPlus, label: "Verified", value: users.filter(u => u.isVerified).length, color: "text-success", bg: "bg-success/10" },
    { Icon: UserX, label: "Banned", value: users.filter(u => u.isBanned).length, color: "text-destructive", bg: "bg-destructive/10" },
    { Icon: Star, label: "Admins", value: users.filter(u => u.role === "admin").length, color: "text-warning", bg: "bg-warning/10" },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1600px]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight">All Users</h2>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{users.length}</span>
        </div>
        <Button variant="outline" onClick={() => toast.success("CSV exported (mock)")}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", s.bg)}>
              <s.Icon className={cn("w-5 h-5", s.color)} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-lg font-bold tabular-nums">{s.value.toLocaleString("en-IN")}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="md:w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Creator">Creator</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {USER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {selected > 0 && (
          <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm font-medium">{selected} selected</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Banned")}>Ban</Button>
              <Button size="sm" variant="outline" className="text-destructive" onClick={() => toast.success("Deleted")}>Delete</Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">No users match your filters.</td></tr>
              ) : table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setActive(row.original)}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * 25 + 1}–
            {Math.min((table.getState().pagination.pageIndex + 1) * 25, data.length)} of {data.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-3 text-sm font-medium tabular-nums">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* User detail drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="text-left">User Profile</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <img src={active.avatar} className="w-16 h-16 rounded-full shrink-0" alt="" />
                  <div className="min-w-0">
                    <div className="text-xl font-bold flex items-center gap-2 truncate">
                      {active.username}
                      {active.isVerified && <BadgeCheck className="w-5 h-5 text-primary shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={active.isBanned ? "Banned" : "Active"} />
                      <span className="text-xs text-muted-foreground uppercase">{active.role}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {active.email}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Joined</div>
                    <div className="text-sm font-bold tabular-nums mt-0.5">{fmtDate(active.createdAt)}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">User ID</div>
                    <div className="text-sm font-mono mt-0.5 truncate">{active._id}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-warning hover:text-warning"
                    onClick={() => handleBan(active._id)}
                  >
                    <Ban className="w-4 h-4 mr-2" /> {active.isBanned ? "Unban" : "Ban"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
