import { homepageBuilderService } from "../../../lib/services/homepage-builder.service";
import { isDevMode } from "../../../lib/auth/session";
import PageHeader from "../../../components/admin/PageHeader";
import HomepageBuilder from "../../../components/admin/HomepageBuilder";

export const metadata = { title: "Homepage Builder — Admin" };

export default async function AdminHomepagePage() {
  const widgets = await homepageBuilderService.getWidgets();

  return (
    <div>
      <PageHeader
        title="Homepage Builder"
        description="Arrange, configure, and toggle the sections shown on your homepage — no code required."
      />
      <HomepageBuilder initialWidgets={widgets} devMode={isDevMode()} />
    </div>
  );
}
