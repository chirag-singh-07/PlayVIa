import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, Image as ImageIcon, Film, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  title: z.string().trim().min(3, "Min 3 characters").max(120),
  description: z.string().trim().max(2000),
  category: z.string().min(1, "Choose a category"),
  tags: z.string().max(200).optional(),
});
type FormValues = z.infer<typeof schema>;

const categories = ["Music", "Comedy", "Vlogs", "Cooking", "Tech", "Education", "Sports", "Gaming", "News", "Lifestyle"];

export default function UploadPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: "", description: "", category: "", tags: "" } });

  const onSubmit = async (data: FormValues) => {
    if (!video) { 
      toast.error("Please select a video file"); 
      return; 
    }
    
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("video", video);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    if (data.tags) formData.append("tags", data.tags);

    try {
      await api.post("/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        },
      });

      toast.success("Video uploaded successfully!");
      navigate("/creator/videos");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Upload Video</h1>
        <p className="text-muted-foreground">Share your story with millions.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-card">
            <CardHeader><CardTitle className="text-base">Files</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary hover:bg-muted/30 transition-smooth">
                {video ? <Film className="h-10 w-10 text-primary mb-2" /> : <Upload className="h-10 w-10 text-muted-foreground mb-2" />}
                <span className="text-sm font-medium">{video ? video.name : "Drop video here"}</span>
                <span className="text-xs text-muted-foreground mt-1">MP4, MOV up to 2GB</span>
                <input type="file" accept="video/*" className="hidden" disabled={uploading} onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-6 cursor-pointer hover:border-primary hover:bg-muted/30 transition-smooth">
                {thumbnail ? <ImageIcon className="h-8 w-8 text-primary mb-2" /> : <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />}
                <span className="text-sm font-medium">{thumbnail ? thumbnail.name : "Thumbnail"}</span>
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} />
              </label>
              {uploading && (
                <div>
                  <div className="flex justify-between text-xs mb-2"><span>Uploading...</span><span>{progress}%</span></div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-0 shadow-card">
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="My amazing video" disabled={uploading} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} placeholder="Tell viewers about your video..." disabled={uploading} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={uploading}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="comedy, mumbai, vlog" disabled={uploading} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" disabled={uploading} onClick={() => { form.reset(); setVideo(null); setThumbnail(null); }}><X className="h-4 w-4 mr-1" />Reset</Button>
                <Button type="submit" disabled={uploading} className="bg-gradient-primary shadow-glow flex-1"><Upload className="h-4 w-4 mr-2" />{uploading ? "Uploading..." : "Publish video"}</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}