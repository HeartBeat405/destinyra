import Link from "next/link";
import { Plus } from "lucide-react";
import { articlesRepo } from "../../../lib/repositories/articles.repo";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import ArticlesTable from "../../../components/admin/ArticlesTable";

export const metadata = { title: "Articles — Admin" };

export default async function AdminArticlesPage() {
  const articles = await articlesRepo.findAll();

  return (
    <div>
      <PageHeader
        title="Articles"
        description={`${articles.length} total · manage your editorial content`}
        action={
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        }
      />
      <ArticlesTable articles={articles} devMode={isDevMode()} />
    </div>
  );
}
