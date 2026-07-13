import Link from "next/link";
import {
  Compass,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Music2,
  Mail,
} from "lucide-react";
import { categories } from "../../data/categories";
import Icon from "../ui/Icon";
import { DEFAULT_SETTINGS } from "../../data/settings";
import type { SiteSettings } from "../../lib/types";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Categories", href: "/categories" },
      { label: "Tools", href: "/tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function Footer({
  settings = DEFAULT_SETTINGS,
}: {
  settings?: SiteSettings;
}) {
  const { general, social, contact } = settings;

  const socials = [
    { href: social.facebook, Icon: Facebook, label: "Facebook" },
    { href: social.instagram, Icon: Instagram, label: "Instagram" },
    { href: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: social.x, Icon: Twitter, label: "X" },
    { href: social.youtube, Icon: Youtube, label: "YouTube" },
    { href: social.tiktok, Icon: Music2, label: "TikTok" },
    { href: social.github, Icon: Github, label: "GitHub" },
  ].filter((s) => s.href.trim().length > 0);

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              {general.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={general.logoUrl} alt={general.siteName} className="h-8 w-auto" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white">
                  <Compass className="h-5 w-5" strokeWidth={2} />
                </span>
              )}
              <span className="text-lg font-black tracking-tight text-ink">
                {general.siteName}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted">
              {general.footerText}
            </p>

            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map(({ href, Icon: SocialIcon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    <SocialIcon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Topics
            </h4>
            <ul className="space-y-3">
              {categories.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <Icon name={c.iconName} className="h-3.5 w-3.5" />
                    {c.name}
                  </Link>
                </li>
              ))}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row">
          <p>{general.copyright}</p>
          <p className="text-brand-700">
            {(settings.seo.canonicalDomain || "").replace(/^https?:\/\//, "")}
          </p>
        </div>
      </div>
    </footer>
  );
}
