import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/adminService";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [general, setGeneral] = useState({ name: "PlayVia", tagline: "India's #1 Video Streaming App", email: "support@playvia.in", phone: "+91 98765 43210", maintenance: false });
  const [upload, setUpload] = useState({ maxSize: 2048, formats: "mp4, mov, avi, mkv", maxDuration: 180, autoTranscode: true });
  const [mon, setMon] = useState({ enabled: true, share: 55, minWithdraw: 500, upi: true, bank: true, paypal: false });
  const [email, setEmail] = useState({ host: "smtp.sendgrid.net", port: 587, user: "apikey", pass: "" });
  const [security, setSecurity] = useState({ verifyEmail: true, force2fa: true, sessionTimeout: 60, ipWhitelist: "" });
  const [boost, setBoost] = useState({ perDayCost: 100, discount3Days: 10, discount7Days: 20 });

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      if (data) {
        if (data.general) setGeneral(data.general);
        if (data.upload) setUpload(data.upload);
        if (data.monetization) setMon(data.monetization);
        if (data.email) setEmail(data.email);
        if (data.security) setSecurity(data.security);
        if (data.boost) setBoost(data.boost);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await adminService.updateSettings({
        general,
        upload,
        monetization: mon,
        email,
        security,
        boost,
      });
      toast.success("Settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">General Settings</h1>
        <p className="text-sm text-muted-foreground">Configure app-wide settings and integrations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="boost">Promotion (Boost)</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div><Label>App name</Label><Input value={general.name} onChange={(e) => setGeneral({ ...general, name: e.target.value })} /></div>
            <div><Label>Tagline</Label><Input value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} /></div>
            <div><Label>Logo</Label><Input type="file" accept="image/*" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Support email</Label><Input value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} /></div>
              <div><Label>Support phone</Label><Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} /></div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div><Label className="cursor-pointer">Maintenance mode</Label><p className="text-xs text-muted-foreground">Block access to the app while you make changes</p></div>
              <Switch checked={general.maintenance} onCheckedChange={(v) => setGeneral({ ...general, maintenance: v })} />
            </div>
            <div className="pt-2"><Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save Changes</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div><Label>Max video size (MB)</Label><Input type="number" value={upload.maxSize} onChange={(e) => setUpload({ ...upload, maxSize: +e.target.value })} /></div>
            <div><Label>Allowed formats</Label><Input value={upload.formats} onChange={(e) => setUpload({ ...upload, formats: e.target.value })} /><p className="text-xs text-muted-foreground mt-1">Comma-separated extensions</p></div>
            <div><Label>Max duration (minutes)</Label><Input type="number" value={upload.maxDuration} onChange={(e) => setUpload({ ...upload, maxDuration: +e.target.value })} /></div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div><Label className="cursor-pointer">Auto-transcoding</Label><p className="text-xs text-muted-foreground">Generate 144p–4K renditions automatically</p></div>
              <Switch checked={upload.autoTranscode} onCheckedChange={(v) => setUpload({ ...upload, autoTranscode: v })} />
            </div>
            <Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="monetization" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div><Label className="cursor-pointer">Enable monetization</Label><p className="text-xs text-muted-foreground">Allow creators to earn from videos</p></div>
              <Switch checked={mon.enabled} onCheckedChange={(v) => setMon({ ...mon, enabled: v })} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label>Creator revenue share</Label><span className="font-semibold">{mon.share}%</span></div>
              <Slider value={[mon.share]} onValueChange={([v]) => setMon({ ...mon, share: v })} min={0} max={100} step={5} />
            </div>
            <div><Label>Minimum withdrawal (₹)</Label><Input type="number" value={mon.minWithdraw} onChange={(e) => setMon({ ...mon, minWithdraw: +e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Payment methods</Label>
              <div className="flex items-center justify-between rounded-md border p-3"><span className="text-sm">UPI</span><Switch checked={mon.upi} onCheckedChange={(v) => setMon({ ...mon, upi: v })} /></div>
              <div className="flex items-center justify-between rounded-md border p-3"><span className="text-sm">Bank Transfer</span><Switch checked={mon.bank} onCheckedChange={(v) => setMon({ ...mon, bank: v })} /></div>
              <div className="flex items-center justify-between rounded-md border p-3"><span className="text-sm">PayPal</span><Switch checked={mon.paypal} onCheckedChange={(v) => setMon({ ...mon, paypal: v })} /></div>
            </div>
            <Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="boost" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div><Label>Per Day Boost Cost (₹)</Label><Input type="number" value={boost.perDayCost} onChange={(e) => setBoost({ ...boost, perDayCost: +e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>3-Day Discount (%)</Label><Input type="number" value={boost.discount3Days} onChange={(e) => setBoost({ ...boost, discount3Days: +e.target.value })} /></div>
              <div><Label>7-Day Discount (%)</Label><Input type="number" value={boost.discount7Days} onChange={(e) => setBoost({ ...boost, discount7Days: +e.target.value })} /></div>
            </div>
            <Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save Boost Settings</Button>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>SMTP host</Label><Input value={email.host} onChange={(e) => setEmail({ ...email, host: e.target.value })} /></div>
              <div><Label>SMTP port</Label><Input type="number" value={email.port} onChange={(e) => setEmail({ ...email, port: +e.target.value })} /></div>
            </div>
            <div><Label>SMTP user</Label><Input value={email.user} onChange={(e) => setEmail({ ...email, user: e.target.value })} /></div>
            <div><Label>SMTP password</Label><Input type="password" value={email.pass} onChange={(e) => setEmail({ ...email, pass: e.target.value })} placeholder="••••••••" /></div>
            <div className="flex gap-2"><Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save</Button><Button variant="outline" onClick={() => toast.success("Test email sent")}><Send className="w-4 h-4 mr-1" />Send test email</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="p-6 space-y-4 max-w-2xl">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div><Label className="cursor-pointer">Require email verification</Label><p className="text-xs text-muted-foreground">New accounts must verify email before posting</p></div>
              <Switch checked={security.verifyEmail} onCheckedChange={(v) => setSecurity({ ...security, verifyEmail: v })} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div><Label className="cursor-pointer">Enforce 2FA for admins</Label><p className="text-xs text-muted-foreground">All admin accounts require two-factor auth</p></div>
              <Switch checked={security.force2fa} onCheckedChange={(v) => setSecurity({ ...security, force2fa: v })} />
            </div>
            <div><Label>Session timeout (minutes)</Label>
              <Select value={String(security.sessionTimeout)} onValueChange={(v) => setSecurity({ ...security, sessionTimeout: +v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>IP whitelist for admin</Label><Textarea rows={3} value={security.ipWhitelist} onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })} placeholder="One IP per line. Leave empty to allow all." /></div>
            <Button onClick={saveSettings}><Save className="w-4 h-4 mr-1" />Save</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
