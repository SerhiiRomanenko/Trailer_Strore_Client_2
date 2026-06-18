import React from "react";
import { FiltersState } from "../pages/HomePage";
import FilterSection from "./ui/FilterSection";
import FilterCheckbox from "./ui/FilterCheckbox";

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (filterName: keyof FiltersState, value: any) => void;
  onResetFilters: () => void;
  allBrands: string[];
  allSuspensionTypes: string[];
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

      <FilterSection title="Пошук">
        <input
          type="text"
          placeholder="Назва причепа..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          className="w-full text-sm"
        />
      </FilterSection>

      <FilterSection title="Ціна, UAH" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Від" value={filters.minPrice} onChange={(e) => onFilterChange("minPrice", e.target.value)} className="flex-1 text-sm" />
          <span className="text-[var(--color-text-tertiary)] text-sm">—</span>
          <input type="number" placeholder="До" value={filters.maxPrice} onChange={(e) => onFilterChange("maxPrice", e.target.value)} className="flex-1 text-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Бренд" defaultOpen={false}>
        <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
          {allBrands.map((brand) => (
            <FilterCheckbox
              key={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Тип підвіски" defaultOpen={false}>
        <div className="space-y-0.5">
          {allSuspensionTypes.map((type) => (
            <FilterCheckbox
              key={type}
              checked={filters.suspensionTypes.includes(type)}
              onChange={() => toggleSuspension(type)}
              label={type}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Наявність" defaultOpen={false}>
        <FilterCheckbox
          checked={filters.inStockOnly}
          onChange={() => onFilterChange("inStockOnly", !filters.inStockOnly)}
          label="Тільки в наявності"
        />
      </FilterSection>
    </div>
  );
};

export default Filters;
