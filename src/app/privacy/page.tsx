export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
        Privacy Policy
      </h1>

      <div className="mt-8 space-y-6 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <p className="leading-8 text-muted">
          Destinyra respects your privacy and does not store personal
          numerology results or sensitive personal data.
        </p>
        <p className="leading-8 text-muted">
          Some anonymous analytics data may be collected to improve website
          performance, user experience, and feature quality.
        </p>
        <p className="leading-8 text-muted">
          Third-party services such as Google Analytics or Google AdSense may
          use cookies to personalize content and analyze traffic.
        </p>
        <p className="leading-8 text-muted">
          By using Destinyra, you agree to this privacy policy and the use of
          cookies for analytics and advertising purposes.
        </p>
        <div className="border-t border-line pt-6">
          <p className="text-brand-700">destinyra.vercel.app</p>
        </div>
      </div>
    </main>
  );
}
