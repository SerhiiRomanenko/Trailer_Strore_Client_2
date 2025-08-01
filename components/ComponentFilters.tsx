// src/components/ComponentFilters.tsx
import React, { useState, ReactNode } from "react";
import ChevronDownIcon from "./icons/ChevronDownIcon";

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

const AccordionItem: React.FC<{
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 font-semibold text-left text-slate-800"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
};

const ComponentFilters: React.FC<ComponentFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allBrands,
  allComponentTypes,
}) => {
  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange("brands", newBrands);
  };

  const handleComponentTypeChange = (componentType: string) => {
    const newTypes = filters.componentTypes.includes(componentType)
      ? filters.componentTypes.filter((t) => t !== componentType)
      : [...filters.componentTypes, componentType];
    onFilterChange("componentTypes", newTypes);
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Фільтри</h2>
        <button
          onClick={onResetFilters}
          className="text-sm font-medium text-orange-600 hover:underline"
        >
          Скинути
        </button>
      </div>

      <AccordionItem title="Пошук">
        <input
          type="text"
          placeholder="Назва комплектуючої..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </AccordionItem>

      <AccordionItem title="Ціна, UAH">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Від"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="До"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </AccordionItem>

      <AccordionItem title="Бренд">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-slate-100"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-slate-700">{brand}</span>
            </label>
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title="Тип компонента">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {allComponentTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-slate-100"
            >
              <input
                type="checkbox"
                checked={filters.componentTypes.includes(type)}
                onChange={() => handleComponentTypeChange(type)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-slate-700">{type}</span>
            </label>
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title="Наявність">
        <label className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-slate-100">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange("inStockOnly", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-slate-700">Тільки в наявності</span>
        </label>
      </AccordionItem>
    </div>
  );
};

export default ComponentFilters;
