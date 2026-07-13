import { authorService } from "../../../lib/services/author.service";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import AuthorsManager from "../../../components/admin/AuthorsManager";

export const metadata = { title: "Authors — Admin" };

export default async function AdminAuthorsPage() {
  const authors = await authorService.getAllAdmin();

  return (
    <div>
      <PageHeader
        title="Authors"
        description={`${authors.length} authors · profiles, social links, and SEO`}
      />
      <AuthorsManager authors={authors} devMode={isDevMode()} />
    </div>
  );
}
