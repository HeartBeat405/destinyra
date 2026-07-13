import { toolService } from "../../../lib/services/tool.service";
import { categoryService } from "../../../lib/services/category.service";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import ToolsManager from "../../../components/admin/ToolsManager";

export const metadata = { title: "Tools — Admin" };

export default async function AdminToolsPage() {
  const [tools, categories] = await Promise.all([
    toolService.getAllAdmin(),
    categoryService.getAll(),
  ]);

  return (
    <div>
      <PageHeader
        title="Tools"
        description={`${tools.length} tools · fully CMS-driven`}
      />
      <ToolsManager tools={tools} categories={categories} devMode={isDevMode()} />
    </div>
  );
}
