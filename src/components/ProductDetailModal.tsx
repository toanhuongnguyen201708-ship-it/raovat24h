import React, { useState } from 'react';
import { Product } from '../types';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import {
  X,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  MousePointerClick,
  Share2,
  Check,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Crown,
  MessageSquare,
  Zap,
  BellRing,
  Trash2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAffiliateClick: (productId: string, url: string) => void;
  onOpenZaloChat: (phone: string, sellerName: string, productTitle: string) => void;
  onOpenInAppChat?: (product: Product) => void;
  onOpenPinModal?: (product: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAffiliateClick,
  onOpenZaloChat,
  onOpenInAppChat,
  onOpenPinModal,
  isAdmin = false,
  onDeleteProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const currentImage = product.images?.[selectedImageIndex] || product.images?.[0] || '';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>Mã tin: #{product.id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sao chép liên kết chia sẻ"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Gallery & Info */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Showcase Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={currentImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.is_pinned && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 text-xs font-extrabold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 border border-yellow-200">
                  <Crown className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
                  <span>TIN GHIM VIP</span>
                </div>
              )}
              {product.status === 'sold' && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <span className="px-4 py-1.5 bg-white text-slate-900 font-bold text-sm tracking-wide rounded">
                    SẢN PHẨM ĐÃ ĐƯỢC BÁN
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-orange-600 ring-2 ring-orange-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Ảnh ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Mô tả chi tiết từ người bán:</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Safety Disclaimer for Buyer */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Lưu ý an toàn khi mua rao vặt C2C: </span>
                Nên gặp trực tiếp kiểm tra hàng tại nơi công cộng trước khi thanh toán. Không chuyển khoản đặt cọc trước cho người lạ.
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & 2 Distinct Action Blocks */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-5">
              {/* Product Headline */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{product.condition}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgoVN(product.created_at)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3" />
                    {product.views_count} lượt xem
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Price Display */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Giá người bán đăng:</div>
                <div className="text-2xl font-bold text-orange-600 font-mono tabular-nums tracking-tight mt-0.5">
                  {formatVND(product.price)}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Khu vực: {product.location}</span>
                </div>
              </div>

              {/* KHỐI 1: GIAO DỊCH VỚI NGƯỜI BÁN (C2C TRANSACTION) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={product.seller_name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{product.seller_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {product.is_shopee_direct ? 'Shopee Mall Chính Hãng' : 'Người bán cá nhân'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    {product.is_shopee_direct ? 'Chính Hãng 100%' : 'Đã xác thực'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {(product.is_shopee_direct || Boolean(product.shopee_affiliate_url)) ? 'Đặt mua trực tiếp Shopee Mall' : 'Khối 1: Giao dịch trực tiếp với người bán (C2C)'}
                </div>

                <div className="flex flex-col gap-2">
                  {/* For Shopee products: Replace in-app chat with 'Mua ngay' button that jumps to Shopee */}
                  {(product.is_shopee_direct || Boolean(product.shopee_affiliate_url)) ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (product.shopee_affiliate_url) {
                            onAffiliateClick(product.id, product.shopee_affiliate_url);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#EE4D2D] hover:bg-[#d73f20] text-white rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg active:scale-[0.99] group cursor-pointer"
                      >
                        <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        <span>Mua ngay</span>
                        <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Đảm bảo Shopee · Trả hàng 15 ngày
                        </span>
                        <span className="text-[10px] bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded border border-orange-200">
                          Chuyển đến Shopee
                        </span>
                      </div>
                    </div>
                  ) : (
                    onOpenInAppChat && (
                      <button
                        type="button"
                        onClick={() => onOpenInAppChat(product)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm group"
                      >
                        <MessageSquare className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
                        <span>Nhắn tin cho người bán trên Web</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">
                          Báo về Zalo
                        </span>
                      </button>
                    )
                  )}

                  {/* Button 2: Call Phone - Only for regular C2C sellers with valid non-admin phone */}
                  {product.contact_phone && product.contact_phone !== '0961513578' && !product.is_shopee_direct && !product.seller_name?.toLowerCase().includes('admin') && (
                    showPhone ? (
                      <a
                        href={`tel:${product.contact_phone}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{product.contact_phone} (Bấm để gọi ngay)</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowPhone(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Bấm để hiện số điện thoại</span>
                      </button>
                    )
                  )}

                  {/* Button 3: Chat Zalo App - Only for regular C2C sellers with valid non-admin phone */}
                  {product.contact_phone && product.contact_phone !== '0961513578' && !product.is_shopee_direct && !product.seller_name?.toLowerCase().includes('admin') && (
                    <button
                      onClick={() => onOpenZaloChat(product.contact_phone, product.seller_name, product.title)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Trò chuyện qua Zalo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* KHỐI QUẢNG CÁO: DỊCH VỤ TĂNG VIP & GHIM TIN LÊN ĐẦU TRANG */}
              {onOpenPinModal && (
                <button
                  type="button"
                  onClick={() => onOpenPinModal(product)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 hover:border-amber-400 rounded-xl transition-all group shadow-2xs text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                      <Crown className="w-4 h-4 text-yellow-100" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950 group-hover:text-orange-700">
                        {product.is_pinned ? 'Tin này đang được ghim VIP' : 'Dịch vụ tăng VIP: Ghim tin số 1'}
                      </div>
                      <div className="text-[11px] text-amber-700">
                        {product.is_pinned ? 'Nhắn riêng Admin gia hạn gói VIP' : 'Nhắn tin riêng với Admin để ghim hiển thị đầu trang'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600 shrink-0">
                    <span>{product.is_pinned ? 'Gia hạn' : 'Tăng VIP'}</span>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                </button>
              )}


              {/* KHỐI 2: TIẾP THỊ LIÊN KẾT CỦA QUẢN TRỊ VIÊN (SHOPEE AFFILIATE ENGINE) */}
              {!product.is_shopee_direct && product.is_affiliate_active && product.shopee_affiliate_url && (
                <div className="p-4 rounded-xl border-2 border-orange-200 bg-gradient-to-b from-orange-50/70 via-orange-50/40 to-white relative overflow-hidden shadow-sm space-y-3">
                  {/* Subtle Shopee ribbon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>Gợi ý chính hãng dành cho bạn</span>
                    </div>
                    <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                      Shopee Mall
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tham khảo sản phẩm chính hãng hoặc sản phẩm tương tự có bảo hành và bảo vệ thanh toán trên Shopee.
                  </p>

                  {/* Main CTA Affiliate Button */}
                  <button
                    onClick={() => onAffiliateClick(product.id, product.shopee_affiliate_url)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#EE4D2D] to-[#F05D40] hover:from-[#d73f20] hover:to-[#db4f33] text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] group cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>{product.shopee_button_label || 'Mua ngay'}</span>
                    <ExternalLink className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Optional Sub-link for Accessories */}
                  {product.shopee_sub_url && (
                    <button
                      onClick={() => onAffiliateClick(product.id, product.shopee_sub_url!)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-orange-50/80 border border-orange-200 text-xs font-semibold text-orange-800 rounded-lg transition-colors"
                    >
                      <span>{product.shopee_sub_label || 'Xem phụ kiện đi kèm trên Shopee'}</span>
                      <ExternalLink className="w-3 h-3 text-orange-600" />
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-orange-100">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Đảm bảo Shopee · Trả hàng 15 ngày
                    </span>
                    <span className="font-mono text-slate-400">
                      {product.affiliate_clicks_count} lượt quan tâm
                    </span>
                  </div>
                </div>
              )}

              {/* KHU VỰC DÀNH RIÊNG CHO ADMIN: QUẢN LÝ & XÓA SẢN PHẨM KHÁCH / GẮN LINK */}
              {isAdmin && onDeleteProduct && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>Quản trị viên hệ thống</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                      {product.is_shopee_direct || product.shopee_affiliate_url ? 'Sản phẩm có link' : 'Sản phẩm của khách'}
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Bạn có toàn quyền xóa bỏ sản phẩm của khách đăng hoặc sản phẩm đã gắn link này khỏi hệ thống ngay lập tức.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      const isLink = Boolean(product.is_shopee_direct || product.shopee_affiliate_url);
                      const typeLabel = isLink ? 'sản phẩm gắn link Shopee' : 'sản phẩm của khách';
                      if (window.confirm(`[Admin] Bạn có chắc chắn muốn xóa vĩnh viễn ${typeLabel}: "${product.title}"?`)) {
                        onDeleteProduct(product.id);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa sản phẩm này vĩnh viễn (Quyền Admin)</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
