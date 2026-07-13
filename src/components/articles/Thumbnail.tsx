import Icon from "../ui/Icon";

type Props = {
  iconName: string;
  gradient: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

// Editorial placeholder tile (light). A clean neutral surface with a thin
// colored accent and a brand-tinted icon chip. Swappable for real images
// (Media Library) later.
export default function Thumbnail({
  iconName,
  gradient,
  className = "",
  size = "md",
}: Props) {
  const chip =
    size === "lg" ? "h-16 w-16" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const glyph =
    size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[#f2f3f8] ${className}`}
    >
      {/* thin colored accent for category identity */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
      <span
        className={`flex items-center justify-center rounded-2xl bg-white text-brand shadow-card ${chip}`}
      >
        <Icon name={iconName} className={glyph} strokeWidth={1.75} />
      </span>
    </div>
  );
}
