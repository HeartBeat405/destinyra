"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "../supabase";
import { reviewsRepo } from "../repositories/reviews.repo";
import { getCurrentUser } from "../auth/session";

// Reviews render on the homepage, article, and tool pages.
function revalidateReviews() {
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/tools/[slug]", "page");
}

async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user && ["super_admin", "admin"].includes(user.role));
}

export async function submitReviewAction(input: {
  name: string;
  rating: number;
  comment: string;
}): Promise<{ ok: boolean; message: string }> {
  const name = (input.name ?? "").trim();
  const comment = (input.comment ?? "").trim();
  const rating = Math.round(Number(input.rating));

  if (name.length < 2) {
    return { ok: false, message: "Please enter your name." };
  }
  if (!(rating >= 1 && rating <= 5)) {
    return { ok: false, message: "Please pick a star rating." };
  }
  if (comment.length < 3) {
    return { ok: false, message: "Please write a short comment." };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Reviews aren't available right now." };
  }

  const ok = await reviewsRepo.create({
    name: name.slice(0, 80),
    rating,
    comment: comment.slice(0, 1000),
  });
  if (!ok) {
    return { ok: false, message: "Couldn't submit your review. Please try again." };
  }

  revalidatePath("/");
  return { ok: true, message: "Thank you — your review has been posted!" };
}

// ---------- Admin ----------

export async function setReviewFlagsAction(
  id: string,
  patch: { featured?: boolean; approved?: boolean }
): Promise<{ ok: boolean; message?: string }> {
  if (!(await isAdmin())) return { ok: false, message: "Not allowed." };
  const ok = await reviewsRepo.setFlags(id, patch);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateReviews();
  return { ok: true };
}

export async function deleteReviewAction(
  id: string
): Promise<{ ok: boolean; message?: string }> {
  if (!(await isAdmin())) return { ok: false, message: "Not allowed." };
  const ok = await reviewsRepo.remove(id);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateReviews();
  return { ok: true };
}
