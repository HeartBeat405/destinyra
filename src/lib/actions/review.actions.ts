"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "../supabase";
import { reviewsRepo } from "../repositories/reviews.repo";

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
