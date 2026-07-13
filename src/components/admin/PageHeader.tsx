import React from "react";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
