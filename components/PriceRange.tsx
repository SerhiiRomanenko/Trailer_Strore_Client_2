import React, { useCallback } from "react";

interface PriceRangeProps {
  minPrice: string;
  maxPrice: string;
  onChange: (min: string, max: string) => void;
  dataMin?: number;
  dataMax?: number;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice,
  onChange,
  dataMin = 0,
  dataMax = 100000,
}) => {
  const numMin = minPrice ? Math.max(0, parseFloat(minPrice)) : 0;
  const numMax = maxPrice ? Math.max(numMin, parseFloat(maxPrice)) : dataMax;

  const getPercent = useCallback(
    (val: number) => ((val - dataMin) / (dataMax - dataMin)) * 100,
    [dataMin, dataMax],
  );

  return (
    <div className="space-y-3">
      {/* Visual track */}
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-[var(--color-border)]" />
        <div
          className="absolute h-1 rounded-full bg-[var(--color-primary)]"
          style={{
            left: `${getPercent(numMin)}%`,
            right: `${100 - getPercent(numMax)}%`,
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-[var(--color-primary)] border-2 border-white shadow-md"
          style={{ left: `${getPercent(numMin)}%`, transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-[var(--color-primary)] border-2 border-white shadow-md"
          style={{ left: `${getPercent(numMax)}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Inputs */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="Від"
            value={minPrice}
            onChange={(e) => onChange(e.target.value, maxPrice)}
            className="w-full text-sm px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
            min={dataMin}
          />
        </div>
        <span className="text-[var(--color-text-tertiary)] text-xs shrink-0">—</span>
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={(e) => onChange(minPrice, e.target.value)}
            className="w-full text-sm px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
            max={dataMax}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
