import type { Metadata } from "next";
import { Mail, MessageCircle, Sparkles, Phone, MapPin } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getSiteSettings } from "../../lib/site-settings";

export const metadata: Metadata = {
  title: "Contact — Destinyra",
  description:
    "Get in touch — questions, feedback, partnerships, or just to say hello.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { contact } = await getSiteSettings();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Let&apos;s talk
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Questions, feedback, or partnership ideas? We&apos;d love to hear
          from you.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <a
          href={`mailto:${contact.email || "hello@destinyra.app"}`}
          className="group rounded-3xl border border-line bg-surface p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-ink">Email us</h2>
          <p className="mt-1 text-sm text-muted">
            {contact.email || "hello@destinyra.app"}
          </p>
        </a>

        {contact.phone ? (
          <a
            href={`tel:${contact.phone}`}
            className="group rounded-3xl border border-line bg-surface p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand2 text-white">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Call us</h2>
            <p className="mt-1 text-sm text-muted">{contact.phone}</p>
          </a>
        ) : (
          <div className="rounded-3xl border border-line bg-surface p-7 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand2 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Feedback</h2>
            <p className="mt-1 text-sm text-muted">
              Tell us what you&apos;d love to read or which tool you want next.
            </p>
          </div>
        )}
      </div>

      {contact.address && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <MapPin className="h-4 w-4" />
          {contact.address}
        </p>
      )}

      <form className="mt-8 rounded-3xl border border-line bg-surface p-8 shadow-card">
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Your name"
            className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
          />
          <input
            type="email"
            placeholder="Your email"
            className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
          />
        </div>
        <textarea
          placeholder="Your message"
          rows={5}
          className="mt-5 w-full rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
        />
        <Button type="submit" size="lg" className="mt-5">
          <Sparkles className="h-4 w-4" />
          Send message
        </Button>
      </form>
    </main>
  );
}
