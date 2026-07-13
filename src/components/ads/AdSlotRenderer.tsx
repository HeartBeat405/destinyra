import type { AdPlacement, AdSlot } from "../../lib/types";
import { getAdSlots } from "../../lib/site-settings";
import AdsenseUnit from "./AdsenseUnit";

// Reusable ad slot renderer for the PUBLIC site. Reads slots from settings,
// filters by placement + enabled, sorts by priority. Renders null when empty.
export default async function AdSlotRenderer({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const slots = (await getAdSlots())
    .filter((s) => s.enabled && s.placement === placement)
    .sort((a, b) => b.priority - a.priority);

  if (slots.length === 0) return null;

  return (
    <div className={`my-8 space-y-4 ${className}`} aria-label="Advertisement">
      {slots.map((s) => (
        <AdUnit key={s.id} slot={s} />
      ))}
    </div>
  );
}

function AdUnit({ slot }: { slot: AdSlot }) {
  if (slot.type === "image" || slot.type === "affiliate") {
    if (!slot.imageUrl) return null;
    // eslint-disable-next-line @next/next/no-img-element
    const img = (
      <img
        src={slot.imageUrl}
        alt={slot.name}
        loading="lazy"
        className="mx-auto max-w-full rounded-xl"
      />
    );
    return slot.link ? (
      <a href={slot.link} target="_blank" rel="noopener noreferrer sponsored">
        {img}
      </a>
    ) : (
      img
    );
  }

  if (slot.type === "html" || slot.type === "script") {
    if (!slot.html) return null;
    // Admin-authored markup (RBAC-gated in the editor).
    return <div dangerouslySetInnerHTML={{ __html: slot.html }} />;
  }

  if (slot.type === "adsense" && slot.publisherId && slot.slotId) {
    return <AdsenseUnit client={slot.publisherId} slotId={slot.slotId} />;
  }

  return null;
}
