import React from "react";
import FilterSection from "./ui/FilterSection";
import FilterCheckbox from "./ui/FilterCheckbox";

export interface ComponentFiltersState {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  componentTypes: string[];
  inStockOnly: boolean;
}

interface ComponentFiltersProps {
  filters: ComponentFiltersState;
  onFilterChange: (filterName: keyof ComponentFiltersState, value: any) => void;
  onResetFilters: () => void;
  allBrands: string[];
  allComponentTypes: string[];
}

const ComponentFilters: React.FC<ComponentFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allBrands,
  allComponentTypes,
}) => {
  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange("brands", next);
  };

  const toggleType = (type: string) => {
    const next = filters.componentTypes.includes(type)
      ? filters.componentTypes.filter((t) => t !== type)
      : [...filters.componentTypes, type];
    onFilterChange("componentTypes", next);
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
        <input type="text" placeholder="Назва..." value={filters.searchQuery} onChange={(e) => onFilterChange("searchQuery", e.target.value)} className="w-full text-sm" />
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
            <FilterCheckbox key={brand} checked={filters.brands.includes(brand)} onChange={() => toggleBrand(brand)} label={brand} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Тип компонента" defaultOpen={false}>
        <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
          {allComponentTypes.map((type) => (
            <FilterCheckbox key={type} checked={filters.componentTypes.includes(type)} onChange={() => toggleType(type)} label={type} />
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

export default ComponentFilters;
