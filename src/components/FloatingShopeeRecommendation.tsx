import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatVND } from '../utils/security';
import {
  ShoppingBag,
  ExternalLink,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

interface FloatingShopeeRecommendationProps {
  products: Product[];
  onAffiliateClick: (productId: string, url: string) => void;
}

const PSYCHOLOGY_HOOKS = [
  'Gợi ý mua kèm trợ giá Shopee Mall',
  'Deal hot giảm giá sốc hôm nay',
  'Hàng mới chính hãng 100% bảo hành 12T',
  'Freeship Extra toàn quốc 0đ',
  'Khách xem sản phẩm này thường mua kèm',
];

export const FloatingShopeeRecommendation: React.FC<FloatingShopeeRecommendationProps> = ({
  products,
  onAffiliateClick,
}) => {
  // Filter products that have Shopee direct link or active affiliate link
  const shopeeProducts = products.filter(
    (p) => (p.is_shopee_direct || p.is_affiliate_active) && p.shopee_affiliate_url
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto rotate recommendation every 8 seconds
  useEffect(() => {
    if (shopeeProducts.length <= 1 || isMinimized || isDismissed) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shopeeProducts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [shopeeProducts.length, isMinimized, isDismissed]);

  if (shopeeProducts.length === 0 || isDismissed) return null;

  const currentProduct = shopeeProducts[currentIndex] || shopeeProducts[0];
  const hookText = PSYCHOLOGY_HOOKS[currentIndex % PSYCHOLOGY_HOOKS.length];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % shopeeProducts.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + shopeeProducts.length) % shopeeProducts.length);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAffiliateClick(currentProduct.id, currentProduct.shopee_affiliate_url);
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-40 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-[#EE4D2D] to-[#FF6633] text-white rounded-full shadow-xl hover:shadow-2xl border-2 border-white transition-all transform hover:scale-105"
          title="Mở xem gợi ý hàng chính hãng Shopee"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap">Gợi ý Shopee Mall</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
            {shopeeProducts.length}
          </span>
        </button>
      </div>
    );
  }

  // Expanded Corner Mini-Card
  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-[340px] w-full animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden group hover:border-orange-400 transition-all">
        
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-[#EE4D2D] via-[#F05D40] to-amber-500 px-3.5 py-2 text-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {hookText}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded text-white transition-colors"
              title="Thu nhỏ lại"
            >
              <span className="text-xs font-bold leading-none block px-0.5">_</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 hover:bg-white/20 rounded text-white transition-colors"
              title="Đóng gợi ý này"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 flex items-center gap-3">
          {/* Thumbnail */}
          <div
            onClick={handleBuy}
            className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
          >
            <img
              src={currentProduct.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'}
              alt={currentProduct.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1 left-1 bg-[#EE4D2D] text-white text-[9px] font-bold px-1 rounded">
              Mall
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mb-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Chính Hãng 100%</span>
            </div>

            <h4
              onClick={handleBuy}
              className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug hover:text-orange-600 cursor-pointer transition-colors"
              title={currentProduct.title}
            >
              {currentProduct.title}
            </h4>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm font-extrabold text-[#EE4D2D] font-mono tabular-nums">
                {formatVND(currentProduct.price)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span>{currentProduct.affiliate_clicks_count + 86} người đã mua</span>
            </div>
          </div>
        </div>

        {/* Action Button & Carousel Navigator */}
        <div className="px-3.5 pb-3 pt-1 flex items-center gap-2">
          {shopeeProducts.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Sản phẩm trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Sản phẩm kế tiếp"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleBuy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#EE4D2D] to-[#F05D40] hover:from-[#d73f20] hover:to-[#db4f33] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mua ngay trên Shopee</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Small bottom ticker */}
        <div className="bg-orange-50/80 px-3 py-1 text-[10px] text-orange-800 text-center border-t border-orange-100 flex items-center justify-center gap-1">
          <Percent className="w-3 h-3 text-orange-600" />
          <span>Áp dụng mã giảm giá & Freeship Extra trực tiếp tại Shopee</span>
        </div>

      </div>
    </div>
  );
};
