import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/lib/seo";

export default function ContactPage() {
  useSEO({
    title: "Contact AIthusiast",
    description: "Get in touch with the AIthusiast team — questions, partnerships, press, or tool submissions.",
  });

  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSubmitting(true);
    // Frontend-only: build mailto link for now (no inbox endpoint in V1).
    const subject = encodeURIComponent(
      `[AIthusiast] ${form.topic || "Contact"} — ${form.name || "Anonymous"}`
    );
    const body = encodeURIComponent(
      `From: ${form.name} <${form.email}>\nTopic: ${form.topic}\n\n${form.message}`
    );
    window.location.href = `mailto:marcwebs.co@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="container-narrow py-12 lg:py-16">
      <p className="label-eyebrow mb-2">Contact</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05] mb-3">
        Tell us what you need.
      </h1>
      <p className="text-white/65 text-[15px] max-w-xl">
        Press, partnerships, tool submissions or general questions — we read every message.
      </p>

      <div className="mt-10 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 surface-card rounded-2xl p-6">
          {sent ? (
            <div className="flex items-center gap-3 py-6">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <p className="text-white/85">Your mail client should have opened. We’ll reply within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="label-eyebrow text-[10px]">Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-white/20"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="label-eyebrow text-[10px]">Email *</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-white/20"
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="block">
                <span className="label-eyebrow text-[10px]">Topic</span>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="mt-1 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-white/20"
                >
                  <option value="">Choose a topic…</option>
                  <option>Submit a tool</option>
                  <option>Partnership</option>
                  <option>Editorial inquiry</option>
                  <option>Feedback or bug</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className="label-eyebrow text-[10px]">Message *</span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-white/20"
                  placeholder="Tell us what’s on your mind…"
                />
              </label>
              <button type="submit" disabled={submitting} className="btn-primary">
                <Send className="h-3.5 w-3.5" /> {submitting ? "Opening…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-3">
          <div className="surface-card rounded-2xl p-5">
            <p className="label-eyebrow mb-2 text-[10px]">Direct</p>
            <a href="mailto:marcwebs.co@gmail.com" className="flex items-center gap-2 text-white/85 hover:text-white">
              <Mail className="h-4 w-4 text-[#A855F7]" /> marcwebs.co@gmail.com
            </a>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <p className="label-eyebrow mb-2 text-[10px]">Response time</p>
            <div className="flex items-center gap-2 text-white/85">
              <MessageSquare className="h-4 w-4 text-[#A855F7]" /> Within 2 business days
            </div>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <p className="label-eyebrow mb-2 text-[10px]">Submit a tool</p>
            <p className="text-white/65 text-[13px] leading-relaxed">
              Send the official URL, a 1-line tagline and your primary category. We review every submission.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
