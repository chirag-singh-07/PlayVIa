import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube, Linkedin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});
type FormValues = z.infer<typeof schema>;

const SOCIALS = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Message sent!", { description: `We'll reply to ${values.email} within 24 hours.` });
    form.reset();
  };

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            CONTACT
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Get In Touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            {[
              { Icon: Mail, label: "Email us", value: "support@playvia.app" },
              { Icon: Phone, label: "Call us", value: "+91 98765 43210" },
              { Icon: MapPin, label: "Visit us", value: "Mumbai, Maharashtra, India" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="font-semibold text-lg">{c.value}</div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <div className="text-sm font-semibold mb-3">Follow us</div>
              <div className="flex gap-3">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Priya Sharma" {...form.register("name")} className="mt-1.5" />
              {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} className="mt-1.5" />
              {form.formState.errors.email && <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={(v) => form.setValue("subject", v, { shouldValidate: true })} value={form.watch("subject")}>
                <SelectTrigger id="subject" className="mt-1.5">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Enquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="creator">Creator Partnership</SelectItem>
                  <SelectItem value="advertise">Advertise with us</SelectItem>
                  <SelectItem value="bug">Report a Bug</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.subject && <p className="text-sm text-destructive mt-1">{form.formState.errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} placeholder="Tell us how we can help..." {...form.register("message")} className="mt-1.5 resize-none" />
              {form.formState.errors.message && <p className="text-sm text-destructive mt-1">{form.formState.errors.message.message}</p>}
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full h-12 bg-gradient-brand hover:opacity-90 text-white border-0 shadow-brand">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
