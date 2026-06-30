import React, { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, action }) => (
  <div className="py-5 border-b border-[var(--color-border)] last:border-b-0 first:pt-0">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
        {title}
      </h3>
      {action}
    </div>
    {children}
  </div>
);

export default FilterSection;
