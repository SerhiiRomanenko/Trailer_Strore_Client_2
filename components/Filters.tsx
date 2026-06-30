import React from "react";
import { X } from "lucide-react";
import { FiltersState } from "../pages/HomePage";
import FilterSection from "./ui/FilterSection";
import FilterCheckbox from "./ui/FilterCheckbox";

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (filterName: keyof FiltersState, value: any) => void;
  onResetFilters: () => void;
  allBrands: string[];
  allSuspensionTypes: string[];
  hasActiveFilters?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allBrands,
  allSuspensionTypes,
  hasActiveFilters,
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
    <div>      {/* Search */}
      <FilterSection
        title="Пошук"
        action={
          hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="hidden md:inline text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              Скинути
            </button>
          )
        }
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Назва причепа..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
            className="w-full text-sm px-4 pr-8 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange("searchQuery", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-tertiary)]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Ціна, ₴">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Від"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="w-full text-sm px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all pr-7"
              min="0"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-tertiary)] pointer-events-none">₴</span>
          </div>
          <span className="text-[var(--color-text-tertiary)] text-xs shrink-0">—</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="До"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="w-full text-sm px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all pr-7"
              min="0"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-tertiary)] pointer-events-none">₴</span>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Бренд">
        <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
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

      {/* Suspension type */}
      <FilterSection title="Тип підвіски">
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

      {/* Availability */}
      <FilterSection title="Наявність">
        <button
          onClick={() => onFilterChange("inStockOnly", !filters.inStockOnly)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
            filters.inStockOnly
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
          }`}
        >
          <span
            className={`text-[13px] ${
              filters.inStockOnly
                ? "text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Тільки в наявності
          </span>
          <span
            className={`w-9 h-5 rounded-full relative transition-colors ${
              filters.inStockOnly ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                filters.inStockOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </FilterSection>
    </div>
  );
};

export default Filters;
