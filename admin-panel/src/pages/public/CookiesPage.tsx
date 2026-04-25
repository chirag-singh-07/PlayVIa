import { LegalLayout } from "@/components/landing/LegalLayout";

const TOC = [
  { id: "what", label: "What Are Cookies" },
  { id: "types", label: "Types We Use" },
  { id: "third", label: "Third Party Cookies" },
  { id: "manage", label: "Managing Cookies" },
  { id: "updates", label: "Updates" },
];

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="01 January 2025" toc={TOC}>
      <h2 id="what">What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help websites remember information about your
        visit. We use them to keep you signed in and improve your experience.
      </p>

      <h2 id="types">Types of Cookies We Use</h2>
      <ul>
        <li><strong>Essential cookies</strong> — needed for the Service to work (e.g. authentication).</li>
        <li><strong>Preference cookies</strong> — remember your settings (theme, language).</li>
        <li><strong>Analytics cookies</strong> — help us understand how the Service is used.</li>
        <li><strong>Marketing cookies</strong> — measure effectiveness of campaigns.</li>
      </ul>

      <h2 id="third">Third Party Cookies</h2>
      <p>
        We use trusted partners like Google Analytics for usage measurement. These partners may set their own
        cookies subject to their privacy policies.
      </p>

      <h2 id="manage">Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings or our in-app preferences. Disabling essential
        cookies may break parts of the Service.
      </p>

      <h2 id="updates">Updates</h2>
      <p>We may update this Cookie Policy occasionally. The "last updated" date above always reflects the latest version.</p>
    </LegalLayout>
  );
}
