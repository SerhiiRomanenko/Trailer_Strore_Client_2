// src/components/ProductCard.tsx
import React, { useCallback } from "react";
import { Product } from "../types";
import Button from "./Button";
import StarIcon from "./icons/StarIcon";
import ShoppingCartIcon from "./icons/ShoppingCartIcon";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  const detailPath =
    product.category === "Причепи"
      ? `/product/${product.slug}`
      : `/details/${product.id}`;

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.history.pushState({}, "", detailPath);
      window.dispatchEvent(new Event("locationchange"));
    },
    [detailPath]
  );

  const handleToggleFavoriteClick = useCallback(() => {
    onToggleFavorite(product.id);
  }, [onToggleFavorite, product.id]);

  const handleAddToCartClick = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col group transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-slate-200/50">
      <div className="relative">
        <a href={detailPath} onClick={handleNav}>
          <img
            src={
              (product.images && product.images[0]) ||
              "https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image"
            }
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </a>
        <button
          type="button"
          onClick={handleToggleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <StarIcon
            className={`h-6 w-6 transition-colors ${
              isFavorite
                ? "text-orange-500"
                : "text-slate-400 hover:text-orange-500"
            }`}
          />
        </button>
        {product.brand && (
          <div className="absolute top-3 left-3 bg-slate-900/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.brand}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2 font-['Roboto_Slab']">
          <a
            href={detailPath}
            onClick={handleNav}
            className="hover:text-orange-600 transition-colors"
          >
            {product.name}
          </a>
        </h3>
        <p className="text-slate-500 mb-4 text-sm flex-grow">
          {product.shortDescription}
        </p>
        <div className="mt-auto">
          <p className="text-2xl font-black text-slate-900 mb-4">
            {product.price?.toLocaleString("uk-UA")} {product.currency || "грн"}{" "}
          </p>
          <Button
            type="button"
            onClick={handleAddToCartClick}
            variant="secondary"
            className="w-full !font-bold group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Додати в кошик
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
