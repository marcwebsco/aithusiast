import { useSEO } from "@/lib/seo";
import { ProseStyles } from "@/pages/PrivacyPage";

export default function TermsPage() {
  useSEO({
    title: "Terms of Service",
    description: "AIthusiast Terms of Service — the agreement that governs your use of the platform.",
  });
  return (
    <div className="container-narrow py-12 lg:py-16">
      <p className="label-eyebrow mb-2">Legal</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2">Terms of Service</h1>
      <p className="text-white/45 text-[13px] mb-10">Last updated: January 2026</p>

      <article className="prose-aith">
        <Section title="1. Agreement">
          By accessing or using AIthusiast (the “Service”), you agree to be bound by these Terms of Service
          (“Terms”). If you do not agree, do not use the Service.
        </Section>
        <Section title="2. The service">
          AIthusiast is a discovery platform that catalogs and recommends third-party AI tools. We do not own,
          operate or warrant any third-party AI tool listed. Trademarks belong to their respective owners.
        </Section>
        <Section title="3. Content & recommendations">
          Editorial content, rankings and AI-generated recommendations are provided “as is” for informational
          purposes. Always verify a tool’s capabilities, pricing and terms on its official website before use.
        </Section>
        <Section title="4. Acceptable use">
          You agree not to: (a) abuse, scrape or overload the Service; (b) misuse the AI search to generate
          unlawful or harmful content; (c) attempt to gain unauthorized access; or (d) infringe any intellectual
          property rights.
        </Section>
        <Section title="5. Intellectual property">
          All AIthusiast branding, design, code and editorial content are protected by copyright and other laws.
          You may not reproduce, modify or distribute without permission, except as allowed by law.
        </Section>
        <Section title="6. Disclaimers">
          The Service is provided “AS IS” without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose and non-infringement.
        </Section>
        <Section title="7. Limitation of liability">
          To the maximum extent permitted by law, AIthusiast shall not be liable for any indirect, incidental,
          special, consequential or punitive damages.
        </Section>
        <Section title="8. Third-party links">
          The Service may contain links to third-party sites. We are not responsible for their content,
          accuracy, policies or practices.
        </Section>
        <Section title="9. Modifications">
          We may modify these Terms at any time. Material changes will be announced on the site. Continued use
          constitutes acceptance.
        </Section>
        <Section title="10. Governing law">
          These Terms are governed by the laws of your residence to the extent required; otherwise, by the laws
          of the European Union, without regard to conflict-of-law principles.
        </Section>
        <Section title="11. Contact">
          Questions: <a href="mailto:marcwebs.co@gmail.com">marcwebs.co@gmail.com</a>.
        </Section>
      </article>
      <ProseStyles />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-xl tracking-tight mb-2">{title}</h2>
      <div className="text-white/75 text-[15px] leading-[1.75] space-y-3">{children}</div>
    </section>
  );
}
