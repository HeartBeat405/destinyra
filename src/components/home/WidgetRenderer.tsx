import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import type { HomepageWidget, Article } from "../../lib/types";
import type { HomepageSections } from "../../lib/services/homepage.service";

import HeroCarousel, { type HeroSlide } from "./HeroCarousel";
import FeaturedCard from "../articles/FeaturedCard";
import ArticleCard from "../articles/ArticleCard";
import NewsCard from "../news/NewsCard";
import CategoryCard from "../categories/CategoryCard";
import ToolCard from "../tools/ToolCard";
import SectionHeading from "../ui/SectionHeading";
import Newsletter from "../ui/Newsletter";

type Props = {
  widget: HomepageWidget;
  sections: HomepageSections;
};

// Renders a single homepage widget by type, reusing existing components.
export default function WidgetRenderer({ widget, sections }: Props) {
  const max = widget.maxItems;

  switch (widget.type) {
    case "hero": {
      const source = widget.source ?? "latest";
      const limit = widget.maxItems ?? 5;
      let heroSlides: HeroSlide[];
      if (source === "news") {
        if (sections.news.length === 0) return null;
        heroSlides = sections.news.slice(0, limit).map((n) => ({
          id: n.id,
          title: n.title,
          excerpt: n.excerpt,
          image: n.imageUrl || undefined,
          href: n.url,
          external: true,
          categoryName: n.sourceName,
          categoryIcon: "Newspaper",
          textColor: "auto",
          cta: "Read at source",
        }));
      } else {
        const pool =
          source === "featured"
            ? ([sections.hero, ...sections.secondaryFeatured].filter(
                Boolean
              ) as Article[])
            : source === "trending"
              ? sections.trending
              : sections.latest;
        heroSlides = pool.slice(0, limit).map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          image: a.image || undefined,
          href: `/articles/${a.slug}`,
          external: false,
          categoryName: a.category?.name,
          categoryIcon: a.category?.iconName,
          textColor: a.heroTextColor ?? "auto",
          cta: "Read article",
        }));
      }
      return <HeroCarousel slides={heroSlides} />;
    }

    case "featured":
    case "editors-choice": {
      const hero = sections.hero;
      if (!hero) return null;
      const secondary = sections.secondaryFeatured.slice(0, max ?? 2);
      return (
        <Wrap widget={widget} defaultTitle="Featured Stories" hrefAll="/articles">
          <FeaturedCard article={hero} />
          {widget.type === "featured" && secondary.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </Wrap>
      );
    }

    case "trending":
      return (
        <Wrap widget={widget} defaultTitle="Trending Now" hrefAll="/articles">
          <Grid>
            {sections.trending.slice(0, max ?? 4).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </Grid>
        </Wrap>
      );

    case "latest":
      return (
        <Wrap widget={widget} defaultTitle="Latest Articles" hrefAll="/articles">
          <Grid>
            {sections.latest.slice(0, max ?? 6).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </Grid>
        </Wrap>
      );

    case "popular":
      return (
        <Section widget={widget}>
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand" />
            <h2 className="text-2xl font-black tracking-tight text-ink">
              {widget.title ?? "Most Read"}
            </h2>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-4 shadow-card">
            <ol className="divide-y divide-line">
              {sections.popular.slice(0, max ?? 5).map((a, i) => (
                <li key={a.id} className="flex items-start gap-4 py-3">
                  <span className="text-2xl font-black text-line">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <ArticleCard article={a} variant="row" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      );

    case "categories":
      return (
        <Wrap widget={widget} defaultTitle="Categories" hrefAll="/categories">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sections.categories.slice(0, max ?? 8).map((c) => (
              <CategoryCard key={c.id} category={c} count={c.count} />
            ))}
          </div>
        </Wrap>
      );

    case "tools":
      return (
        <Wrap widget={widget} defaultTitle="Featured Tools" hrefAll="/tools">
          <Grid cols={3}>
            {sections.tools.slice(0, max ?? 3).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </Grid>
        </Wrap>
      );

    case "news":
      if (sections.news.length === 0) return null;
      return (
        <Wrap widget={widget} defaultTitle="Latest News" hrefAll="/news">
          <Grid>
            {sections.news.slice(0, max ?? 4).map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </Grid>
        </Wrap>
      );

    case "newsletter":
      return (
        <Section widget={widget}>
          <Newsletter />
        </Section>
      );

    case "quote":
      if (!widget.quote) return null;
      return (
        <Section widget={widget}>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-2xl font-medium leading-relaxed text-ink sm:text-3xl">
              “{widget.quote}”
            </p>
            {widget.quoteAuthor && (
              <footer className="mt-4 text-sm text-muted">
                — {widget.quoteAuthor}
              </footer>
            )}
          </blockquote>
        </Section>
      );

    case "banner":
      return (
        <Section widget={widget}>
          <div className="rounded-4xl border border-line bg-brand-50 p-8 text-center sm:p-12">
            <h3 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
              {widget.bannerText ?? widget.title ?? "Banner"}
            </h3>
            {widget.bannerHref && (
              <Link
                href={widget.bannerHref}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
              >
                {widget.bannerCtaLabel ?? "Learn more"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </Section>
      );

    case "advertisement":
      return (
        <Section widget={widget}>
          <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface text-xs uppercase tracking-widest text-muted">
            Ad slot{widget.adSlot ? ` · ${widget.adSlot}` : ""}
          </div>
        </Section>
      );

    case "custom-html":
      if (!widget.html) return null;
      return (
        <Section widget={widget}>
          {/* Admin-authored markup (RBAC-gated). */}
          <div dangerouslySetInnerHTML={{ __html: widget.html }} />
        </Section>
      );

    default:
      return null;
  }
}

function Section({
  widget,
  children,
}: {
  widget: HomepageWidget;
  children: React.ReactNode;
}) {
  const bg =
    widget.background === "muted"
      ? "bg-surface"
      : widget.background === "gradient"
        ? "bg-brand-50"
        : "";
  return (
    <section className={bg}>
      <div className="mx-auto max-w-7xl px-6 py-14">{children}</div>
    </section>
  );
}

function Wrap({
  widget,
  defaultTitle,
  hrefAll,
  children,
}: {
  widget: HomepageWidget;
  defaultTitle: string;
  hrefAll?: string;
  children: React.ReactNode;
}) {
  return (
    <Section widget={widget}>
      <SectionHeading
        title={widget.title ?? defaultTitle}
        subtitle={widget.subtitle}
        href={hrefAll}
      />
      {children}
    </Section>
  );
}

function Grid({
  children,
  cols = 4,
}: {
  children: React.ReactNode;
  cols?: 3 | 4;
}) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
    >
      {children}
    </div>
  );
}
