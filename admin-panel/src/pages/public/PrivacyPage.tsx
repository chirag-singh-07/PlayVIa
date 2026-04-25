import { LegalLayout } from "@/components/landing/LegalLayout";

const TOC = [
  { id: "collect", label: "Data Collection" },
  { id: "use", label: "How We Use Data" },
  { id: "share", label: "Data Sharing" },
  { id: "cookies", label: "Cookies" },
  { id: "rights", label: "User Rights" },
  { id: "retention", label: "Data Retention" },
  { id: "children", label: "Children's Privacy" },
  { id: "dpo", label: "Contact DPO" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Your privacy matters. Here's exactly what we collect and how we use it."
      lastUpdated="01 January 2025"
      toc={TOC}
    >
      <h2 id="collect">1. Data We Collect</h2>
      <p>We collect three categories of information:</p>
      <ul>
        <li><strong>Account info</strong> — name, email, phone, profile picture.</li>
        <li><strong>Usage data</strong> — videos watched, search queries, app interactions, device information.</li>
        <li><strong>Content</strong> — videos, comments, and other content you upload.</li>
      </ul>

      <h2 id="use">2. How We Use Your Data</h2>
      <ul>
        <li>To provide, maintain, and improve the Service.</li>
        <li>To personalize content recommendations.</li>
        <li>To send important service notifications.</li>
        <li>To prevent fraud, abuse, and policy violations.</li>
        <li>To comply with legal obligations under Indian law.</li>
      </ul>

      <h2 id="share">3. Data Sharing</h2>
      <p>We <strong>never sell</strong> your personal data. We share limited data only with:</p>
      <ul>
        <li>Service providers (hosting, analytics) under strict confidentiality agreements.</li>
        <li>Law enforcement when legally compelled.</li>
        <li>Other users — only the information you choose to make public.</li>
      </ul>

      <h2 id="cookies">4. Cookies &amp; Tracking</h2>
      <p>
        We use cookies and similar technologies to remember your preferences and analyze usage. See our{" "}
        <a href="/cookies" className="text-primary font-medium">Cookie Policy</a> for full details.
      </p>

      <h2 id="rights">5. Your Rights</h2>
      <p>Under India's DPDP Act 2023 and other applicable laws, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccurate data.</li>
        <li>Request deletion of your account and data.</li>
        <li>Withdraw consent at any time.</li>
        <li>Lodge a complaint with the Data Protection Board of India.</li>
      </ul>

      <h2 id="retention">6. Data Retention</h2>
      <p>
        We retain your personal data only as long as necessary to provide the Service or comply with legal
        obligations. When you delete your account, we remove your data within 30 days, except where retention is
        legally required.
      </p>

      <h2 id="children">7. Children's Privacy</h2>
      <p>
        PlayVia is not intended for children under 13. We do not knowingly collect data from children. If we learn
        we have, we delete it promptly.
      </p>

      <h2 id="dpo">8. Contact our DPO</h2>
      <p>
        For privacy questions or requests, email our Data Protection Officer at{" "}
        <a href="mailto:dpo@playvia.app" className="text-primary font-medium">dpo@playvia.app</a>.
      </p>
    </LegalLayout>
  );
}
