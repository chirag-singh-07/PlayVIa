import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Cookie,
  RefreshCcw,
  IndianRupee,
  Mail,
  ChevronRight,
  CheckCircle2,
  Users,
  Eye,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Section {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface LegalProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  updated?: string;
  sections: Section[];
  children?: React.ReactNode;
}

const legalNav = [
  { to: "/privacy", label: "Privacy", icon: Shield },
  { to: "/terms", label: "Terms", icon: FileText },
  { to: "/monetization", label: "Monetization", icon: IndianRupee },
  { to: "/community-guidelines", label: "Community", icon: Users },
  { to: "/copyright", label: "Copyright", icon: Shield },
  { to: "/creator-agreement", label: "Creator Agreement", icon: FileText },
  { to: "/trust-safety", label: "Trust & Safety", icon: Shield },
  { to: "/acceptable-use", label: "Acceptable Use", icon: CheckCircle2 },
  { to: "/disclaimer", label: "Disclaimer", icon: FileText },
  { to: "/accessibility", label: "Accessibility", icon: Sparkles },
  { to: "/cookies", label: "Cookies", icon: Cookie },
  { to: "/refund", label: "Refund", icon: RefreshCcw },
];

export const LegalPage = ({
  title,
  subtitle,
  icon: Icon = FileText,
  updated = "January 2025",
  sections,
  children,
}: LegalProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="container max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge variant="secondary" className="rounded-full">
              Legal • Last updated {updated}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
          )}
        </motion.div>

        {/* Legal nav */}
        <div className="mt-10 flex flex-wrap gap-2">
          {legalNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="group inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Body */}
    <section className="pb-20">
      <div className="container max-w-5xl grid lg:grid-cols-[1fr_3fr] gap-10">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              On this page
            </p>
            <ul className="space-y-1.5">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#section-${i}`}
                    className="group flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <ChevronRight className="h-4 w-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-smooth" />
                    <span>{s.heading}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {children}
          {sections.map((s, i) => (
            <motion.div
              key={s.heading}
              id={`section-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <Card className="border bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-semibold mb-3 scroll-mt-28">
                    {s.heading}
                  </h2>
                  {s.body && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {s.body}
                    </p>
                  )}
                  {s.bullets && (
                    <ul className="mt-3 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 mt-1 text-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Contact card */}
          <Card className="border bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Questions about this policy?</h3>
                  <p className="text-sm text-muted-foreground">
                    Reach our team at support@payvia.in — we usually reply within 24 hours.
                  </p>
                </div>
              </div>
              <Button asChild className="bg-gradient-primary shadow-glow">
                <a href="mailto:support@payvia.in">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

/* ─────────────────────────────  PAGES  ───────────────────────────── */

export const PrivacyPage = () => (
  <LegalPage
    title="Privacy Policy"
    subtitle="How PayVia collects, uses, and protects your personal information."
    icon={Shield}
    sections={[
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly — such as your name, username, email, phone number, payment details, and content you upload. We also automatically collect device data, IP addresses, watch history, and interaction data to improve recommendations.",
      },
      {
        heading: "2. How We Use Your Information",
        bullets: [
          "Provide and personalize your viewing and creator experience",
          "Process creator payouts via UPI / bank transfers",
          "Detect fraud, spam, fake views, and abuse",
          "Send important account, security, and monetization updates",
        ],
      },
      {
        heading: "3. Sharing of Data",
        body: "We never sell your personal data. We share information only with trusted service providers (payments, analytics, hosting), with legal authorities when required by Indian law, and in aggregated/anonymized form with research partners.",
      },
      {
        heading: "4. Your Rights",
        body: "You can access, correct, export or delete your data anytime from Settings → Privacy. You may also write to privacy@payvia.in to exercise your rights under India's DPDP Act, 2023.",
      },
      {
        heading: "5. Data Security",
        body: "We use TLS encryption in transit, AES-256 at rest, and regular third-party security audits. While we follow industry best practices, no system is 100% secure — please use a strong password and enable 2FA.",
      },
      {
        heading: "6. Children's Privacy",
        body: "PayVia is not intended for children under 13. Creators under 18 require parental consent before enabling monetization features.",
      },
    ]}
  />
);

export const TermsPage = () => (
  <LegalPage
    title="Terms of Service"
    subtitle="The rules that govern your use of PayVia as a viewer or creator."
    icon={FileText}
    sections={[
      {
        heading: "1. Acceptance of Terms",
        body: "By creating a PayVia account or using any part of our services, you agree to be bound by these Terms. If you do not agree, please do not use the platform.",
      },
      {
        heading: "2. Account & Eligibility",
        bullets: [
          "You must be at least 13 years old to create a viewer account",
          "Creators must be 18+ to enable monetization and receive payouts",
          "One person may not operate multiple accounts to inflate metrics",
          "You are responsible for keeping your password and OTP confidential",
        ],
      },
      {
        heading: "3. Content Ownership & License",
        body: "You retain full ownership of content you upload. By uploading, you grant PayVia a worldwide, non-exclusive, royalty-free license to host, stream, promote, and distribute that content across our platform and marketing channels.",
      },
      {
        heading: "4. Prohibited Content",
        bullets: [
          "Hate speech, harassment, or content that incites violence",
          "Sexually explicit material or content involving minors",
          "Copyrighted material you don't own or have rights to",
          "Misinformation, deepfakes, or content that endangers public safety",
          "Spam, fake engagement, or view-bot activity",
        ],
      },
      {
        heading: "5. Monetization & Payouts",
        body: "Eligible creators may earn revenue under the PayVia Monetization Policy. We reserve the right to demonetize, withhold, or reverse earnings tied to fraudulent activity, policy violations, or chargebacks. See our Monetization Policy for full details.",
      },
      {
        heading: "6. Termination",
        body: "We may suspend or terminate accounts that violate these Terms, harm the community, or pose legal risk. You may delete your account at any time from Settings.",
      },
      {
        heading: "7. Governing Law",
        body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka.",
      },
    ]}
  />
);

export const MonetizationPage = () => (
  <LegalPage
    title="Monetization Policy"
    subtitle="Earn from your content on PayVia — transparent rates, simple eligibility, fast payouts."
    icon={IndianRupee}
    sections={[
      {
        heading: "1. Eligibility — How to Get Monetized",
        body: "To unlock monetization on your PayVia channel, you must meet ALL of the following requirements:",
        bullets: [
          "At least 2,000 subscribers on your channel",
          "At least 5 successful user referrals (friends who sign up via your referral link and verify email)",
          "Account in good standing — no active strikes or policy violations",
          "Verified email and phone number",
          "Completed KYC with PAN and a valid UPI / bank account",
        ],
      },
      {
        heading: "2. Earnings Rate",
        body: "PayVia pays creators a flat, transparent rate based on qualified views — no hidden formulas.",
        bullets: [
          "₹50 for every 1,000 qualified views (CPM = ₹50)",
          "10,000 views ≈ ₹500",
          "1,00,000 views ≈ ₹5,000",
          "10,00,000 views ≈ ₹50,000",
          "Live streams, super-chats, and brand deals earn separately on top of view revenue",
        ],
      },
      {
        heading: "3. What Counts as a Qualified View?",
        bullets: [
          "Viewer watched at least 30 seconds (or 50% of videos under 60s)",
          "View originated from a real, logged-in PayVia user",
          "View was not generated by bots, incentivized clicks, or auto-refresh tools",
          "Video complies with our Community Guidelines and is monetization-eligible",
        ],
      },
      {
        heading: "4. Referral Bonus",
        body: "Each verified referral counts toward your monetization unlock and also earns you ₹20 instantly into your PayVia wallet once the referred user watches their first 3 videos.",
      },
      {
        heading: "5. Payouts",
        bullets: [
          "Minimum withdrawal: ₹500",
          "Payouts processed every Monday via UPI or IMPS bank transfer",
          "1% TDS deducted as per Indian tax regulations (Section 194-O)",
          "Detailed earnings & invoices available in Creator Studio → Earnings",
        ],
      },
      {
        heading: "6. Demonetization & Appeals",
        body: "We may demonetize videos or channels that violate our guidelines, attract repeated copyright strikes, or show signs of artificial engagement. Creators can appeal any demonetization decision within 30 days from Creator Studio → Earnings → Appeals.",
      },
      {
        heading: "7. Policy Updates",
        body: "We may update rates and eligibility criteria with at least 30 days' notice via email and in-app announcements. Continued use of monetization features after changes implies acceptance.",
      },
    ]}
  >
    {/* Highlight cards */}
    <div className="grid sm:grid-cols-3 gap-4 mb-2">
      {[
        { icon: Users, label: "Subscribers", value: "2,000+", desc: "Minimum to qualify" },
        { icon: Sparkles, label: "Referrals", value: "5", desc: "Verified sign-ups" },
        { icon: Wallet, label: "Per 1K Views", value: "₹50", desc: "Flat CPM payout" },
      ].map((s) => (
        <Card key={s.label} className="border bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Earnings table */}
    <Card className="border">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Earnings calculator</h3>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Views</th>
                <th className="text-right p-3 font-medium">You earn</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1,000", "₹50"],
                ["10,000", "₹500"],
                ["50,000", "₹2,500"],
                ["1,00,000", "₹5,000"],
                ["10,00,000", "₹50,000"],
              ].map(([v, e]) => (
                <tr key={v} className="border-t">
                  <td className="p-3">{v} views</td>
                  <td className="p-3 text-right font-semibold text-primary">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Rates shown are base view payouts. Live super-chats, brand deals, and tips are paid separately.
        </p>
      </CardContent>
    </Card>
  </LegalPage>
);

export const CookiesPage = () => (
  <LegalPage
    title="Cookie Policy"
    subtitle="How and why PayVia uses cookies and similar technologies."
    icon={Cookie}
    sections={[
      {
        heading: "What are cookies?",
        body: "Cookies are small text files stored on your device that help websites remember your preferences, keep you logged in, and understand how features are used.",
      },
      {
        heading: "Types of cookies we use",
        bullets: [
          "Essential — required for login, security, and core playback",
          "Performance — anonymous analytics to improve recommendations",
          "Preference — remember language, theme, and playback quality",
          "Marketing — measure the effectiveness of our campaigns",
        ],
      },
      {
        heading: "Managing cookies",
        body: "You can control cookies via your browser settings or from Settings → Privacy → Cookie Preferences. Disabling essential cookies will prevent login.",
      },
      {
        heading: "Third-party cookies",
        body: "Some cookies are set by trusted partners (analytics, payment providers). We never allow third parties to use cookies for cross-site tracking on PayVia.",
      },
    ]}
  />
);

export const RefundPage = () => (
  <LegalPage
    title="Refund Policy"
    subtitle="When and how you can request a refund on PayVia."
    icon={RefreshCcw}
    sections={[
      {
        heading: "Premium subscriptions",
        body: "You may request a full refund within 7 days of purchase if you have not consumed substantial premium content (less than 60 minutes of premium-only videos watched).",
      },
      {
        heading: "Super-chats & tips",
        body: "Tips and super-chats sent to creators are non-refundable, except in proven cases of fraud or unauthorized account access.",
      },
      {
        heading: "Creator earnings",
        body: "Once payouts are processed they are final. Disputes must be raised within 30 days of the payout date via Creator Studio → Earnings → Support.",
      },
      {
        heading: "How to request",
        body: "Email refunds@payvia.in with your order ID, registered email, and the reason for the refund. Approved refunds are credited to the original payment method within 5–7 business days.",
      },
    ]}
  />
);

export const CommunityGuidelinesPage = () => (
  <LegalPage
    title="Community Guidelines"
    subtitle="The values and rules that keep PayVia safe, respectful, and fun for everyone."
    icon={Users}
    sections={[
      {
        heading: "1. Respect Everyone",
        body: "Treat every viewer and creator with kindness. We have zero tolerance for harassment, bullying, doxxing, or hate speech based on caste, religion, gender, sexuality, or origin.",
      },
      {
        heading: "2. No Harmful or Dangerous Content",
        bullets: [
          "No content that promotes violence, self-harm, or dangerous challenges",
          "No glorification of drugs, weapons, or illegal activity",
          "No medical or financial misinformation",
        ],
      },
      {
        heading: "3. Authenticity & No Spam",
        bullets: [
          "Don't impersonate other creators, brands, or public figures",
          "No misleading thumbnails, clickbait, or deepfakes",
          "No artificial views, likes, comments, or sub-for-sub schemes",
        ],
      },
      {
        heading: "4. Adult & Sensitive Content",
        body: "Sexually explicit content is not permitted. Mature themes (mild language, dark humor) must be age-gated and labeled correctly.",
      },
      {
        heading: "5. Strikes & Enforcement",
        bullets: [
          "1st violation — warning + content removal",
          "2nd violation — 7-day upload restriction",
          "3rd violation — channel termination and payout freeze",
          "Severe violations may result in immediate termination",
        ],
      },
      {
        heading: "6. Reporting",
        body: "See something that breaks these rules? Tap the ⋯ menu on any video or profile to report it. Our Trust & Safety team reviews reports 24×7.",
      },
    ]}
  />
);

export const CopyrightPage = () => (
  <LegalPage
    title="Copyright & DMCA Policy"
    subtitle="How PayVia handles copyrighted content and takedown requests."
    icon={Shield}
    sections={[
      {
        heading: "1. Respect for Intellectual Property",
        body: "PayVia respects the intellectual property rights of others and expects creators to do the same. Only upload content you own or have explicit permission to use.",
      },
      {
        heading: "2. Filing a Takedown Notice",
        body: "Rights-holders can submit a takedown request to copyright@payvia.in. Your notice must include:",
        bullets: [
          "Identification of the copyrighted work",
          "URL of the infringing video on PayVia",
          "Your contact details (name, email, address, phone)",
          "A good-faith statement and signature",
        ],
      },
      {
        heading: "3. Counter-Notification",
        body: "If your content was removed in error, you may file a counter-notice within 14 days. We will restore the content unless the original claimant files a court action.",
      },
      {
        heading: "4. Repeat Infringer Policy",
        body: "Channels that receive 3 valid copyright strikes within 90 days will be terminated and any pending payouts forfeited.",
      },
      {
        heading: "5. Content ID & Music Library",
        body: "Use our free in-app music library and stock clips to avoid copyright issues. Original creators receive automatic credit and revenue share.",
      },
    ]}
  />
);

export const CreatorAgreementPage = () => (
  <LegalPage
    title="Creator Agreement"
    subtitle="The contract between PayVia and monetized creators on our platform."
    icon={FileText}
    sections={[
      {
        heading: "1. Scope",
        body: "This Agreement applies once your channel is enrolled in the PayVia Monetization Program. It supplements (not replaces) our Terms of Service.",
      },
      {
        heading: "2. Creator Responsibilities",
        bullets: [
          "Maintain the eligibility criteria (2,000 subscribers + 5 referrals)",
          "Upload only original or properly licensed content",
          "Disclose paid promotions, sponsorships, and affiliate links",
          "Respond to copyright and policy notices within 7 days",
        ],
      },
      {
        heading: "3. Revenue Share",
        body: "PayVia pays out 100% of agreed view revenue (₹50 per 1,000 qualified views). For brand deals brokered by PayVia, the split is 80% creator / 20% platform.",
      },
      {
        heading: "4. Taxes",
        body: "Creators are responsible for their own income tax. PayVia deducts 1% TDS under Section 194-O and issues a Form 26AS-compatible certificate every quarter.",
      },
      {
        heading: "5. Termination",
        body: "Either party may exit this Agreement with 30 days' notice. Upon termination, pending eligible earnings are paid in the next payout cycle.",
      },
      {
        heading: "6. Confidentiality",
        body: "Both parties agree to keep non-public commercial terms (special CPMs, brand deal details) confidential.",
      },
    ]}
  />
);

export const TrustSafetyPage = () => (
  <LegalPage
    title="Trust & Safety"
    subtitle="How PayVia protects viewers, creators, and the wider community."
    icon={Shield}
    sections={[
      {
        heading: "Our Approach",
        body: "We combine machine learning, human reviewers, and community reporting to keep PayVia safe. Our Trust & Safety team operates 24×7 across India.",
      },
      {
        heading: "Proactive Detection",
        bullets: [
          "AI scans uploads for nudity, violence, and copyrighted audio",
          "Spam and bot networks are detected and removed within minutes",
          "Repeat-offender device fingerprints are blocked at signup",
        ],
      },
      {
        heading: "Reporting & Appeals",
        body: "Every removal includes a clear reason and a one-tap appeal. We aim to review appeals within 48 hours.",
      },
      {
        heading: "Child Safety",
        body: "We work with the National Centre for Missing & Exploited Children (NCMEC) and Indian cyber-crime authorities to combat CSAM. Such content is reported immediately and the uploader permanently banned.",
      },
      {
        heading: "Election & Public-Interest Integrity",
        body: "During elections and emergencies, we partner with verified fact-checkers and add information panels to high-impact content.",
      },
      {
        heading: "Transparency Reports",
        body: "Every six months we publish a Transparency Report detailing content removals, government requests, and enforcement actions.",
      },
    ]}
  />
);

export const AcceptableUsePage = () => (
  <LegalPage
    title="Acceptable Use Policy"
    subtitle="What you can and cannot do on PayVia."
    icon={CheckCircle2}
    sections={[
      {
        heading: "Permitted Use",
        bullets: [
          "Watch, like, comment, share, and subscribe to channels",
          "Upload original videos that comply with our guidelines",
          "Earn revenue under our Monetization Policy",
          "Use our APIs within published rate limits",
        ],
      },
      {
        heading: "Prohibited Activities",
        bullets: [
          "Scraping, crawling, or mass-downloading content without permission",
          "Reverse engineering or attempting to bypass DRM",
          "Using bots, automation, or scripts to inflate metrics",
          "Reselling PayVia accounts, subscribers, or referral links",
          "Distributing malware, phishing, or scams via comments or DMs",
        ],
      },
      {
        heading: "Rate Limits",
        body: "Reasonable usage limits apply to uploads, comments, follows, and API calls. Excessive activity may be temporarily throttled.",
      },
      {
        heading: "Consequences",
        body: "Violations may result in content removal, monetization suspension, or permanent termination — at PayVia's sole discretion.",
      },
    ]}
  />
);

export const DisclaimerPage = () => (
  <LegalPage
    title="Disclaimer"
    subtitle="Important information about the content and services on PayVia."
    icon={FileText}
    sections={[
      {
        heading: "User-Generated Content",
        body: "Opinions and views expressed in videos, livestreams, or comments are those of the individual creators and do not represent PayVia. We do not endorse any user-generated content.",
      },
      {
        heading: "No Professional Advice",
        body: "Content on PayVia is for entertainment and informational purposes only. It should not be treated as medical, legal, financial, or professional advice. Always consult a qualified professional.",
      },
      {
        heading: "Earnings Disclaimer",
        body: "Creator earnings examples (e.g. ₹50 per 1,000 views) are illustrative. Actual earnings vary based on audience geography, video category, watch time, and policy compliance. PayVia does not guarantee any specific income.",
      },
      {
        heading: "External Links",
        body: "Videos may include links to third-party sites. PayVia is not responsible for the content, accuracy, or privacy practices of those sites.",
      },
      {
        heading: "Service Availability",
        body: "We strive for 99.9% uptime but do not guarantee uninterrupted service. Maintenance windows are announced in-app whenever possible.",
      },
    ]}
  />
);

export const AccessibilityPage = () => (
  <LegalPage
    title="Accessibility Statement"
    subtitle="Our commitment to building a platform everyone can use."
    icon={Sparkles}
    sections={[
      {
        heading: "Our Commitment",
        body: "PayVia is designed to meet WCAG 2.1 Level AA standards. We continuously work to improve accessibility for users with visual, hearing, motor, or cognitive differences.",
      },
      {
        heading: "Built-in Features",
        bullets: [
          "Auto-generated captions in 10+ Indian languages",
          "Full keyboard navigation across the player and Studio",
          "Adjustable playback speed, font size, and high-contrast mode",
          "Screen-reader friendly markup and ARIA labels",
          "Audio descriptions toggle on supported videos",
        ],
      },
      {
        heading: "Creator Tools",
        body: "We encourage creators to add captions, alt-text on thumbnails, and clear chapter markers. Accessibility-first content gets a small recommendation boost.",
      },
      {
        heading: "Feedback",
        body: "If you encounter an accessibility barrier, please email accessibility@payvia.in. We aim to respond within 5 business days and prioritize fixes in our next release.",
      },
    ]}
  />
);
