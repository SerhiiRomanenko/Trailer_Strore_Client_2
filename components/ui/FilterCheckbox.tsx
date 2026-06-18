import React from "react";

interface FilterCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer py-0.5 group">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-3.5 w-3.5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
    />
    <span className="text-[13px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors">
      {label}
    </span>
  </label>
);

export default FilterCheckbox;
