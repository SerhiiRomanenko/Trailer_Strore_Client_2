// src/components/TrailerList.tsx
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

const TrailerList: React.FC<TrailerListProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const trailerStatus = useSelector(
    (state: RootState) => state.trailers.status
  );
  const trailerError = useSelector((state: RootState) => state.trailers.error);

  useEffect(() => {
    if (trailerStatus === "idle" && products.length === 0) {
      dispatch(fetchTrailers());
    }
  }, [trailerStatus, dispatch, products.length]);

  if (trailerStatus === "loading" && products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-600 text-lg">
        Завантаження причепів...
      </div>
    );
  }

  if (trailerStatus === "failed" && products.length === 0) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Помилка завантаження: {trailerError}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 text-lg">
        Немає товарів для відображення.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((productItem) => (
        <ProductCard
          key={productItem.id}
          product={productItem}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.has(productItem.id)}
        />
      ))}
    </div>
  );
};

export default TrailerList;
