import { categoryService } from "../../../../lib/services/category.service";
import { authorsRepo } from "../../../../lib/repositories/authors.repo";
import { tagService } from "../../../../lib/services/tag.service";
import { isDevMode } from "../../../../lib/auth/session";
import ArticleEditor from "../../../../components/admin/ArticleEditor";

export const metadata = { title: "New Article — Admin" };

export default async function NewArticlePage() {
  const [categories, authors, tags] = await Promise.all([
    categoryService.getAll(),
    authorsRepo.findAll(),
    tagService.getAll(),
  ]);

  return (
    <ArticleEditor
      categories={categories.map((c) => ({
        value: c.id,
        label: c.name,
        iconName: c.iconName,
        gradient: c.gradient,
      }))}
      authors={authors.map((a) => ({ value: a.id, label: a.name, hint: a.role }))}
      availableTags={tags.map((t) => t.name)}
      devMode={isDevMode()}
    />
  );
}
