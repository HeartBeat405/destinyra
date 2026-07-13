import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section";
};

// Surface card primitive — white, soft border + shadow, optional hover lift.
export default function Card({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
}: Props) {
  return (
    <Tag
      className={`rounded-3xl border border-line bg-surface shadow-card ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
