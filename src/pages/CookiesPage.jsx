import { useSEO } from "@/lib/seo";
import { ProseStyles } from "@/pages/PrivacyPage";

export default function CookiesPage() {
  useSEO({
    title: "Cookie Policy",
    description: "AIthusiast Cookie Policy — the cookies and similar technologies we use, and your choices.",
  });
  return (
    <div className="container-narrow py-12 lg:py-16">
      <p className="label-eyebrow mb-2">Legal</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2">Cookie Policy</h1>
      <p className="text-white/45 text-[13px] mb-10">Last updated: January 2026</p>

      <article className="prose-aith">
        <Section title="What are cookies">
          Cookies are small text files stored on your device when you visit a website. Similar technologies
          (e.g. localStorage, pixels) serve comparable purposes.
        </Section>
        <Section title="How AIthusiast uses cookies">
          <p>We use cookies and similar technologies for:</p>
          <ul>
            <li><strong>Essential:</strong> running the site, remembering your compare list, cookie-consent preference.</li>
            <li><strong>Analytics:</strong> understanding aggregate usage so we can improve.</li>
            <li><strong>Advertising:</strong> if and when Google AdSense is enabled, to show relevant ads.</li>
          </ul>
        </Section>
        <Section title="Third-party cookies">
          When advertising is enabled, third-party vendors including Google may set cookies to serve ads. You
          can opt out of personalized advertising via{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google Ads Settings</a>{" "}
          or <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a>.
        </Section>
        <Section title="Managing cookies">
          You can accept or reject non-essential cookies via the consent banner shown on your first visit. You
          can also disable cookies in your browser settings; some site features may not work properly without
          them.
        </Section>
        <Section title="Changes">
          We may update this Cookie Policy. Material changes will be announced on the site.
        </Section>
        <Section title="Contact">
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
