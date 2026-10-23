import React, { useState } from 'react';
import { Product, ProductStatus, PinPackage } from '../types';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  EyeOff,
  Trash2,
  ShoppingBag,
  Sparkles,
  Link,
  Search,
  Check,
  UserCheck,
  Crown,
  Zap,
  Clock,
  Calendar,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

interface AdminModerationProps {
  products: Product[];
  onModerate: (
    id: string,
    action: {
      status: ProductStatus;
      rejection_reason?: string;
      shopee_affiliate_url?: string;
      shopee_button_label?: string;
      is_affiliate_active?: boolean;
      shopee_sub_url?: string;
      shopee_sub_label?: string;
    }
  ) => void;
  onDelete: (id: string) => void;
  onOpenShopeeImporter?: () => void;
  onPinProduct?: (id: string, packageType: PinPackage) => void;
  onUnpinProduct?: (id: string) => void;
  onRejectPinRequest?: (id: string) => void;
  onOpenInAppChat?: (product: Product) => void;
}

export const PIN_PACKAGE_INFO: Record<PinPackage, { name: string; days: number; price: number; badgeColor: string; tag: string }> = {
  '1_day': { name: 'Gói VIP 1 Ngày', days: 1, price: 15000, badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', tag: 'Dùng thử 24h' },
  '3_days': { name: 'Gói VIP 3 Ngày', days: 3, price: 39000, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300', tag: 'Tiết kiệm 15%' },
  '7_days': { name: 'Gói VIP 7 Ngày (Kim Cương)', days: 7, price: 79000, badgeColor: 'bg-purple-100 text-purple-900 border-purple-300', tag: 'Bán chạy nhất' },
  '30_days': { name: 'Gói VIP 30 Ngày (Đặc Quyền)', days: 30, price: 249000, badgeColor: 'bg-rose-100 text-rose-900 border-rose-300', tag: 'Siêu tiết kiệm' },
};

export const AdminModeration: React.FC<AdminModerationProps> = ({
  products,
  onModerate,
  onDelete,
  onOpenShopeeImporter,
  onPinProduct,
  onUnpinProduct,
  onRejectPinRequest,
  onOpenInAppChat,
}) => {
  // View mode switcher: Moderation (Duyệt bài) vs VIP Pin Ads Manager (Quản lý ghim theo gói)
  const [activeViewMode, setActiveViewMode] = useState<'moderation' | 'vip_pin_manager'>('vip_pin_manager');
  
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products.find(p => p.status === 'pending')?.id || products[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<'all' | ProductStatus | 'vip_pin' | 'has_link' | 'customer'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // VIP Manager specific filters
  const [vipFilter, setVipFilter] = useState<'all' | 'pending_request' | 'active_pinned' | 'has_link' | 'customer' | 'all_products'>('pending_request');
  const [vipSearch, setVipSearch] = useState('');

  // Selected product in Moderation
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Editable Admin Affiliate Fields for the currently selected product
  const [affiliateActive, setAffiliateActive] = useState(activeProduct?.is_affiliate_active ?? false);
  const [affiliateUrl, setAffiliateUrl] = useState(activeProduct?.shopee_affiliate_url ?? '');
  const [buttonLabel, setButtonLabel] = useState(activeProduct?.shopee_button_label ?? 'Mua ngay');
  const [subUrl, setSubUrl] = useState(activeProduct?.shopee_sub_url ?? '');
  const [subLabel, setSubLabel] = useState(activeProduct?.shopee_sub_label ?? 'Xem phụ kiện đi kèm trên Shopee');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedPinPackage, setSelectedPinPackage] = useState<PinPackage>(activeProduct?.pin_requested_package || activeProduct?.pin_package || '3_days');

  // Sync state whenever activeProduct changes
  React.useEffect(() => {
    if (activeProduct) {
      setAffiliateActive(activeProduct.is_affiliate_active ?? false);
      setAffiliateUrl(activeProduct.shopee_affiliate_url ?? '');
      setButtonLabel(activeProduct.shopee_button_label || 'Mua ngay');
      setSubUrl(activeProduct.shopee_sub_url ?? '');
      setSubLabel(activeProduct.shopee_sub_label ?? 'Xem phụ kiện đi kèm trên Shopee');
      setRejectionReason(activeProduct.rejection_reason ?? '');
      setSelectedPinPackage(activeProduct.pin_requested_package || activeProduct.pin_package || '3_days');
      setShowRejectBox(false);
      setSaveSuccess(false);
    }
  }, [activeProduct?.id]);

  // Counts
  const pendingCount = products.filter(p => p.status === 'pending').length;
  const pendingPinCount = products.filter(p => p.pin_requested && !p.is_pinned).length;
  const activePinCount = products.filter(p => p.is_pinned).length;
  const hasLinkCount = products.filter(p => p.is_shopee_direct || p.shopee_affiliate_url).length;
  const customerCount = products.filter(p => !p.is_shopee_direct && p.user_id !== 'admin' && p.seller_name !== 'Admin').length;

  // Filtered list for Moderation Tab
  const filteredProducts = products.filter(p => {
    let matchesStatus = true;
    if (filterStatus === 'vip_pin') {
      matchesStatus = Boolean(p.is_pinned || p.pin_requested);
    } else if (filterStatus === 'has_link') {
      matchesStatus = Boolean(p.is_shopee_direct || p.shopee_affiliate_url);
    } else if (filterStatus === 'customer') {
      matchesStatus = Boolean(!p.is_shopee_direct && p.user_id !== 'admin' && p.seller_name !== 'Admin');
    } else if (filterStatus !== 'all') {
      matchesStatus = p.status === filterStatus;
    }
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.seller_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered list for VIP Pin Ads Manager Tab
  const vipListProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(vipSearch.toLowerCase()) ||
                          p.seller_name.toLowerCase().includes(vipSearch.toLowerCase()) ||
                          (p.seller_phone && p.seller_phone.includes(vipSearch));
    if (!matchesSearch) return false;

    if (vipFilter === 'pending_request') {
      return Boolean(p.pin_requested && !p.is_pinned);
    }
    if (vipFilter === 'active_pinned') {
      return Boolean(p.is_pinned);
    }
    if (vipFilter === 'has_link') {
      return Boolean(p.is_shopee_direct || p.shopee_affiliate_url);
    }
    if (vipFilter === 'customer') {
      return Boolean(!p.is_shopee_direct && p.user_id !== 'admin' && p.seller_name !== 'Admin');
    }
    if (vipFilter === 'all') {
      return Boolean(p.pin_requested || p.is_pinned);
    }
    // all_products
    return true;
  });

  // Calculate estimated ads revenue
  const estimatedRevenue = products.reduce((acc, p) => {
    if (p.is_pinned && p.pin_package) {
      return acc + (PIN_PACKAGE_INFO[p.pin_package]?.price || 0);
    }
    if (p.pin_requested && p.pin_requested_package) {
      return acc + (PIN_PACKAGE_INFO[p.pin_requested_package]?.price || 0);
    }
    return acc;
  }, 0);

  const handleApprove = () => {
    if (!activeProduct) return;
    onModerate(activeProduct.id, {
      status: 'approved',
      shopee_affiliate_url: affiliateUrl.trim(),
      shopee_button_label: buttonLabel.trim(),
      is_affiliate_active: affiliateActive,
      shopee_sub_url: subUrl.trim(),
      shopee_sub_label: subLabel.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReject = () => {
    if (!activeProduct) return;
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối để người bán biết và chỉnh sửa bài đăng.');
      return;
    }
    onModerate(activeProduct.id, {
      status: 'rejected',
      rejection_reason: rejectionReason.trim(),
    });
    setShowRejectBox(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleHide = () => {
    if (!activeProduct) return;
    const nextStatus = activeProduct.status === 'hidden' ? 'approved' : 'hidden';
    onModerate(activeProduct.id, {
      status: nextStatus,
    });
  };

  // Quick Affiliate Presets for Admin efficiency
  const applyPreset = (type: string) => {
    setAffiliateActive(true);
    if (type === 'shopee_search') {
      const keyword = encodeURIComponent(activeProduct.title.split(' ').slice(0, 4).join(' '));
      setAffiliateUrl(`https://shopee.vn/search?keyword=${keyword}&aff_trace_key=chorao_admin_aff_${Date.now().toString().slice(-4)}`);
      setButtonLabel(`Xem giá sản phẩm mới trên Shopee Mall`);
      setSubUrl(`https://shopee.vn/search?keyword=phu%20kien%20${keyword}`);
      setSubLabel(`Xem phụ kiện & bảo hành Shopee`);
    } else if (type === 'shopee_flash_deal') {
      setAffiliateUrl(`https://shopee.vn/flash_sale?aff_trace_key=chorao_flash_deal_top`);
      setButtonLabel(`Săn Sale Giảm Đến 50% Trên Shopee`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Khu Vực Quản Trị Viên (Admin)
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Kiểm duyệt bài đăng, gắn link Shopee Affiliate độc quyền và quản lý ghim quảng cáo VIP theo gói khách hàng đăng ký.
          </p>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenShopeeImporter && (
            <button
              onClick={onOpenShopeeImporter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đăng Nhanh Từ Link Shopee</span>
            </button>
          )}

          {/* Pending Badge */}
          {pendingCount > 0 && (
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{pendingCount} bài chờ duyệt</span>
            </div>
          )}

          {/* Pending VIP Badge */}
          {pendingPinCount > 0 && (
            <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <Crown className="w-3.5 h-3.5 text-purple-600" />
              <span>{pendingPinCount} yêu cầu ghim VIP mới</span>
            </div>
          )}
        </div>
      </div>

      {/* TOP VIEW MODE TABS: Duyệt Tin vs Quản Lý Ghim VIP Khách Đăng Ký */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveViewMode('vip_pin_manager')}
          className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeViewMode === 'vip_pin_manager'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <Crown className={`w-4 h-4 ${activeViewMode === 'vip_pin_manager' ? 'text-yellow-200 fill-yellow-200' : 'text-amber-600'}`} />
          <span>Ghim Sản Phẩm Khách Đăng Ký Theo Gói</span>
          {pendingPinCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
              activeViewMode === 'vip_pin_manager'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'bg-amber-600 text-white'
            }`}>
              {pendingPinCount} yêu cầu mới
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveViewMode('moderation')}
          className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeViewMode === 'moderation'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Kiểm Duyệt Bài Viết & Gắn Shopee Affiliate</span>
          {pendingCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
              activeViewMode === 'moderation'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-200 text-slate-800'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: KHÁCH HÀNG ĐĂNG KÝ GHIM QUẢNG CÁO THEO GÓI      */}
      {/* ======================================================== */}
      {activeViewMode === 'vip_pin_manager' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Quick Metrics & Revenue estimation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chờ Kích Hoạt Ghim
                </span>
                <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Crown className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-amber-600 font-mono">
                {pendingPinCount}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Khách đã đăng ký theo gói</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Đang Ghim VIP Số 1
                </span>
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
                {activePinCount}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Hiển thị nổi bật đầu Bảng tin
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Doanh Thu Dự Kiến
                </span>
                <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-purple-600 font-mono">
                {formatVND(estimatedRevenue)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Từ các gói quảng cáo khách đăng ký
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Gói Quảng Cáo Phổ Biến
                </span>
                <span className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <Tag className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-base font-bold text-slate-900 leading-tight">
                Gói 7 Ngày (Kim Cương)
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1 font-mono">
                79.000đ / bài / tuần
              </div>
            </div>
          </div>

          {/* Filter Bar & Search for VIP Pin Manager */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setVipFilter('pending_request')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  vipFilter === 'pending_request'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Chờ kích hoạt ({pendingPinCount})</span>
                {pendingPinCount > 0 && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>

              <button
                type="button"
                onClick={() => setVipFilter('active_pinned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  vipFilter === 'active_pinned'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Đang ghim VIP ({activePinCount})
              </button>

              <button
                type="button"
                onClick={() => setVipFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  vipFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả tin có yêu cầu ({products.filter(p => p.pin_requested || p.is_pinned).length})
              </button>

              <button
                type="button"
                onClick={() => setVipFilter('has_link')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  vipFilter === 'has_link'
                    ? 'bg-[#EE4D2D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Gắn link Shopee ({hasLinkCount})
              </button>

              <button
                type="button"
                onClick={() => setVipFilter('customer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  vipFilter === 'customer'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sản phẩm của khách ({customerCount})
              </button>

              <button
                type="button"
                onClick={() => setVipFilter('all_products')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  vipFilter === 'all_products'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Toàn bộ sản phẩm ({products.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm sản phẩm, người bán, SĐT..."
                value={vipSearch}
                onChange={(e) => setVipSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Cards of Customer Products Registered for Ads */}
          {vipListProducts.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <Crown className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                Không có bài đăng nào trong mục này
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Khi khách hàng bấm đăng ký các gói VIP (1 ngày, 3 ngày, 7 ngày, 30 ngày) trên website, danh sách sẽ tự động xuất hiện tại đây để Admin kích hoạt duyệt ghim.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vipListProducts.map((prod) => {
                const requestedPkgType = prod.pin_requested_package || prod.pin_package || '3_days';
                const pkgInfo = PIN_PACKAGE_INFO[requestedPkgType];
                
                return (
                  <div
                    key={prod.id}
                    className={`bg-white rounded-2xl border-2 transition-all p-4 space-y-4 shadow-sm flex flex-col justify-between ${
                      prod.pin_requested && !prod.is_pinned
                        ? 'border-amber-400 ring-2 ring-amber-200/60'
                        : prod.is_pinned
                        ? 'border-emerald-300 ring-1 ring-emerald-100'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header: Status & Requested Package */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {prod.is_pinned ? (
                          <span className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                            <Crown className="w-3.5 h-3.5 fill-white" />
                            <span>ĐANG GHIM VIP SỐ 1</span>
                          </span>
                        ) : prod.pin_requested ? (
                          <span className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>YÊU CẦU GHIM MỚI</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            Chưa ghim VIP
                          </span>
                        )}

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${pkgInfo.badgeColor}`}>
                          {pkgInfo.name} · {formatVND(pkgInfo.price)}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        #{prod.id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Middle: Product & Customer info */}
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                        alt={prod.title}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>{prod.category}</span>
                          <span>·</span>
                          <span>{prod.condition}</span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {prod.title}
                        </h3>

                        <div className="text-sm font-extrabold text-orange-600 font-mono">
                          {formatVND(prod.price)}
                        </div>

                        {/* Customer note if requested */}
                        {prod.pin_request_note && (
                          <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200/80 italic">
                            "{prod.pin_request_note}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer & Registration details */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Khách hàng: {prod.seller_name}</span>
                        </span>
                        <span className="font-mono text-slate-900 font-bold">
                          {prod.contact_phone || prod.seller_phone || 'Không có SĐT'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Khu vực: {prod.location}</span>
                        <span>Đăng ký: {prod.pin_requested_at ? formatTimeAgoVN(prod.pin_requested_at) : formatTimeAgoVN(prod.created_at)}</span>
                      </div>

                      {prod.is_pinned && prod.pinned_until && (
                        <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Thời hạn ghim đến:</span>
                          </span>
                          <span className="font-mono">
                            {new Date(prod.pinned_until).toLocaleDateString('vi-VN')} ({new Date(prod.pinned_until).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Admin Action Control Row */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* 1-Click Activate Pin Button */}
                        {(!prod.is_pinned || prod.pin_requested) && onPinProduct && (
                          <button
                            type="button"
                            onClick={() => onPinProduct(prod.id, requestedPkgType)}
                            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-all group"
                          >
                            <Zap className="w-3.5 h-3.5 text-yellow-300 group-hover:scale-110 transition-transform" />
                            <span>Duyệt & Ghim {pkgInfo.name} Ngay</span>
                          </button>
                        )}

                        {/* Package selector dropdown for Admin to change package */}
                        {onPinProduct && (
                          <div className="flex items-center gap-1 shrink-0">
                            <select
                              aria-label="Chọn gói ghim khác"
                              value={requestedPkgType}
                              onChange={(e) => {
                                const newPkg = e.target.value as PinPackage;
                                onPinProduct(prod.id, newPkg);
                              }}
                              className="text-xs py-2 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 border border-slate-300 focus:outline-none"
                            >
                              <option value="1_day">Đổi: 1 Ngày (15k)</option>
                              <option value="3_days">Đổi: 3 Ngày (39k)</option>
                              <option value="7_days">Đổi: 7 Ngày (79k)</option>
                              <option value="30_days">Đổi: 30 Ngày (249k)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Secondary actions: Unpin, Reject, Chat with Customer */}
                      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          {prod.is_pinned && onUnpinProduct && (
                            <button
                              type="button"
                              onClick={() => onUnpinProduct(prod.id)}
                              className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition-colors"
                            >
                              Gỡ ghim tin này
                            </button>
                          )}

                          {prod.pin_requested && onRejectPinRequest && (
                            <button
                              type="button"
                              onClick={() => onRejectPinRequest(prod.id)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              Từ chối yêu cầu
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const isLink = Boolean(prod.is_shopee_direct || prod.shopee_affiliate_url);
                              const typeLabel = isLink ? 'sản phẩm gắn link Shopee' : 'sản phẩm của khách';
                              if (confirm(`[Admin] Bạn có chắc chắn muốn xóa vĩnh viễn ${typeLabel}: "${prod.title}"?`)) {
                                onDelete(prod.id);
                              }
                            }}
                            className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa bài</span>
                          </button>
                        </div>

                        {onOpenInAppChat && (
                          <button
                            type="button"
                            onClick={() => onOpenInAppChat(prod)}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Nhắn tin với khách</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: KIỂM DUYỆT BÀI ĐĂNG & GẮN SHOPEE AFFILIATE       */}
      {/* ======================================================== */}
      {activeViewMode === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          
          {/* Left Column (4 cols): Queue of Posts */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            
            {/* Filter Bar */}
            <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm tiêu đề hoặc tên người bán..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'pending', label: `Chờ duyệt (${pendingCount})` },
                  { id: 'vip_pin', label: `Đăng ký VIP (${pendingPinCount + activePinCount})` },
                  { id: 'has_link', label: `Gắn link Shopee (${hasLinkCount})` },
                  { id: 'customer', label: `Của khách (${customerCount})` },
                  { id: 'approved', label: 'Đã duyệt' },
                  { id: 'rejected', label: 'Bị từ chối' },
                  { id: 'all', label: 'Tất cả' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id as any)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      filterStatus === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tab.id === 'vip_pin' && <Crown className="w-3 h-3 text-amber-500" />}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Không có bài viết nào phù hợp bộ lọc.
                </div>
              ) : (
                filteredProducts.map(product => {
                  const isSelected = activeProduct?.id === product.id;
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-orange-50/80 border-l-4 border-l-orange-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={product.images?.[0] || ''}
                        alt={product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            product.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            product.status === 'pending' ? 'bg-amber-100 text-amber-800 font-bold' :
                            product.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {product.status === 'approved' ? 'Đã duyệt' :
                             product.status === 'pending' ? 'Chờ duyệt' :
                             product.status === 'rejected' ? 'Từ chối' : product.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatTimeAgoVN(product.created_at)}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {product.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-orange-600 font-bold font-mono">
                            {formatVND(product.price)}
                          </span>
                          <span className="text-slate-400 truncate max-w-[100px]">
                            {product.seller_name}
                          </span>
                        </div>

                        {/* Customer registered VIP pin badge */}
                        {product.pin_requested && !product.is_pinned && (
                          <div className="text-[10px] text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <span>Đăng ký {PIN_PACKAGE_INFO[product.pin_requested_package || '3_days'].name}</span>
                          </div>
                        )}

                        {product.is_pinned && (
                          <div className="text-[10px] text-purple-800 font-bold flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            <Crown className="w-3 h-3 text-purple-600 fill-purple-600" />
                            <span>Đang ghim VIP</span>
                          </div>
                        )}

                        {product.is_affiliate_active && product.shopee_affiliate_url && (
                          <div className="text-[10px] text-orange-700 font-medium flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3 text-orange-600" />
                            <span>Đã gắn Shopee Link</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-400">
                            {product.is_shopee_direct || product.shopee_affiliate_url ? 'Sản phẩm có link' : 'Tin khách đăng'}
                          </span>
                          <button
                            type="button"
                            title="Xóa vĩnh viễn bài đăng này"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isLink = Boolean(product.is_shopee_direct || product.shopee_affiliate_url);
                              const typeLabel = isLink ? 'sản phẩm gắn link Shopee' : 'sản phẩm của khách';
                              if (confirm(`[Admin] Bạn có chắc chắn muốn xóa vĩnh viễn ${typeLabel}: "${product.title}"?`)) {
                                onDelete(product.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3 h-3 text-rose-500" />
                            <span>Xóa bài</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Split Panel (8 cols): Side-by-side Review & Intervention */}
          {activeProduct ? (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Success Notification Bar */}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đã cập nhật trạng thái bài đăng và cấu hình thành công!</span>
                </div>
              )}

              {/* SECTION: KHỐI QUẢN LÝ GHIM VIP CHO BÀI VIẾT ĐANG CHỌN */}
              <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                        Quản Lý Ghim VIP & Đăng Ký Quảng Cáo Theo Gói
                      </div>
                      <div className="text-[11px] text-amber-700">
                        {activeProduct.is_pinned
                          ? `Bài viết đang được ghim VIP đầu trang (${PIN_PACKAGE_INFO[activeProduct.pin_package || '3_days'].name})`
                          : activeProduct.pin_requested
                          ? `Khách hàng đã đăng ký: ${PIN_PACKAGE_INFO[activeProduct.pin_requested_package || '3_days'].name}`
                          : 'Chưa kích hoạt gói ghim quảng cáo'}
                      </div>
                    </div>
                  </div>

                  {activeProduct.is_pinned ? (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-2xs">
                      ĐANG GHIM VIP
                    </span>
                  ) : activeProduct.pin_requested ? (
                    <span className="px-2.5 py-1 bg-amber-600 text-white font-extrabold text-xs rounded-lg shadow-2xs animate-pulse">
                      YÊU CẦU GHIM MỚI
                    </span>
                  ) : null}
                </div>

                {/* If customer registered advertising */}
                {activeProduct.pin_requested && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Khách hàng yêu cầu: <strong>{PIN_PACKAGE_INFO[activeProduct.pin_requested_package || '3_days'].name}</strong></span>
                        <span className="text-orange-600 font-mono">({formatVND(PIN_PACKAGE_INFO[activeProduct.pin_requested_package || '3_days'].price)})</span>
                      </div>
                      {activeProduct.pin_request_note && (
                        <div className="text-[11px] text-slate-600 italic">
                          Lời nhắn: "{activeProduct.pin_request_note}"
                        </div>
                      )}
                    </div>

                    {onPinProduct && (
                      <button
                        type="button"
                        onClick={() => onPinProduct(activeProduct.id, activeProduct.pin_requested_package || '3_days')}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Kích hoạt gói ghim này ngay</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Package select & trigger buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-700 shrink-0">Chọn gói ghim:</span>
                    <select
                      aria-label="Chọn gói ghim cho bài viết"
                      value={selectedPinPackage}
                      onChange={(e) => setSelectedPinPackage(e.target.value as PinPackage)}
                      className="text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-orange-500 w-full sm:w-auto"
                    >
                      <option value="1_day">Gói VIP 1 Ngày (15.000đ)</option>
                      <option value="3_days">Gói VIP 3 Ngày (39.000đ)</option>
                      <option value="7_days">Gói VIP 7 Ngày - Kim Cương (79.000đ)</option>
                      <option value="30_days">Gói VIP 30 Ngày - Đặc Quyền (249.000đ)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                    {onPinProduct && (
                      <button
                        type="button"
                        onClick={() => onPinProduct(activeProduct.id, selectedPinPackage)}
                        className="flex-1 sm:flex-none py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>{activeProduct.is_pinned ? 'Gia hạn gói ghim' : 'Kích hoạt ghim VIP'}</span>
                      </button>
                    )}

                    {activeProduct.is_pinned && onUnpinProduct && (
                      <button
                        type="button"
                        onClick={() => onUnpinProduct(activeProduct.id)}
                        className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl font-bold text-xs transition-colors"
                      >
                        Gỡ ghim
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Split Screen Container: Preview & Shopee Affiliate Engine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SECTION III.2 - KHU VỰC XEM TRƯỚC (PREVIEW NỘI DUNG NGƯỜI ĐĂNG) */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Khu vực xem trước (Người đăng)
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: #{activeProduct.id.slice(-6)}
                    </span>
                  </div>

                  {/* Main Image & Gallery Strip */}
                  <div className="space-y-2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={activeProduct.images?.[0] || ''}
                        alt={activeProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {activeProduct.images && activeProduct.images.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {activeProduct.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-12 h-12 rounded-md object-cover border border-slate-200 shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specs & Title */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">
                      {activeProduct.category} · {activeProduct.condition} · {activeProduct.location}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {activeProduct.title}
                    </h3>
                    <div className="text-lg font-bold text-orange-600 font-mono mt-1">
                      {formatVND(activeProduct.price)}
                    </div>
                  </div>

                  {/* Description Text */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="font-semibold text-slate-800">Mô tả của khách bán:</div>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed text-slate-600 text-[11px]">
                      {activeProduct.description}
                    </p>
                  </div>

                  {/* Anti-link Audit Badge */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bộ lọc tự động: Không phát hiện liên kết quảng cáo spam.</span>
                  </div>

                  {/* Seller Info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800">{activeProduct.seller_name}</span>
                        <div className="text-[10px] text-slate-400 font-mono">{activeProduct.contact_phone || activeProduct.seller_phone}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatTimeAgoVN(activeProduct.created_at)}
                    </span>
                  </div>
                </div>

                {/* SECTION III.2 - KHU VỰC CAN THIỆP CỦA QUẢN TRỊ VIÊN (SHOPEE AFFILIATE ENGINE) */}
                <div className="bg-gradient-to-b from-orange-50/60 to-white rounded-xl border-2 border-orange-200 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-800">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>Can thiệp Quản trị viên (Admin)</span>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                      Shopee Affiliate
                    </span>
                  </div>

                  {/* Toggle: Kích hoạt hiển thị Shopee Affiliate */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Kích hoạt Shopee Affiliate
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Bật/Tắt hiển thị nút tiếp thị hoa hồng
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={affiliateActive}
                        onChange={(e) => setAffiliateActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Quick Auto-Fill helper */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Tạo link nhanh:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('shopee_search')}
                      className="text-[11px] px-2 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded font-medium transition-colors"
                    >
                      Gợi ý từ tiêu đề
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('shopee_flash_deal')}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                    >
                      Deal Hot Shopee
                    </button>
                  </div>

                  {/* Ô nhập liệu 1: Đường dẫn Shopee Affiliate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>1. Đường dẫn Shopee Affiliate (Link của Admin)</span>
                      <Link className="w-3.5 h-3.5 text-orange-600" />
                    </label>
                    <input
                      type="url"
                      value={affiliateUrl}
                      onChange={(e) => setAffiliateUrl(e.target.value)}
                      placeholder="https://shopee.vn/universal-link?...&aff_trace_key=..."
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                      * Mở sang tab mới kèm mã hóa tracking của Admin để ghi nhận hoa hồng.
                    </div>
                  </div>

                  {/* Ô nhập liệu 2: Nội dung hiển thị trên nút mua hàng */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      2. Nội dung hiển thị trên nút ấn (CTA Button)
                    </label>
                    <input
                      type="text"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      placeholder="VD: Xem giá ưu đãi trên Shopee Mall, Mua hàng mới chính hãng"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  {/* Ô nhập liệu 3 (mở rộng): Liên kết phụ trợ / phụ kiện */}
                  <div className="space-y-1.5 pt-2 border-t border-orange-100">
                    <label className="block text-xs font-bold text-slate-800">
                      3. Liên kết phụ trợ (Phụ kiện đi kèm trên Shopee)
                    </label>
                    <input
                      type="text"
                      value={subLabel}
                      onChange={(e) => setSubLabel(e.target.value)}
                      placeholder="Tên nút phụ, VD: Mua bao da & sạc chính hãng"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="url"
                      value={subUrl}
                      onChange={(e) => setSubUrl(e.target.value)}
                      placeholder="https://shopee.vn/search?keyword=phukien..."
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Rejection reason box if rejecting */}
                  {showRejectBox && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                      <label className="block text-xs font-bold text-rose-900">
                        Nhập lý do từ chối bài đăng:
                      </label>
                      <textarea
                        rows={2}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="VD: Ảnh chụp không rõ nét, sai danh mục, giá quá chênh lệch..."
                        className="w-full p-2 text-xs border border-rose-300 rounded bg-white focus:outline-none focus:border-rose-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRejectBox(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-rose-100 rounded"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleReject}
                          className="px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded"
                        >
                          Xác nhận từ chối
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION III.2 - CÁC NÚT THAO TÁC NHANH */}
                  <div className="pt-3 border-t border-orange-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Thao tác nhanh cho Quản trị viên:
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Duyệt bài */}
                      <button
                        type="button"
                        onClick={handleApprove}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Duyệt bài & Xuất bản</span>
                      </button>

                      {/* Từ chối */}
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(true)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối bài</span>
                      </button>

                      {/* Ẩn bài */}
                      <button
                        type="button"
                        onClick={handleToggleHide}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium text-xs transition-colors"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{activeProduct.status === 'hidden' ? 'Bỏ ẩn bài' : 'Ẩn bài viết'}</span>
                      </button>

                      {/* Xóa bài */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Xác nhận xóa vĩnh viễn bài đăng: "${activeProduct.title}"?`)) {
                            onDelete(activeProduct.id);
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg font-medium text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa bài vĩnh viễn</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              Chọn một bài đăng từ danh sách bên trái để bắt đầu kiểm duyệt.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
