"use client";

import { cn } from "@/lib/utils";

interface MatchBadgeProps {
  percent: number;
  size?: "sm" | "lg";
  className?: string;
}

export function MatchBadge({
  percent,
  size = "sm",
  className,
}: MatchBadgeProps) {
  const getColor = (value: number) => {
    if (value >= 90) return "text-green-600 bg-green-100";
    if (value >= 80) return "text-green-500 bg-green-50";
    if (value >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        getColor(percent),
        size === "sm" ? "px-2 py-1 text-xs" : "px-4 py-2 text-lg",
        className
      )}
    >
      {percent}% MATCH
    </div>
  );
}
