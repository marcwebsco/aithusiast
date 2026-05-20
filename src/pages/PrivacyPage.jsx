import { useSEO } from "@/lib/seo";

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy",
    description: "AIthusiast Privacy Policy — how we collect, use and protect your information.",
  });
  return (
    <div className="container-narrow py-12 lg:py-16">
      <p className="label-eyebrow mb-2">Legal</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-white/45 text-[13px] mb-10">Last updated: January 2026</p>

      <article className="prose-aith">
        <Section title="1. Who we are">
          AIthusiast (“we”, “our”, “us”) operates a premium AI discovery platform that helps visitors find
          AI tools through search, rankings and editorial. This Privacy Policy explains what information we
          collect when you visit AIthusiast and how we use it.
        </Section>

        <Section title="2. Information we collect">
          <p><strong>Information you provide.</strong> If you contact us, we collect the information you send (e.g. email, message).</p>
          <p><strong>Usage data.</strong> Pages visited, features used, search queries, referrer URLs, device and browser metadata, approximate location (from IP).</p>
          <p><strong>Cookies and similar technologies.</strong> See our <a href="/cookies">Cookie Policy</a> for the full list.</p>
        </Section>

        <Section title="3. How we use your information">
          <ul>
            <li>To operate, secure and improve AIthusiast.</li>
            <li>To personalize and rank recommendations.</li>
            <li>To measure performance and reliability.</li>
            <li>To serve relevant advertising (e.g. via Google AdSense, where applicable).</li>
            <li>To respond to your enquiries.</li>
          </ul>
        </Section>

        <Section title="4. Legal bases (EEA / UK users)">
          Our legal bases include legitimate interests (running and improving the site), consent (for non-essential
          cookies and personalized ads), and contract performance (when you interact with services).
        </Section>

        <Section title="5. Sharing your information">
          We do not sell your personal information. We share limited data with trusted processors that help us
          operate the site (hosting, analytics, advertising). When advertising is enabled, third-party vendors
          including Google may use cookies to serve ads based on your prior visits.
        </Section>

        <Section title="6. Google AdSense">
          AIthusiast may use Google AdSense to display ads. Google’s use of advertising cookies enables it and
          its partners to serve ads based on your visit to this and other sites. You can opt out of personalized
          advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google Ads Settings</a>{" "}
          or <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a>.
        </Section>

        <Section title="7. Data retention">
          We retain personal data only as long as necessary for the purposes described, after which it is deleted
          or anonymized.
        </Section>

        <Section title="8. Your rights">
          Depending on where you live, you may have the right to access, correct, delete or port your personal
          data, and to object to or restrict certain processing. Contact us to exercise your rights.
        </Section>

        <Section title="9. International transfers">
          We may transfer information to servers outside your country. Where required by law, we use safeguards
          such as standard contractual clauses.
        </Section>

        <Section title="10. Children">
          AIthusiast is not directed to children under 13 (or the equivalent minimum age in your jurisdiction).
        </Section>

        <Section title="11. Changes to this policy">
          We may update this policy from time to time. Material changes will be announced on the site.
        </Section>

        <Section title="12. Contact">
          Questions? Email <a href="mailto:marcwebs.co@gmail.com">marcwebs.co@gmail.com</a> or visit our{" "}
          <a href="/contact">contact page</a>.
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

export function ProseStyles() {
  return (
    <style>{`
      .prose-aith a { color: #C4B5FD; text-decoration: underline; text-underline-offset: 2px; }
      .prose-aith a:hover { color: #DDD6FE; }
      .prose-aith ul { padding-left: 1.25rem; list-style: disc; }
      .prose-aith ul li { margin: 0.25rem 0; }
      .prose-aith strong { color: #E5E7EB; font-weight: 600; }
    `}</style>
  );
}
