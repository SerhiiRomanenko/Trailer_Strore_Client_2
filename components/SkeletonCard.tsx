import React from "react";

const SkeletonCard: React.FC = () => (
  <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
    <div className="skeleton" style={{ aspectRatio: "1" }} />
    <div className="p-2.5 space-y-2">
      <div className="skeleton h-2.5 w-16" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-5 w-20" />
      <div className="skeleton h-8 w-full rounded-md" />
    </div>
  </div>
);

export default SkeletonCard;
