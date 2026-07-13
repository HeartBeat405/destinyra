import { mediaService } from "../../../lib/services/media.service";
import { isDevMode } from "../../../lib/auth/session";
import { MEDIA_FOLDERS } from "../../../data/media";
import PageHeader from "../../../components/admin/PageHeader";
import MediaLibrary from "../../../components/admin/MediaLibrary";

export const metadata = { title: "Media — Admin" };

export default async function AdminMediaPage() {
  const [items, unused] = await Promise.all([
    mediaService.list(),
    mediaService.getUnusedIds(),
  ]);

  // Default folders + any custom folders already present in the data.
  const folders = Array.from(
    new Set<string>([...MEDIA_FOLDERS, ...items.map((m) => m.folder)])
  );

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={`${items.length} file(s) · upload, organize, and reuse across the site`}
      />
      <MediaLibrary
        initialMedia={items}
        folders={folders}
        unusedIds={[...unused]}
        devMode={isDevMode()}
      />
    </div>
  );
}
