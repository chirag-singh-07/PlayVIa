import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BarChart3, Eye, ThumbsUp, Loader2, Rocket } from "lucide-react";
import { formatNumber } from "@/data/mock";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useCreatorVideos } from "@/hooks/useCreator";
import BoostModal from "@/components/creator/BoostModal";

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  
  const { data, isLoading } = useCreatorVideos(page, 10);

  const videos = data?.videos || [];
  const total = data?.total || 0;
  const filtered = videos.filter((v: any) => v.title.toLowerCase().includes(q.toLowerCase()));

  const openBoost = (v: any) => {
    setSelectedVideo(v);
    setIsBoostModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <BoostModal 
        video={selectedVideo} 
        isOpen={isBoostModalOpen} 
        onClose={() => setIsBoostModalOpen(false)} 
      />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Videos</h1>
          <p className="text-muted-foreground">Manage your channel content.</p>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search current page..." className="max-w-xs" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <Card className="border-0 shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{total} videos</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= (data?.pages || 1)}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><Eye className="inline h-4 w-4" /> Views</TableHead>
                <TableHead><ThumbsUp className="inline h-4 w-4" /> Likes</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v: any) => (
                <TableRow key={v._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={v.thumbnailUrl || "/placeholder.svg"} className="h-12 w-20 rounded-lg object-cover" alt="" />
                        {v.isBoosted && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-black">
                            <Rocket className="h-2 w-2 text-black fill-black" />
                          </div>
                        )}
                      </div>
                      <div className="font-medium max-w-xs truncate">
                        {v.title}
                        {v.isBoosted && <span className="ml-2 text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Boosted</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.isPublished ? "default" : "secondary"}>
                      {v.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatNumber(v.views || 0)}</TableCell>
                  <TableCell>{formatNumber(v.likesCount || 0)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {v.createdAt ? format(new Date(v.createdAt), "dd MMM yyyy") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!v.isBoosted && (
                        <Button size="icon" variant="ghost" className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10" title="Boost Video" onClick={() => openBoost(v)}>
                          <Rocket className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => toast("Edit coming soon")}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => toast("Analytics open")}><BarChart3 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => toast("Delete coming soon")}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No videos found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}