import { LegalLayout } from "@/components/landing/LegalLayout";

const TOC = [
  { id: "protect", label: "Copyright Protection" },
  { id: "report", label: "How to Report" },
  { id: "counter", label: "Counter-Notice Process" },
  { id: "repeat", label: "Repeat Infringer Policy" },
];

export default function DMCAPage() {
  return (
    <LegalLayout
      title="DMCA Policy"
      subtitle="How we handle copyright infringement notices."
      lastUpdated="01 January 2025"
      toc={TOC}
    >
      <h2 id="protect">Copyright Protection</h2>
      <p>
        PlayVia respects intellectual property rights and complies with the Digital Millennium Copyright Act
        (DMCA) and India's Copyright Act, 1957.
      </p>

      <h2 id="report">How to Report Infringement</h2>
      <p>To submit a DMCA takedown notice, email <a href="mailto:dmca@playvia.app" className="text-primary font-medium">dmca@playvia.app</a> with:</p>
      <ul>
        <li>Identification of the copyrighted work claimed to be infringed.</li>
        <li>The URL of the infringing material on PlayVia.</li>
        <li>Your contact information (name, address, phone, email).</li>
        <li>A statement of good-faith belief that the use is unauthorized.</li>
        <li>A statement, under penalty of perjury, that the information is accurate.</li>
        <li>Your physical or electronic signature.</li>
      </ul>

      <h2 id="counter">Counter-Notice Process</h2>
      <p>
        If you believe content was removed in error, you may submit a counter-notice. We will forward it to the
        original complainant. If they do not file legal action within 10 business days, we may restore the content.
      </p>

      <h2 id="repeat">Repeat Infringer Policy</h2>
      <p>
        Accounts that receive multiple valid DMCA notices will be permanently terminated under our repeat
        infringer policy.
      </p>
    </LegalLayout>
  );
}
