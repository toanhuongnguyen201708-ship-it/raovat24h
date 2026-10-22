import React, { useState, useMemo } from 'react';
import { Product, FilterState } from '../types';
import { CATEGORIES, VIETNAM_LOCATIONS, CONDITIONS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ShoppingBag,
  ArrowUpDown,
  MapPin,
  Tag,
  Crown,
  Sparkles,
  ExternalLink,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface MarketplaceProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenPostModal: () => void;
  onAffiliateClick?: (productId: string, url: string) => void;
  onOpenPinModal?: (product?: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (id: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  onSelectProduct,
  onOpenPostModal,
  onAffiliateClick,
  onOpenPinModal,
  isAdmin = false,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả khu vực');
  const [selectedCondition, setSelectedCondition] = useState('Tất cả tình trạng');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');

  // Filter public items: only 'approved' and 'sold' are displayed publicly
  const publicProducts = useMemo(() => {
    return products.filter((p) => p.status === 'approved' || p.status === 'sold');
  }, [products]);

  // Extract Shopee Mall products for psychological recommendation showcase
  const shopeeRecommendations = useMemo(() => {
    return publicProducts.filter(p => (p.is_shopee_direct || p.is_affiliate_active) && p.shopee_affiliate_url);
  }, [publicProducts]);

  const filteredProducts = useMemo(() => {
    return publicProducts
      .filter((p) => {
        // Search query
        const matchesSearch =
          !search.trim() ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase());

        // Category
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category.toLowerCase().includes(
            CATEGORIES.find((c) => c.id === selectedCategory)?.name.toLowerCase() || ''
          );

        // Location
        const matchesLocation =
          selectedLocation === 'Tất cả khu vực' || p.location.includes(selectedLocation);

        // Condition
        const matchesCondition =
          selectedCondition === 'Tất cả tình trạng' || p.condition === selectedCondition;

        return matchesSearch && matchesCategory && matchesLocation && matchesCondition;
      })
      .sort((a, b) => {
        // 1. VIP Pinning Priority: Pinned products always appear on top!
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        // 2. Secondary sort criteria
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        if (sortBy === 'popular') {
          return (b.affiliate_clicks_count + b.views_count) - (a.affiliate_clicks_count + a.views_count);
        }
        return 0;
      });
  }, [publicProducts, search, selectedCategory, selectedLocation, selectedCondition, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/70 via-slate-50 to-white pt-10 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          


          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight" style={{ textWrap: 'balance' }}>
            Mua bán trao đổi đồ cũ, tham khảo giá mới chính hãng
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kết nối người mua & người bán trực tiếp qua SĐT/Zalo.
          </p>

          {/* Unified Search & Quick Filter Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm iPhone, tai nghe, đồ gia dụng, xe máy..."
                className="w-full pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

            {/* Location selector inside search bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                {VIETNAM_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {}}
              className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>

          {/* Category Chips / Segmented tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* VIP Pin Advertising Banner & Shopee Mall Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* VIP Pin CTA Banner */}
        {onOpenPinModal && (
          <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-yellow-200 shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-yellow-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dịch Vụ Tăng VIP & Ghim Tin Số 1</span>
                </div>
                <div className="text-sm font-extrabold text-white">
                  Bạn muốn bán nhanh hơn? Nhắn tin riêng với Admin để ghim tin số 1 toàn sàn chỉ từ 15.000đ!
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenPinModal()}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-yellow-50 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 group"
            >
              <Zap className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
              <span>Dịch vụ tăng VIP</span>
            </button>
          </div>
        )}

        {/* Shopee Mall Psychological Recommendations Showcase */}
        {shopeeRecommendations.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#EE4D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Shopee Mall
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-orange-950">
                  Gợi ý hàng mới chính hãng 100% trợ giá · Bảo hành 12 tháng · Freeship Extra
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Chuyển hướng trực tiếp Shopee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {shopeeRecommendations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onAffiliateClick && onAffiliateClick(item.id, item.shopee_affiliate_url)}
                  className="bg-white p-3 rounded-xl border border-orange-200/70 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 truncate leading-tight">
                      {item.title}
                    </h4>
                    <div className="text-xs font-extrabold text-orange-600 font-mono mt-0.5">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Chính hãng 100%</span>
                    </div>
                  </div>
                  <div className="p-1.5 bg-orange-50 group-hover:bg-[#EE4D2D] text-orange-600 group-hover:text-white rounded-lg transition-colors shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Main Grid & Secondary Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Admin guidance banner when logged in as admin */}
        {isAdmin && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Quyền Quản trị viên:</strong> Bạn có thể xóa bất kỳ sản phẩm nào của khách hoặc sản phẩm gắn link trực tiếp bằng nút <strong>"Xóa"</strong> đỏ trên mỗi thẻ sản phẩm hoặc trong bảng xem chi tiết.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded self-start sm:self-auto shrink-0">
              Admin Mode
            </span>
          </div>
        )}

        {/* Filter bar: sorting & condition */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-900 font-mono">{filteredProducts.length}</span> tin đăng công khai
          </div>

          <div className="flex items-center gap-3 text-xs self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Condition Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Tình trạng:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="popular">Quan tâm nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs text-slate-500">
              Hãy thử thay đổi từ khóa tìm kiếm, chọn danh mục khác hoặc đặt lại bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedLocation('Tất cả khu vực');
                setSelectedCondition('Tất cả tình trạng');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Đặt lại toàn bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onDelete={onDeleteProduct}
                onClick={() => {
                  onSelectProduct(product);
                }}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
};
