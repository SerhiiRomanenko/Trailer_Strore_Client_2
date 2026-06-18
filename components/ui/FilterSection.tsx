import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 text-left"
      >
        <span className="text-[13px] font-semibold text-[var(--color-text)]">{title}</span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[400px] pb-3" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
};

export default FilterSection;
