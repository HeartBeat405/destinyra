import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { newsService } from "../../../../lib/services/news.service";

export const dynamic = "force-dynamic";

// Scheduled by Vercel Cron (vercel.json). Vercel sends
// `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set. Can also be
// triggered manually with `?key=<CRON_SECRET>` for an on-demand refresh.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    const key = new URL(req.url).searchParams.get("key");
    if (auth !== `Bearer ${secret}` && key !== secret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  const result = await newsService.refresh();
  // Refresh the pages that show news.
  revalidatePath("/news");
  revalidatePath("/");

  return NextResponse.json({ ok: true, ...result });
}
