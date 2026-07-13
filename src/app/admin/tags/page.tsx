import { tagService } from "../../../lib/services/tag.service";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import TagsManager from "../../../components/admin/TagsManager";

export const metadata = { title: "Tags — Admin" };

export default async function AdminTagsPage() {
  const tags = await tagService.getAllAdmin();

  return (
    <div>
      <PageHeader
        title="Tags"
        description={`${tags.length} tags · manage, merge, and track usage`}
      />
      <TagsManager tags={tags} devMode={isDevMode()} />
    </div>
  );
}
