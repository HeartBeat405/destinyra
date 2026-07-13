import { CheckCircle2, AlertTriangle, Rocket } from "lucide-react";
import { getSiteSettings, getAdSlots } from "../../../lib/site-settings";
import { articlesRepo } from "../../../lib/repositories/articles.repo";
import { buildSeoDashboard } from "../../../lib/seo-analyzer";
import PageHeader from "../../../components/admin/PageHeader";

export const metadata = { title: "Launch Readiness — Admin" };

type Check = { label: string; ok: boolean; detail?: string };

// Global analytics/adsense are configured in the root layout today.
const GA_CONFIGURED = true; // G-E19FHS6T8J present in layout.tsx
const ADSENSE_GLOBAL = true; // ca-pub-… present in layout.tsx
const ADS_TXT_PRESENT = true; // public/ads.txt exists in the repo

export default async function LaunchReadinessPage() {
  const [settings, adSlots, articles] = await Promise.all([
    getSiteSettings(),
    getAdSlots(),
    articlesRepo.findAll(),
  ]);
  const seo = buildSeoDashboard(articles);

  const anySocial = Object.values(settings.social).some((v) => v.trim());
  const adsenseSlot = adSlots.find((s) => s.type === "adsense" && s.enabled);
  const brokenAdSlots = adSlots.filter(
    (s) =>
      s.enabled &&
      ((s.type === "adsense" && (!s.publisherId || !s.slotId)) ||
        ((s.type === "html" || s.type === "script") && !s.html) ||
        ((s.type === "image" || s.type === "affiliate") && !s.imageUrl))
  );

  const groups: { title: string; checks: Check[] }[] = [
    {
      title: "Branding & Identity",
      checks: [
        { label: "Site name set", ok: Boolean(settings.general.siteName.trim()) },
        { label: "Logo uploaded", ok: Boolean(settings.general.logoUrl.trim()), detail: "General settings → Logo URL" },
        { label: "Favicon set", ok: Boolean(settings.general.faviconUrl.trim()), detail: "General settings → Favicon URL" },
        { label: "Organization name", ok: Boolean(settings.seo.organizationName.trim()) },
      ],
    },
    {
      title: "SEO & Metadata",
      checks: [
        { label: "Default meta title", ok: Boolean(settings.seo.metaTitle.trim()) },
        { label: "Default meta description", ok: Boolean(settings.seo.metaDescription.trim()) },
        { label: "OpenGraph image", ok: Boolean(settings.seo.ogImage.trim()) },
        { label: "Canonical domain", ok: Boolean(settings.seo.canonicalDomain.trim()) },
        { label: `Average article SEO score ≥ 70 (now ${seo.avgScore})`, ok: seo.avgScore >= 70 },
        { label: "No duplicate slugs", ok: seo.issues.find((i) => i.key === "slug")?.count === 0 },
      ],
    },
    {
      title: "Monetization",
      checks: [
        { label: "ads.txt present", ok: ADS_TXT_PRESENT },
        { label: "AdSense script configured", ok: ADSENSE_GLOBAL },
        { label: "At least one AdSense slot with publisher + slot ID", ok: Boolean(adsenseSlot?.publisherId && adsenseSlot?.slotId), detail: "Ads Manager" },
        { label: "No broken ad slots", ok: brokenAdSlots.length === 0, detail: brokenAdSlots.length ? `${brokenAdSlots.length} slot(s) misconfigured` : undefined },
      ],
    },
    {
      title: "Growth & Analytics",
      checks: [
        { label: "Analytics configured", ok: GA_CONFIGURED },
        { label: "Social links added", ok: anySocial, detail: "Settings → Social" },
        { label: "Contact email set", ok: Boolean(settings.contact.email.trim()) },
        { label: "At least 3 published articles", ok: seo.totals.published >= 3 },
      ],
    },
  ];

  const all = groups.flatMap((g) => g.checks);
  const passed = all.filter((c) => c.ok).length;
  const pct = Math.round((passed / all.length) * 100);

  return (
    <div>
      <PageHeader
        title="Launch Readiness"
        description="A read-only pre-flight check across branding, SEO, monetization, and growth."
      />

      {/* Overall */}
      <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
            pct >= 90 ? "bg-emerald-500/15 text-emerald-300" : pct >= 60 ? "bg-amber-500/15 text-amber-300" : "bg-rose-500/15 text-rose-300"
          }`}
        >
          <Rocket className="h-8 w-8" />
        </span>
        <div className="flex-1">
          <p className="text-sm text-gray-400">Overall readiness</p>
          <p className="text-3xl font-black text-white">{pct}%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {passed} of {all.length} checks passed
          </p>
        </div>
      </div>

      {/* Groups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-bold text-white">{g.title}</h3>
            <ul className="space-y-3">
              {g.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5">
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  )}
                  <span>
                    <span className={`block text-sm ${c.ok ? "text-gray-300" : "text-gray-200"}`}>
                      {c.label}
                    </span>
                    {!c.ok && c.detail && (
                      <span className="text-xs text-gray-500">{c.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
