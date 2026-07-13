import Icon from "../ui/Icon";

type Props = {
  label: string;
  value: string | number;
  iconName: string;
  gradient?: string;
  hint?: string;
};

export default function StatCard({
  label,
  value,
  iconName,
  gradient = "from-purple-600 to-cyan-500",
  hint,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
        >
          <Icon name={iconName} className="h-4 w-4 text-white" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
