import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search, Download, MoreHorizontal, Eye, Edit, Star, Ban, Trash2,
  ChevronLeft, ChevronRight, ArrowUpDown, Eye as EyeIcon, Heart, MessageCircle, Share2,
  Loader2, Upload, Plus,
} from "lucide-react";
import { fmtCompact, fmtDate, VIDEO_STATUSES, CATEGORIES } from "@/lib/adminMock";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VideosPage() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [rowSelection, setRowSelection] = useState({});
  const [active, setActive] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "General",
    videoType: "video",
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: adminService.getAllVideos,
  });

  const uploadMutation = useMutation({
    mutationFn: adminService.uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video uploaded successfully");
      setShowUpload(false);
      setUploadData({ title: "", description: "", category: "General", videoType: "video", videoFile: null, thumbnailFile: null });
    },
    onError: () => toast.error("Upload failed")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video deleted");
      setActive(null);
      setDeleteConfirm(null);
    },
    onError: () => toast.error("Failed to delete video")
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.videoFile) {
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("category", uploadData.category);
    formData.append("videoType", uploadData.videoType);
    if (uploadData.videoFile) formData.append("video", uploadData.videoFile);
    if (uploadData.thumbnailFile) formData.append("thumbnail", uploadData.thumbnailFile);

    uploadMutation.mutate(formData);
  };

  const filteredData = useMemo(() => {
    return videos.filter((v: any) => {
      const q = search.trim().toLowerCase();
      const passQ = !q || v.title.toLowerCase().includes(q) || v.channel?.name.toLowerCase().includes(q);
      const status = v.isPublished ? "Active" : "Draft";
      const passS = statusFilter === "all" || status === statusFilter;
      const passC = categoryFilter === "all" || v.category === categoryFilter;
      return passQ && passS && passC;
    });
  }, [videos, search, statusFilter, categoryFilter]);


  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: "select", header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} onClick={(e) => e.stopPropagation()} aria-label="Select row" />
      ), enableSorting: false,
    },
    {
      accessorKey: "title", header: "Video",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <img src={row.original.thumbnailUrl || row.original.thumbnail} className="w-20 h-12 rounded object-cover shrink-0" alt="" />
          <div className="min-w-0">
            <div className="font-medium truncate max-w-[280px]">{row.original.title}</div>
            <div className="text-xs text-muted-foreground truncate">{row.original._id}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "channel.name", header: "Creator",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar src={row.original.channel?.avatar} name={row.original.channel?.name} className="w-7 h-7 text-[10px]" />
          <span className="text-sm">{row.original.channel?.name || "Unknown"}</span>
        </div>
      )
    },
    { accessorKey: "category", header: "Category", cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue<string>()}</span> },
    {
      accessorKey: "views", header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-foreground">
          Views <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: (info) => <span className="font-medium tabular-nums">{fmtCompact(info.getValue<number>())}</span>,
    },
    {
      accessorKey: "likes", header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-foreground">
          Likes <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: (info) => <span className="tabular-nums text-muted-foreground">{fmtCompact(info.getValue<any>()?.length || 0)}</span>,
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.isPublished ? "Active" : "Draft"} /> },
    {
      accessorKey: "createdAt", header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-foreground">
          Uploaded <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: (info) => <span className="text-sm text-muted-foreground tabular-nums">{fmtDate(info.getValue<string>())}</span>,
    },
    {
      id: "actions", header: "", enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActive(row.original)}><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
            <DropdownMenuItem><Star className="w-4 h-4 mr-2" /> Feature</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-warning focus:text-warning"><Ban className="w-4 h-4 mr-2" /> Suspend</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirm(row.original._id);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData, columns, state: { sorting, rowSelection },
    onSortingChange: setSorting, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  if (isLoading) {
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
          <h2 className="text-2xl font-extrabold tracking-tight">Manage Videos</h2>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{videos.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success("CSV exported (mock)")}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => setShowUpload(true)}>
            <Plus className="w-4 h-4 mr-2" /> Upload Video
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by title or creator..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {VIDEO_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">No videos match your filters.</td></tr>
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
            {Math.min((table.getState().pagination.pageIndex + 1) * 25, filteredData.length)} of {filteredData.length}
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

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">Video Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="aspect-video rounded-xl bg-black relative overflow-hidden group">
                  <video 
                    src={active.videoUrl} 
                    poster={active.thumbnailUrl || active.thumbnail}
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{active.title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">by {active.channel?.name || "Unknown"} • {active.category}</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><EyeIcon className="w-3.5 h-3.5" /> Views</div>
                    <div className="text-lg font-bold tabular-nums mt-1">{fmtCompact(active.views)}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Heart className="w-3.5 h-3.5" /> Likes</div>
                    <div className="text-lg font-bold tabular-nums mt-1">{fmtCompact(active.likes?.length || 0)}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageCircle className="w-3.5 h-3.5" /> Comments</div>
                    <div className="text-lg font-bold tabular-nums mt-1">0</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <UserAvatar src={active.channel?.owner?.avatar} name={active.channel?.owner?.username} />
                  <div>
                    <div className="font-medium">{active.channel?.owner?.username || "Unknown Creator"}</div>
                    <div className="text-xs text-muted-foreground">{active.channel?.owner?.email || "No email"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-muted-foreground">Status</div><div className="mt-1"><StatusBadge status={active.isPublished ? "Active" : "Draft"} /></div></div>
                  <div><div className="text-xs text-muted-foreground">Uploaded</div><div className="mt-1 font-medium tabular-nums">{fmtDate(active.createdAt)}</div></div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                  <Button variant="outline" size="sm"><Star className="w-4 h-4 mr-2" /> Feature</Button>
                  <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                  <Button variant="outline" size="sm" className="text-warning hover:text-warning"><Ban className="w-4 h-4 mr-2" /> Suspend</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirm(active._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpload}>
            <DialogHeader>
              <DialogTitle>Upload New Video</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={uploadData.category} onValueChange={v => setUploadData({...uploadData, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={uploadData.videoType} onValueChange={v => setUploadData({...uploadData, videoType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Standard Video</SelectItem>
                      <SelectItem value="short">Short Reel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Video File *</Label>
                <Input type="file" accept="video/*" required onChange={e => setUploadData({...uploadData, videoFile: e.target.files?.[0] || null})} />
              </div>
              <div className="grid gap-2">
                <Label>Thumbnail (Optional)</Label>
                <Input type="file" accept="image/*" onChange={e => setUploadData({...uploadData, thumbnailFile: e.target.files?.[0] || null})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploadMutation.isPending ? "Uploading..." : "Start Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this video?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
