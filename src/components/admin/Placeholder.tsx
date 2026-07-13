import Icon from "../ui/Icon";
import PageHeader from "./PageHeader";

type Props = {
  title: string;
  iconName: string;
  description?: string;
  milestone?: string;
};

// Stub for admin sections not yet implemented. Keeps the sidebar fully
// navigable and clearly communicates what's coming and when.
export default function Placeholder({
  title,
  iconName,
  description,
  milestone = "Milestone 2",
}: Props) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/40 to-cyan-500/30">
          <Icon name={iconName} className="h-8 w-8 text-white" />
        </span>
        <h2 className="text-lg font-bold">{title} module</h2>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          This section is scaffolded and reserved. Full management lands in{" "}
          <span className="font-semibold text-purple-300">{milestone}</span>,
          once Supabase write actions and auth are wired.
        </p>
      </div>
    </div>
  );
}
