import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "Is the app free to download and use?", a: "Yes, PlayVia is 100% free to download and use. You can watch unlimited videos without any subscription. We support ourselves through optional ads." },
  { q: "What video quality is supported?", a: "We support adaptive streaming from 144p all the way up to 4K Ultra HD, automatically adjusted based on your network speed." },
  { q: "Can I watch videos offline?", a: "Absolutely. Download any video to watch later without an internet connection — perfect for travel and areas with low signal." },
  { q: "How do I upload my own videos?", a: "Sign in, tap the + button on the home screen, select your video, add a title and description, choose a category, and publish. It takes just a few minutes." },
  { q: "Is my data safe and private?", a: "Yes. We use industry-standard encryption, never sell your data, and follow strict Indian and international privacy laws (DPDP Act, GDPR). See our Privacy Policy for details." },
  { q: "Which languages are supported?", a: "PlayVia hosts videos in Hindi, English, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, and many more regional languages." },
  { q: "How do I report inappropriate content?", a: "Tap the three-dot menu on any video and choose 'Report'. Our moderation team reviews every report within 24 hours." },
  { q: "Can I use the app on TV or tablet?", a: "Yes — PlayVia works on Android phones, tablets, and Android TV. iOS and web apps are coming soon." },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-card data-[state=open]:border-primary/30 transition-all"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
