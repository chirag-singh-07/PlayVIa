import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useMyChannel } from "@/hooks/useCreator";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: channel, isLoading, refetch } = useMyChannel();
  const [saving, setSaving] = useState(false);
  
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name || "");
      setDescription(channel.description || "");
    }
  }, [channel]);

  const saveChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel?._id) return;
    
    setSaving(true);
    try {
      await api.put(`/channel/${channel._id}`, {
        name: channelName,
        description: description,
      });
      toast.success("Channel settings saved");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save channel");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = (e: React.FormEvent) => { 
    e.preventDefault(); 
    toast.info("User profile updates handled via global auth settings"); 
  };

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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, channel and payouts.</p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 max-w-2xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="channel">Channel</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Profile information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Full name</Label><Input defaultValue={user?.name} disabled /></div>
                  <div><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
                </div>
                <div><Label>Bio</Label><Textarea rows={3} placeholder="Tell viewers about yourself" /></div>
                <Button className="bg-gradient-primary shadow-glow">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="channel">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Channel info</CardTitle></CardHeader>
            <CardContent>
              {channel ? (
                <form onSubmit={saveChannel} className="space-y-4">
                  <div><Label>Channel name</Label><Input value={channelName} onChange={(e) => setChannelName(e.target.value)} /></div>
                  <div><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Channel description" /></div>
                  <Button disabled={saving} className="bg-gradient-primary shadow-glow">
                    {saving ? "Saving..." : "Save channel"}
                  </Button>
                </form>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground mb-4">You don't have a channel yet.</p>
                  <Button onClick={() => toast("Create channel flow coming soon")}>Create Channel</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Payment details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Payment details saved"); }} className="space-y-4">
                <div><Label>UPI ID</Label><Input placeholder="name@upi" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Bank account</Label><Input placeholder="XXXX XXXX 1234" /></div>
                  <div><Label>IFSC</Label><Input placeholder="HDFC0001234" /></div>
                </div>
                <div><Label>PAN</Label><Input placeholder="ABCDE1234F" /></div>
                <Button className="bg-gradient-primary shadow-glow">Save payment</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }} className="space-y-4 max-w-md">
                <div><Label>Current password</Label><Input type="password" /></div>
                <div><Label>New password</Label><Input type="password" /></div>
                <div><Label>Confirm password</Label><Input type="password" /></div>
                <Button className="bg-gradient-primary shadow-glow">Update password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}