import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";

interface TrailerListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favoriteIds: Set<string>;
}

const TrailerList: React.FC<TrailerListProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[var(--color-text-tertiary)]">Товарів не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
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
