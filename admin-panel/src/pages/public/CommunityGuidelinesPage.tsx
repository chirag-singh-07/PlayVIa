import { LegalLayout } from "@/components/landing/LegalLayout";

const TOC = [
  { id: "respect", label: "Respect" },
  { id: "rules", label: "Content Rules" },
  { id: "copyright", label: "Copyright" },
  { id: "spam", label: "Spam" },
  { id: "violence", label: "Violence" },
  { id: "misinfo", label: "Misinformation" },
  { id: "enforce", label: "Enforcement" },
];

export default function CommunityGuidelinesPage() {
  return (
    <LegalLayout
      title="Community Guidelines"
      subtitle="Simple rules to keep PlayVia welcoming for everyone."
      lastUpdated="01 January 2025"
      toc={TOC}
    >
      <h2 id="respect">Respect Each Other</h2>
      <p>Treat fellow creators and viewers with respect. Harassment, threats, and personal attacks are not allowed.</p>

      <h2 id="rules">Content Rules</h2>
      <p>Content must be your own or properly licensed. Add accurate titles and tags. Mark mature content appropriately.</p>

      <h2 id="copyright">Copyright</h2>
      <p>Don't upload videos, audio, or images you don't own the rights to. We honor DMCA takedown requests — see our <a href="/dmca" className="text-primary font-medium">DMCA Policy</a>.</p>

      <h2 id="spam">No Spam or Manipulation</h2>
      <p>Don't post repetitive content, fake engagement, or misleading thumbnails to trick viewers.</p>

      <h2 id="violence">Violence &amp; Dangerous Acts</h2>
      <p>Graphic violence, gore, and content promoting dangerous activities are prohibited.</p>

      <h2 id="misinfo">Misinformation</h2>
      <p>Don't spread medical, electoral, or public-safety misinformation that could cause real-world harm.</p>

      <h2 id="enforce">Enforcement</h2>
      <p>
        Violations may result in content removal, channel strikes, or account termination. Severe violations
        (e.g. CSAM, terrorism) result in immediate removal and reporting to authorities.
      </p>
    </LegalLayout>
  );
}
