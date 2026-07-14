import { homepageBuilderService } from "../lib/services/homepage-builder.service";
import WidgetRenderer from "../components/home/WidgetRenderer";
import NewsHighlight from "../components/home/NewsHighlight";
import AdSlotRenderer from "../components/ads/AdSlotRenderer";

// Data-driven homepage: the section order, titles, and visibility come from
// the Homepage Builder (settings) — no hardcoded layout. Falls back to the
// default widget set until an admin customizes it.
export default async function HomePage() {
  const { widgets, sections } = await homepageBuilderService.getPublicHomepage();

  return (
    <main>
      <NewsHighlight />
      <div className="mx-auto max-w-7xl px-6">
        <AdSlotRenderer placement="home-hero" />
      </div>
      {widgets.map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} sections={sections} />
      ))}
      <div className="mx-auto max-w-7xl px-6">
        <AdSlotRenderer placement="home-footer" />
      </div>
    </main>
  );
}
