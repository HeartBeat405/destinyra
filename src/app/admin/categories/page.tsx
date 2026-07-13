import { categoryService } from "../../../lib/services/category.service";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import CategoriesManager from "../../../components/admin/CategoriesManager";

export const metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await categoryService.getAllAdmin();

  return (
    <div>
      <PageHeader
        title="Categories"
        description={`${categories.length} categories · create, organize, and manage`}
      />
      <CategoriesManager categories={categories} devMode={isDevMode()} />
    </div>
  );
}
