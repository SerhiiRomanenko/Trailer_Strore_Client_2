import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FiltersState } from "../pages/HomePage";

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (filterName: keyof FiltersState, value: any) => void;
  onResetFilters: () => void;
  allBrands: string[];
  allSuspensionTypes: string[];
}

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
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
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allBrands,
  allSuspensionTypes,
}) => {
  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange("brands", next);
  };

  const toggleSuspension = (type: string) => {
    const next = filters.suspensionTypes.includes(type)
      ? filters.suspensionTypes.filter((s) => s !== type)
      : [...filters.suspensionTypes, type];
    onFilterChange("suspensionTypes", next);
  };

  const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Фільтри</h2>
        <button
          onClick={onResetFilters}
          className="text-[12px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
        >
          Скинути
        </button>
      </div>

      <Section title="Пошук">
        <input
          type="text"
          placeholder="Назва причепа..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          className="w-full text-sm"
        />
      </Section>

      <Section title="Ціна, UAH">
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Від" value={filters.minPrice} onChange={(e) => onFilterChange("minPrice", e.target.value)} className="flex-1 text-sm" />
          <span className="text-[var(--color-text-tertiary)] text-sm">—</span>
          <input type="number" placeholder="До" value={filters.maxPrice} onChange={(e) => onFilterChange("maxPrice", e.target.value)} className="flex-1 text-sm" />
        </div>
      </Section>

      <Section title="Бренд">
        <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
          {allBrands.map((brand) => (
            <Checkbox
              key={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
            />
          ))}
        </div>
      </Section>

      <Section title="Тип підвіски">
        <div className="space-y-0.5">
          {allSuspensionTypes.map((type) => (
            <Checkbox
              key={type}
              checked={filters.suspensionTypes.includes(type)}
              onChange={() => toggleSuspension(type)}
              label={type}
            />
          ))}
        </div>
      </Section>

      <Section title="Наявність">
        <Checkbox
          checked={filters.inStockOnly}
          onChange={() => onFilterChange("inStockOnly", !filters.inStockOnly)}
          label="Тільки в наявності"
        />
      </Section>
    </div>
  );
};

export default Filters;
