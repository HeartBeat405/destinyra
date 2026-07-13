import Link from "next/link";
import { ButtonLink } from "../components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-7xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-2xl font-black tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <Link
          href="/articles"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          Browse articles →
        </Link>
      </div>
    </main>
  );
}
