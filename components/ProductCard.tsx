import React, { useCallback } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "../types";

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

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite(product.id);
    },
    [onToggleFavorite, product.id]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart(product);
    },
    [onAddToCart, product]
  );

  const isOutOfStock = !product.inStock;

  return (
    <div className="group bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-hover)] hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--color-bg)]">
        <a href={detailPath} onClick={handleNav} className="block">
          <img
            src={
              (product.images && product.images[0]) ||
              "https://via.placeholder.com/300/eef0f2/999?text=--"
            }
            alt={product.name}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ aspectRatio: "1" }}
            loading="lazy"
          />
        </a>

        {/* Favorite button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          aria-label={isFavorite ? "Видалити з обраного" : "Додати в обране"}
        >
          <Star
            className={`h-3.5 w-3.5 transition-colors ${
              isFavorite
                ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                : "text-[var(--color-text-tertiary)]"
            }`}
          />
        </button>

        {/* Out of stock badge */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            Немає
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] text-[var(--color-text-tertiary)] mb-0.5">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <a
          href={detailPath}
          onClick={handleNav}
          className="block text-[13px] text-[var(--color-link)] hover:text-[var(--color-link-hover)] leading-snug line-clamp-2 mb-2 transition-colors min-h-[2.5rem]"
        >
          {product.name}
        </a>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2.5">
          <span className="text-[15px] font-bold text-[var(--color-text)]">
            {product.price?.toLocaleString("uk-UA")}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {product.currency}
          </span>
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-1.5 text-[13px] font-medium py-2 px-3 rounded-md transition-all ${
            isOutOfStock
              ? "bg-[var(--color-bg)] text-[var(--color-text-tertiary)] cursor-not-allowed"
              : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.97]"
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isOutOfStock ? "Немає" : "В кошик"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
