import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatNumber } from "@/data/mock";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useCreatorSubscribers, useCreatorAnalytics } from "@/hooks/useCreator";
import { Loader2 } from "lucide-react";

export default function SubscribersPage() {
  const { data: subs, isLoading: subsLoading } = useCreatorSubscribers();
  const { data: analytics, isLoading: analyticsLoading } = useCreatorAnalytics();

  if (subsLoading || analyticsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <p className="text-muted-foreground">Your community at a glance.</p>
      </div>
      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle>Subscriber growth</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analytics?.viewsOverTime || []}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatNumber} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Line type="monotone" dataKey="views" name="Subscribers" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-card">
        <CardHeader><CardTitle>Recent subscribers</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {subs?.map((s: any) => (
              <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-smooth">
                <Avatar><AvatarImage src={s.user?.avatar} /><AvatarFallback>{s.user?.name?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.user?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Joined {s.createdAt ? format(new Date(s.createdAt), "dd MMM") : "N/A"}
                  </div>
                </div>
                <Badge variant="secondary">Subscriber</Badge>
              </div>
            ))}
            {subs?.length === 0 && (
              <p className="col-span-2 text-center py-10 text-muted-foreground">No subscribers found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}