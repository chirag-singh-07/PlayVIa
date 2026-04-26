import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useCreatorComments } from "@/hooks/useCreator";

export default function CommentsPage() {
  const { data: list, isLoading } = useCreatorComments();
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Comments</h1>
        <p className="text-muted-foreground">Engage with your audience.</p>
      </div>
      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle>{list?.length || 0} recent comments</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {list?.map((c: any) => (
            <div key={c._id} className="flex gap-3 p-3 rounded-xl hover:bg-muted/40 transition-smooth">
              <Avatar><AvatarImage src={c.user?.avatar} /><AvatarFallback>{c.user?.name?.[0]}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{c.user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    on "{c.video?.title}" · {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : "N/A"}
                  </span>
                </div>
                <p className="text-sm mt-1">{c.content}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setReplyOpen(replyOpen === c._id ? null : c._id)}><Reply className="h-3 w-3 mr-1" />Reply</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast("Delete coming soon")}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                </div>
                {replyOpen === c._id && (
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="Write a reply..." />
                    <Button onClick={() => { setReplyOpen(null); toast.success("Reply posted"); }} className="bg-gradient-primary">Send</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {list?.length === 0 && (
            <p className="text-center py-10 text-muted-foreground">No comments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}