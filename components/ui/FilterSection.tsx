import React, { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <div className="py-3 border-b border-[var(--color-border)] last:border-b-0">
    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2.5">
      {title}
    </h3>
    {children}
  </div>
);

export default FilterSection;
