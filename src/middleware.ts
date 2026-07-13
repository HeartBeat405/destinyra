import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/db/supabase-middleware";

// Protects /admin. When Supabase isn't configured we pass through so the
// dev-mode session (super_admin) keeps the panel usable locally.
const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(request: NextRequest) {
  if (!configured) return NextResponse.next();

  const { response, user } = await updateSession(request);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
