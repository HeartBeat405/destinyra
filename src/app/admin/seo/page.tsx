import { articlesRepo } from "../../../lib/repositories/articles.repo";
import { buildSeoDashboard } from "../../../lib/seo-analyzer";
import PageHeader from "../../../components/admin/PageHeader";
import SeoDashboard from "../../../components/admin/SeoDashboard";

export const metadata = { title: "SEO — Admin" };

export default async function AdminSeoPage() {
  const articles = await articlesRepo.findAll();
  const data = buildSeoDashboard(articles);

  return (
    <div>
      <PageHeader
        title="SEO Dashboard"
        description="Analyze and improve search optimization across your content."
      />
      <SeoDashboard data={data} />
    </div>
  );
}
