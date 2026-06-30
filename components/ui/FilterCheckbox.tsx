import React from "react";

interface FilterCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ checked, onChange, label }) => (
  <label
    className={`flex items-center gap-2.5 cursor-pointer px-2.5 py-1.5 rounded-lg transition-all select-none ${
      checked
        ? "bg-[var(--color-primary)]/10"
        : "hover:bg-[var(--color-surface-hover)]"
    }`}
    onClick={(e) => {
      e.preventDefault();
      onChange();
    }}
  >
    <span
      className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        checked
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
          : "border-[var(--color-border)]"
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
    <span
      className={`text-[13px] leading-tight transition-colors ${
        checked
          ? "text-[var(--color-primary)] font-medium"
          : "text-[var(--color-text-secondary)]"
      }`}
    >
      {label}
    </span>
  </label>
);

export default FilterCheckbox;
