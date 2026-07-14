import PageHeader from "../../../components/admin/PageHeader";
import StatCard from "../../../components/admin/StatCard";
import NewsletterTable from "../../../components/admin/NewsletterTable";
import { newsletterRepo } from "../../../lib/repositories/newsletter.repo";

export const metadata = { title: "Newsletter — Admin" };
export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default async function NewsletterAdminPage() {
  const subscribers = await newsletterRepo.list();

  const now = new Date();
  const ym = now.toISOString().slice(0, 7); // YYYY-MM
  const thisMonth = subscribers.filter((s) => s.createdAt.startsWith(ym)).length;
  const latest = subscribers[0]?.createdAt ?? "—";

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Everyone who signed up through the site newsletter form."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Subscribers"
          value={fmt(subscribers.length)}
          iconName="Mail"
        />
        <StatCard
          label="New This Month"
          value={fmt(thisMonth)}
          iconName="TrendingUp"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          label="Latest Signup"
          value={latest}
          iconName="Clock"
          gradient="from-blue-500 to-indigo-600"
        />
      </div>

      <NewsletterTable subscribers={subscribers} />

      <p className="mt-4 text-center text-xs text-gray-600">
        Export the list to send campaigns from your email tool (Mailchimp,
        Resend, Brevo…). Built-in sending isn&apos;t enabled yet.
      </p>
    </div>
  );
}
