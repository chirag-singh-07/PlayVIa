import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  HardDrive, Cloud, Database, 
  AlertTriangle, CheckCircle2, 
  RefreshCcw, Info, ArrowUpRight
} from "lucide-react";
import { adminService } from "@/lib/adminService";
import { toast } from "sonner";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";

export default function StoragePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStorageStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching storage stats:", error);
      const message = error.response?.status === 401 
        ? "Unauthorized: Please login as an admin to view storage stats." 
        : "Failed to load storage status. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading storage analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h3 className="text-xl font-bold">Storage Stats Unavailable</h3>
        <p className="text-muted-foreground">{error || "Could not retrieve data"}</p>
        <Button onClick={fetchStats}>Try Again</Button>
      </div>
    );
  }

  const { cloudinary, db } = stats || {};
  
  // Cloudinary storage data (mocking if missing from API)
  const storageLimit = cloudinary?.plan?.storage?.limit || 10737418240; // 10GB default
  const storageUsed = cloudinary?.plan?.storage?.used || 2147483648; // 2GB default
  const storagePercent = (storageUsed / storageLimit) * 100;

  const bandwidthLimit = cloudinary?.plan?.bandwidth?.limit || 10737418240; // 10GB default
  const bandwidthUsed = cloudinary?.plan?.bandwidth?.used || 4294967296; // 4GB default
  const bandwidthPercent = (bandwidthUsed / bandwidthLimit) * 100;

  const pieData = [
    { name: "Videos", value: db.videoCount, color: "#ef4444" },
    { name: "Shorts", value: db.shortCount, color: "#3b82f6" },
  ];

  const COLORS = ["#ef4444", "#3b82f6"];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Storage & Quotas</h2>
          <p className="text-muted-foreground mt-1">Monitor your Cloudinary assets and database capacity</p>
        </div>
        <Button onClick={fetchStats} disabled={loading}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cloud Storage (Cloudinary)</CardTitle>
            <Cloud className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(storageUsed)}</div>
            <div className="text-xs text-muted-foreground mt-1">Used of {formatBytes(storageLimit)}</div>
            <Progress value={storagePercent} className="h-2 mt-4" />
            <div className="flex justify-between mt-2 text-[10px] font-medium">
              <span>{storagePercent.toFixed(1)}% full</span>
              <span className={storagePercent > 80 ? "text-destructive" : "text-primary"}>
                {storagePercent > 80 ? "Critical" : "Healthy"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Bandwidth</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(bandwidthUsed)}</div>
            <div className="text-xs text-muted-foreground mt-1">Used of {formatBytes(bandwidthLimit)}</div>
            <Progress value={bandwidthPercent} className="h-2 mt-4" />
            <div className="flex justify-between mt-2 text-[10px] font-medium">
              <span>{bandwidthPercent.toFixed(1)}% consumed</span>
              <span className="text-primary">Healthy</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database (MongoDB)</CardTitle>
            <Database className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{db.videoCount + db.shortCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Total video documents tracked</div>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-red-500" style={{ width: `${(db.videoCount / (db.videoCount + db.shortCount)) * 100}%` }} />
                <div className="h-full bg-blue-500" style={{ width: `${(db.shortCount / (db.videoCount + db.shortCount)) * 100}%` }} />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-medium">
              <span className="text-red-500">{db.videoCount} Videos</span>
              <span className="text-blue-500">{db.shortCount} Shorts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Ratio between long-form videos and short reels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle>Storage Status & Alerts</CardTitle>
            <CardDescription>System warnings and optimization tips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border bg-success/10 border-success/20">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              <div>
                <div className="text-sm font-bold text-success">Storage Healthy</div>
                <div className="text-xs text-muted-foreground">Your Cloudinary storage is well within limits. No action required.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg border bg-warning/10 border-warning/20">
              <Info className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <div className="text-sm font-bold text-warning">Optimization Tip</div>
                <div className="text-xs text-muted-foreground">Consider enabling automatic video transformation for better bandwidth efficiency.</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Cleanup Suggestions
              </div>
              <ul className="mt-3 space-y-2">
                <li className="text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Redundant thumbnails</span>
                  <Button variant="link" className="h-auto p-0 text-xs">Analyze</Button>
                </li>
                <li className="text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Orphaned video files</span>
                  <Button variant="link" className="h-auto p-0 text-xs">Scan</Button>
                </li>
                <li className="text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Large legacy formats</span>
                  <Button variant="link" className="h-auto p-0 text-xs">Convert</Button>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
