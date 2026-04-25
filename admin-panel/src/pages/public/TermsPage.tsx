import { LegalLayout } from "@/components/landing/LegalLayout";

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "account", label: "Account Terms" },
  { id: "content", label: "Content Policy" },
  { id: "prohibited", label: "Prohibited Content" },
  { id: "termination", label: "Termination" },
  { id: "law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using PlayVia."
      lastUpdated="01 January 2025"
      toc={TOC}
    >
      <h2 id="acceptance">1. Acceptance of Terms</h2>
      <p>
        By downloading, installing, or using the PlayVia mobile application or website ("Service"), you agree to
        be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.
      </p>
      <p>
        We may update these Terms from time to time. Continued use of PlayVia after changes constitutes acceptance
        of the revised Terms.
      </p>

      <h2 id="account">2. Account Terms</h2>
      <p>To use certain features, you must create an account. You agree to:</p>
      <ul>
        <li>Provide accurate, current, and complete information.</li>
        <li>Maintain the security of your password.</li>
        <li>Be at least 13 years old (16 in some regions).</li>
        <li>Be responsible for all activity under your account.</li>
      </ul>

      <h2 id="content">3. Content Policy</h2>
      <p>
        You retain all ownership rights to content you upload. By uploading, you grant PlayVia a worldwide,
        non-exclusive, royalty-free license to host, display, distribute, and promote your content on the Service.
      </p>
      <p>You are solely responsible for the content you publish and represent that you have all necessary rights.</p>

      <h2 id="prohibited">4. Prohibited Content</h2>
      <p>You may not upload content that:</p>
      <ul>
        <li>Violates any applicable Indian or international law.</li>
        <li>Infringes on intellectual property rights of others.</li>
        <li>Contains hate speech, harassment, or threats of violence.</li>
        <li>Sexually exploits or endangers minors.</li>
        <li>Promotes terrorism, self-harm, or illegal activities.</li>
        <li>Is spam, deceptive, or maliciously misleading.</li>
      </ul>

      <h2 id="termination">5. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violations of these Terms, with or without
        notice. You may delete your account at any time from the app settings.
      </p>

      <h2 id="law">6. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
        jurisdiction of the courts in Mumbai, Maharashtra.
      </p>

      <h2 id="contact">7. Contact Information</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:legal@playvia.app" className="text-primary font-medium">legal@playvia.app</a>.
      </p>
    </LegalLayout>
  );
}
