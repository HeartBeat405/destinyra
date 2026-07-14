import { isSupabaseConfigured, createAdminClient } from "../supabase";

export type Subscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  source: string;
  createdAt: string;
};

// Newsletter data access. Writes/reads go through the service-role client:
// the table's "anyone subscribe" / "staff read" RLS would also work, but the
// admin client is reliable for both the public signup and the admin list.
export const newsletterRepo = {
  async subscribe(
    email: string,
    source = "website"
  ): Promise<"ok" | "duplicate" | "error"> {
    if (!isSupabaseConfigured) return "error";
    const db = createAdminClient();
    if (!db) return "error";
    const { error } = await db.from("newsletter").insert({ email, source });
    if (!error) return "ok";
    if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
      return "duplicate";
    }
    return "error";
  },

  async list(limit = 5000): Promise<Subscriber[]> {
    if (!isSupabaseConfigured) return [];
    const db = createAdminClient();
    if (!db) return [];
    const { data } = await db
      .from("newsletter")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map((r: any) => ({
      id: r.id,
      email: r.email,
      confirmed: Boolean(r.confirmed),
      source: r.source ?? "website",
      createdAt: String(r.created_at ?? "").slice(0, 10),
    }));
  },
};
