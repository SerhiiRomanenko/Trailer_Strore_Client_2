import React from "react";

interface TrailerLoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const TrailerLoading: React.FC<TrailerLoadingProps> = ({
  size = "md",
  label = "Завантаження...",
}) => {
  const dim = size === "sm" ? 40 : size === "lg" ? 80 : 56;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <svg
        width={dim}
        height={dim * 0.6}
        viewBox="0 0 120 60"
        className="text-[var(--color-primary)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Road dashes */}
        <line x1="0" y1="52" x2="120" y2="52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.25">
          <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.6s" repeatCount="indefinite" />
        </line>
        {/* Trailer body */}
        <rect x="4" y="18" width="68" height="30" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0;-2,0;0,0" dur="1.2s" repeatCount="indefinite" />
        </rect>
        {/* Truck cab */}
        <path d="M72 28 L86 28 Q94 28 96 34 L100 48 L72 48 Z" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0;-2,0;0,0" dur="1.2s" repeatCount="indefinite" />
        </path>
        {/* Windshield */}
        <rect x="88" y="30" width="10" height="10" rx="2" fill="currentColor" opacity="0.4" />
        {/* Wheels */}
        <g>
          <circle cx="20" cy="50" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="50" r="2.5" fill="currentColor" opacity="0.5" />
          <circle cx="38" cy="50" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="38" cy="50" r="2.5" fill="currentColor" opacity="0.5" />
          <circle cx="90" cy="50" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="90" cy="50" r="2.5" fill="currentColor" opacity="0.5" />
          <animateTransform attributeName="transform" type="rotate" values="0 20 50;360 20 50" dur="0.8s" repeatCount="indefinite" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 38 50;360 38 50" dur="0.8s" repeatCount="indefinite" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 90 50;360 90 50" dur="0.8s" repeatCount="indefinite" />
        </g>
      </svg>
      {label && (
        <span className="text-sm text-[var(--color-text-secondary)] animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default TrailerLoading;
