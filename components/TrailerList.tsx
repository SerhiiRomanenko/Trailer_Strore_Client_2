import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrailers } from "../redux/trailerSlice";
import { RootState, AppDispatch } from "../redux/store";
import ProductCard from "./ProductCard";
import { Product } from "../types";

interface TrailerListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favoriteIds: Set<string>;
}

const SkeletonCard = () => (
  <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
    <div className="skeleton" style={{ aspectRatio: "1" }} />
    <div className="p-2.5 space-y-2">
      <div className="skeleton h-2.5 w-16" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-5 w-20" />
      <div className="skeleton h-8 w-full rounded-md" />
    </div>
  </div>
);

const TrailerList: React.FC<TrailerListProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const trailerStatus = useSelector((state: RootState) => state.trailers.status);
  const trailerError = useSelector((state: RootState) => state.trailers.error);

  useEffect(() => {
    if (trailerStatus === "idle" && products.length === 0) {
      dispatch(fetchTrailers());
    }
  }, [trailerStatus, dispatch, products.length]);

  if (trailerStatus === "loading" && products.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (trailerStatus === "failed" && products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[var(--color-error)]">Помилка: {trailerError}</p>
        <button
          onClick={() => dispatch(fetchTrailers())}
          className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[var(--color-text-tertiary)]">Товарів не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.has(product.id)}
        />
      ))}
    </div>
  );
};

export default TrailerList;
