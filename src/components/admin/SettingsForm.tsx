"use client";

import { useState, useTransition } from "react";
import { Save, Check, AlertTriangle, ImageIcon } from "lucide-react";
import type { SiteSettings, Media } from "../../lib/types";
import {
  LANGUAGE_OPTIONS,
  TWITTER_CARD_OPTIONS,
  THEME_OPTIONS,
} from "../../data/settings";
import { saveSettingsAction } from "../../lib/actions/settings.actions";
import {
  TextField,
  TextAreaField,
  SelectField,
  ColorField,
} from "./form/Fields";
import MediaPicker from "./MediaPicker";

// Image field: text URL + Browse (Media Library) + live preview. Kept at
// module scope so typing in the input never loses focus on re-render.
function ImageField({
  label,
  value,
  onChange,
  onBrowse,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBrowse: () => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pick from media or paste a URL"
          className="editor-input"
        />
        <button
          type="button"
          onClick={onBrowse}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Browse
        </button>
      </div>
      {hint ? <span className="mt-1 block text-[11px] text-gray-500">{hint}</span> : null}
      {value.trim() ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt={`${label} preview`}
          className="mt-2 h-12 w-auto rounded border border-white/10 bg-white/5 object-contain p-1"
        />
      ) : null}
    </label>
  );
}

type Section = keyof SiteSettings;
const TABS: { key: Section; label: string }[] = [
  { key: "general", label: "General" },
  { key: "brand", label: "Brand" },
  { key: "seo", label: "SEO Defaults" },
  { key: "social", label: "Social" },
  { key: "contact", label: "Contact" },
];

export default function SettingsForm({
  initial,
  devMode,
}: {
  initial: SiteSettings;
  devMode: boolean;
}) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [tab, setTab] = useState<Section>("general");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Which general-tab image field the media picker targets.
  const [picker, setPicker] = useState<null | "logoUrl" | "faviconUrl">(null);

  function set<S extends Section, K extends keyof SiteSettings[S]>(
    section: S,
    key: K,
    value: SiteSettings[S][K]
  ) {
    setS((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setSaved(false);
  }

  // Validation warnings (Phase 6)
  const warnings: string[] = [];
  if (!s.general.logoUrl.trim()) warnings.push("Logo not set");
  if (!s.general.faviconUrl.trim()) warnings.push("Favicon not set");
  if (!s.seo.metaTitle.trim() || !s.seo.metaDescription.trim())
    warnings.push("Default meta title/description incomplete");
  if (!s.seo.organizationName.trim()) warnings.push("Organization name missing");

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveSettingsAction(s);
      if (res.ok) setSaved(true);
      else setMessage(res.message ?? "Save failed.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
      {/* Tabs */}
      <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Settings sections">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          {tab === "general" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="siteName" label="Site Name" required value={s.general.siteName} onChange={(v) => set("general", "siteName", v)} />
              <TextField id="tagline" label="Tagline" value={s.general.tagline} onChange={(v) => set("general", "tagline", v)} />
              <ImageField label="Logo" value={s.general.logoUrl} onChange={(v) => set("general", "logoUrl", v)} onBrowse={() => setPicker("logoUrl")} hint="Transparent PNG, ~320×80 px (renders 32px tall in the header). Change anytime — no redeploy." />
              <ImageField label="Favicon" value={s.general.faviconUrl} onChange={(v) => set("general", "faviconUrl", v)} onBrowse={() => setPicker("faviconUrl")} hint="Square PNG/ICO, 64×64 px (browser-tab icon)." />
              <SelectField id="language" label="Default Language" value={s.general.language} onChange={(v) => set("general", "language", v)} options={LANGUAGE_OPTIONS} />
              <TextField id="timezone" label="Timezone" value={s.general.timezone} onChange={(v) => set("general", "timezone", v)} />
              <TextField id="copyright" label="Copyright" value={s.general.copyright} onChange={(v) => set("general", "copyright", v)} />
              <TextAreaField id="footerText" label="Footer Text" value={s.general.footerText} onChange={(v) => set("general", "footerText", v)} rows={2} />
            </div>
          )}

          <MediaPicker
            open={picker !== null}
            onClose={() => setPicker(null)}
            onSelect={(m: Media) => {
              if (picker) set("general", picker, m.url);
              setPicker(null);
            }}
          />

          {tab === "brand" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField id="primaryColor" label="Primary Color" value={s.brand.primaryColor} onChange={(v) => set("brand", "primaryColor", v)} />
              <ColorField id="secondaryColor" label="Secondary Color" value={s.brand.secondaryColor} onChange={(v) => set("brand", "secondaryColor", v)} />
              <ColorField id="accentColor" label="Accent Color" value={s.brand.accentColor} onChange={(v) => set("brand", "accentColor", v)} />
              <TextField id="buttonRadius" label="Button Radius" value={s.brand.buttonRadius} onChange={(v) => set("brand", "buttonRadius", v)} hint="e.g. 9999px" />
              <TextField id="containerWidth" label="Container Width" value={s.brand.containerWidth} onChange={(v) => set("brand", "containerWidth", v)} hint="e.g. 80rem" />
              <SelectField id="theme" label="Default Theme" value={s.brand.theme} onChange={() => set("brand", "theme", "light")} options={THEME_OPTIONS} />
            </div>
          )}

          {tab === "seo" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="metaTitle" label="Default Meta Title" value={s.seo.metaTitle} onChange={(v) => set("seo", "metaTitle", v)} />
              <TextField id="orgName" label="Organization Name" value={s.seo.organizationName} onChange={(v) => set("seo", "organizationName", v)} />
              <TextAreaField id="metaDesc" label="Default Meta Description" value={s.seo.metaDescription} onChange={(v) => set("seo", "metaDescription", v)} rows={2} />
              <TextField id="ogImage" label="Default OpenGraph Image" value={s.seo.ogImage} onChange={(v) => set("seo", "ogImage", v)} />
              <SelectField id="twitterCard" label="Twitter Card" value={s.seo.twitterCard} onChange={(v) => set("seo", "twitterCard", v as SiteSettings["seo"]["twitterCard"])} options={TWITTER_CARD_OPTIONS} />
              <TextField id="canonicalDomain" label="Canonical Domain" value={s.seo.canonicalDomain} onChange={(v) => set("seo", "canonicalDomain", v)} />
            </div>
          )}

          {tab === "social" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="facebook" label="Facebook" value={s.social.facebook} onChange={(v) => set("social", "facebook", v)} />
              <TextField id="instagram" label="Instagram" value={s.social.instagram} onChange={(v) => set("social", "instagram", v)} />
              <TextField id="linkedin" label="LinkedIn" value={s.social.linkedin} onChange={(v) => set("social", "linkedin", v)} />
              <TextField id="x" label="X (Twitter)" value={s.social.x} onChange={(v) => set("social", "x", v)} />
              <TextField id="youtube" label="YouTube" value={s.social.youtube} onChange={(v) => set("social", "youtube", v)} />
              <TextField id="tiktok" label="TikTok" value={s.social.tiktok} onChange={(v) => set("social", "tiktok", v)} />
              <TextField id="github" label="GitHub" value={s.social.github} onChange={(v) => set("social", "github", v)} />
            </div>
          )}

          {tab === "contact" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="email" label="Email" value={s.contact.email} onChange={(v) => set("contact", "email", v)} />
              <TextField id="phone" label="Phone" value={s.contact.phone} onChange={(v) => set("contact", "phone", v)} />
              <TextAreaField id="address" label="Address" value={s.contact.address} onChange={(v) => set("contact", "address", v)} rows={2} />
              <TextField id="supportUrl" label="Support URL" value={s.contact.supportUrl} onChange={(v) => set("contact", "supportUrl", v)} />
            </div>
          )}
        </div>

        {/* Warnings + save */}
        {warnings.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              Recommendations
            </p>
            <ul className="space-y-1">
              {warnings.map((w) => (
                <li key={w} className="flex items-center gap-1.5 text-sm text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {devMode && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
            Dev mode — editable, but saving needs Supabase.
          </div>
        )}
        {saved && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-200">
            <Check className="h-4 w-4" /> Settings saved.
          </div>
        )}
        {message && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">
            <AlertTriangle className="h-4 w-4" /> {message}
          </div>
        )}

        <div className="mt-5">
          <button onClick={save} disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save className="h-4 w-4" />
            {pending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
