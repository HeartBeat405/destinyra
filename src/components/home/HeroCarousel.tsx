"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Article } from "../../lib/types";
import Icon from "../ui/Icon";
import { ButtonLink } from "../ui/Button";

// Bright, light gradient backdrops used when an article has no banner image.
const BRIGHT = [
  "from-amber-100 via-white to-emerald-100",
  "from-emerald-100 via-white to-sky-100",
  "from-yellow-100 via-white to-lime-100",
  "from-rose-100 via-white to-amber-100",
  "from-sky-100 via-white to-violet-100",
];

// Homepage hero: an auto-rotating showcase of the latest articles. Each
// slide uses the article's banner image (or a bright gradient fallback) and
// links to the article. Falls back to a simple intro when there are none.
export default function HeroCarousel({ articles }: { articles: Article[] }) {
  const slides = articles.slice(0, 5);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  // No articles yet → clean intro hero.
  if (slides.length === 0) {
    return (
      <section className="border-b border-line bg-gradient-to-br from-amber-50 via-white to-emerald-50">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pt-24">
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl">
            Stories that help you understand yourself
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Thoughtful writing on growth, relationships, and spirituality —
            paired with interactive tools that turn insight into action.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/articles" size="lg">
              Start Reading
            </ButtonLink>
            <ButtonLink href="/tools" size="lg" variant="outline">
              Explore Tools
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  const go = (n: number) =>
    setI((p) => (p + n + slides.length) % slides.length);

  return (
    <section className="relative border-b border-line">
      <div className="relative h-[440px] overflow-hidden sm:h-[520px]">
        {slides.map((a, idx) => {
          const active = idx === i;
          const hasImg = Boolean(a.image);
          return (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* Background */}
              {hasImg ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.image}
                    alt={a.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                </>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${BRIGHT[idx % BRIGHT.length]}`}
                />
              )}

              {/* Content */}
              <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-16 sm:pb-20">
                <div className={hasImg ? "text-white" : "text-ink"}>
                  {a.category && (
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        hasImg
                          ? "bg-white/20 text-white backdrop-blur"
                          : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      <Icon name={a.category.iconName} className="h-3.5 w-3.5" />
                      {a.category.name}
                    </span>
                  )}
                  <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-[1.12] sm:text-5xl">
                    {a.title}
                  </h1>
                  <p
                    className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${
                      hasImg ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {a.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow-card backdrop-blur transition hover:bg-white sm:left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow-card backdrop-blur transition hover:bg-white sm:right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
