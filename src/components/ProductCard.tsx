import React, { useState } from 'react';
import { Product } from '../types';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import { MapPin, ShoppingBag, Eye, MousePointerClick, ExternalLink, Crown, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  showAdminStats?: boolean;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  showAdminStats = false,
  isAdmin = false,
  onDelete,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const currentImage = product.images?.[activeImageIndex] || product.images?.[0] || '';

  const handleImageError = () => {
    if (product.images && activeImageIndex < product.images.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    } else {
      setImgError(true);
    }
  };

  return (
    <article
      onClick={onClick}
      className={`group bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
        product.is_pinned
          ? 'border-amber-300 ring-1 ring-amber-200/80 shadow-md hover:shadow-lg'
          : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imgError && currentImage ? (
          <img
            src={currentImage}
            alt={product.title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">{product.category}</span>
          </div>
        )}

        {/* Status indicator on card (clean, non-pill) */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-slate-900 font-bold text-sm tracking-wide rounded">
              ĐÃ BÁN
            </span>
          </div>
        )}

        {/* VIP Pin Badge */}
        {product.is_pinned && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-yellow-200 backdrop-blur-xs">
            <Crown className="w-3 h-3 text-amber-900 fill-amber-900" />
            <span>TIN GHIM VIP</span>
          </div>
        )}

        {/* Admin Quick Delete Button: For customer products or link products */}
        {isAdmin && onDelete && (
          <button
            type="button"
            title="Xóa sản phẩm (Quyền Admin)"
            onClick={(e) => {
              e.stopPropagation();
              const isLinkProduct = Boolean(product.is_shopee_direct || product.shopee_affiliate_url);
              const labelType = isLinkProduct ? 'sản phẩm gắn link Shopee' : 'sản phẩm của khách';
              if (window.confirm(`[Admin] Bạn có chắc chắn muốn xóa ${labelType}: "${product.title}"?`)) {
                onDelete(product.id);
              }
            }}
            className="absolute bottom-2.5 right-2.5 z-20 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-all hover:scale-110 flex items-center gap-1 text-[11px] font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        )}

      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{product.condition}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{formatTimeAgoVN(product.created_at)}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 line-clamp-2 leading-snug transition-colors mb-2">
            {product.title}
          </h3>
        </div>

        {/* Price & Location or Shopee Direct Action */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-base font-bold text-orange-600 font-mono tabular-nums tracking-tight">
              {formatVND(product.price)}
            </div>
          </div>

          {(product.is_shopee_direct || Boolean(product.shopee_affiliate_url)) ? (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (product.shopee_affiliate_url) {
                  window.open(product.shopee_affiliate_url, '_blank', 'noopener,noreferrer');
                }
              }}
              className="flex items-center justify-between pt-1 cursor-pointer"
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1 bg-[#EE4D2D] hover:bg-orange-700 text-white rounded-md text-xs font-bold transition-all shadow-xs active:scale-95 group/btn"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mua ngay</span>
                <ExternalLink className="w-3 h-3 opacity-90 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                Shopee Mall
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 truncate max-w-[180px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>

              {/* Admin mini stats if viewed in admin dashboard */}
              {showAdminStats && (
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono tabular-nums">
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {product.views_count}
                  </span>
                  <span className="flex items-center gap-0.5 text-orange-600 font-medium">
                    <MousePointerClick className="w-3 h-3" />
                    {product.affiliate_clicks_count}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
