import { notFound } from "next/navigation";
import { articleService } from "../../../../lib/services/article.service";
import { categoryService } from "../../../../lib/services/category.service";
import { authorsRepo } from "../../../../lib/repositories/authors.repo";
import { tagService } from "../../../../lib/services/tag.service";
import { isDevMode } from "../../../../lib/auth/session";
import ArticleEditor from "../../../../components/admin/ArticleEditor";

export const metadata = { title: "Edit Article — Admin" };

type Params = { params: Promise<{ slug: string }> };

export default async function EditArticlePage({ params }: Params) {
  const { slug } = await params;

  const [article, categories, authors, tags] = await Promise.all([
    articleService.getBySlug(slug),
    categoryService.getAll(),
    authorsRepo.findAll(),
    tagService.getAll(),
  ]);

  if (!article) notFound();

  const related = await articleService.getRelated(article, 4);

  return (
    <ArticleEditor
      article={article}
      categories={categories.map((c) => ({
        value: c.id,
        label: c.name,
        iconName: c.iconName,
        gradient: c.gradient,
      }))}
      authors={authors.map((a) => ({ value: a.id, label: a.name, hint: a.role }))}
      availableTags={tags.map((t) => t.name)}
      relatedArticles={related.map((r) => ({ title: r.title, slug: r.slug }))}
      devMode={isDevMode()}
    />
  );
}
