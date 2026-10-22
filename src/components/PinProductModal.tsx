import React, { useState } from 'react';
import { Product, User, PinPackage } from '../types';
import { pinProduct, unpinProduct, requestPinProduct, sendAdminSupportMessage } from '../services/storage';
import { formatVND } from '../utils/security';
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  MessageCircle,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';

interface PinProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  userProducts?: Product[];
  currentUser: User | null;
  onPinSuccess: (updatedProduct: Product) => void;
}

const PIN_PACKAGES = [
  {
    type: '1_day' as const,
    name: 'Gói VIP 1 Ngày',
    days: 1,
    price: 15000,
    tag: 'Dùng thử nhanh',
    features: ['Ghim đầu trang chủ 24h', 'Huy hiệu VIP Nổi Bật', 'Tăng 2x lượt tiếp cận'],
    recommended: false,
  },
  {
    type: '3_days' as const,
    name: 'Gói VIP 3 Ngày',
    days: 3,
    price: 39000,
    tag: 'Tiết kiệm 15%',
    features: ['Ghim đầu trang chủ 72h', 'Huy hiệu VIP Vàng Kim', 'Tăng 5x lượt xem', 'Ưu tiên kết quả tìm kiếm'],
    recommended: true,
  },
  {
    type: '7_days' as const,
    name: 'Gói VIP 7 Ngày (Kim Cương)',
    days: 7,
    price: 79000,
    tag: 'Bán chạy nhất',
    features: ['Ghim trọn tuần số 1 sàn', 'Huy hiệu Kim Cương VIP', 'Tăng 10x tương tác', 'Admin tư vấn bài đăng 1-1', 'Đẩy bài tự động mỗi ngày'],
    recommended: false,
  },
  {
    type: '30_days' as const,
    name: 'Gói VIP 30 Ngày (Đặc Quyền)',
    days: 30,
    price: 249000,
    tag: 'Siêu tiết kiệm',
    features: ['Ghim toàn sàn suốt 1 tháng', 'Huy hiệu Vương Miện VIP', 'Tăng tối đa doanh số', 'Được Admin ưu tiên ghim top 1'],
    recommended: false,
  },
];

export const PinProductModal: React.FC<PinProductModalProps> = ({
  isOpen,
  onClose,
  product,
  userProducts = [],
  currentUser,
  onPinSuccess,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    product?.id || userProducts[0]?.id || ''
  );
  const [selectedPackage, setSelectedPackage] = useState<PinPackage>('3_days');
  const [isProcessingAdmin, setIsProcessingAdmin] = useState(false);

  if (!isOpen) return null;

  const currentSelectedProduct =
    product?.id === selectedProductId
      ? product
      : userProducts.find((p) => p.id === selectedProductId) || product || userProducts[0];

  const activePackage = PIN_PACKAGES.find((p) => p.type === selectedPackage)!;

  // Handle direct private messaging with Admin & register the pin request
  const handleContactAdminViaWebChat = () => {
    if (!currentSelectedProduct) return;

    // Register customer's pin advertisement request in the system for Admin
    const updatedProd = requestPinProduct(currentSelectedProduct.id, selectedPackage);
    if (updatedProd) {
      onPinSuccess(updatedProd);
    }

    const msg = `Chào Admin, tôi đã đăng ký ${activePackage.name} (${formatVND(activePackage.price)}) cho sản phẩm: "${currentSelectedProduct.title}" (Mã tin: ${currentSelectedProduct.id.slice(-6).toUpperCase()}). Nhờ Admin kiểm tra và duyệt kích hoạt ghim VIP giúp tôi nhé!`;
    
    // Send message to Admin Live Support
    sendAdminSupportMessage(currentUser, msg);

    // Open Admin live chat window
    window.dispatchEvent(new CustomEvent('open_admin_live_support'));

    // Close this modal
    onClose();
  };

  // Admin fast activation (only available for admin role testing/management)
  const handleAdminDirectActivate = () => {
    if (!currentSelectedProduct) return;
    setIsProcessingAdmin(true);
    setTimeout(() => {
      const updated = pinProduct(currentSelectedProduct.id, selectedPackage);
      if (updated) {
        onPinSuccess(updated);
      }
      setIsProcessingAdmin(false);
      onClose();
    }, 400);
  };

  const handleUnpin = () => {
    if (!currentSelectedProduct) return;
    const updated = unpinProduct(currentSelectedProduct.id);
    if (updated) {
      onPinSuccess(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full my-8 shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-yellow-200 shadow-xs">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-yellow-100 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dịch Vụ Tăng VIP Chợ Việt 24h</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight">
                Nhắn Tin Riêng Với Admin Để Tăng VIP
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Select Product if user has multiple products and no single product passed */}
          {userProducts.length > 1 && !product && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Chọn tin đăng bạn muốn tăng VIP:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium bg-white focus:outline-none focus:border-orange-500"
              >
                {userProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {formatVND(p.price)} {p.is_pinned ? '(Đang ghim VIP)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current Product Preview */}
          {currentSelectedProduct && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3">
              <img
                src={currentSelectedProduct.images[0]}
                alt=""
                className="w-14 h-14 rounded-lg object-cover border border-amber-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {currentSelectedProduct.title}
                </h4>
                <div className="text-xs font-extrabold text-orange-600 font-mono">
                  {formatVND(currentSelectedProduct.price)}
                </div>
                {currentSelectedProduct.is_pinned ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-bold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tin này đang được ghim VIP số 1 Bảng tin</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500">
                    Sẽ được hiển thị vị trí số 1 nổi bật toàn trang sau khi Admin kích hoạt
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Package Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Chọn gói tăng VIP bạn quan tâm:</span>
              <span className="text-[11px] text-orange-600 font-medium lowercase">hỗ trợ trao đổi riêng 1-1</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {PIN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.type}
                  onClick={() => setSelectedPackage(pkg.type)}
                  className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPackage === pkg.type
                      ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-1 ring-orange-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                      Khuyên dùng
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPackage === pkg.type
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedPackage === pkg.type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{pkg.name}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{pkg.tag}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-orange-600 font-mono">
                        {formatVND(pkg.price)}
                      </div>
                      <div className="text-[10px] text-slate-400">/{pkg.days} ngày</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Private Messaging Consultation Notice */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Quy trình kích hoạt VIP trực tiếp với Admin:</div>
                <div className="text-[11px] text-slate-300">
                  Admin sẽ kiểm tra bài đăng, tư vấn vị trí ghim tối ưu và kích hoạt ghim VIP nhanh chóng cho bạn.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cam kết hỗ trợ nhiệt tình 1-1</span>
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Hỗ trợ trực tiếp trên web</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Message Admin Privately */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleContactAdminViaWebChat}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-yellow-200" />
              <span>Nhắn tin riêng với Admin để tăng VIP</span>
            </button>

            {/* If product is pinned, allow unpinning */}
            {currentSelectedProduct?.is_pinned && (
              <button
                type="button"
                onClick={handleUnpin}
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
              >
                Hủy ghim tin này
              </button>
            )}

            {/* Admin-only direct activation shortcut */}
            {currentUser?.role === 'admin' && (
              <div className="mt-3 pt-3 border-t border-dashed border-slate-200 text-center">
                <div className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">
                  Dành riêng cho Quản trị viên (Admin Mode)
                </div>
                <button
                  type="button"
                  onClick={handleAdminDirectActivate}
                  disabled={isProcessingAdmin}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isProcessingAdmin ? 'Đang kích hoạt...' : `Kích hoạt ngay (${activePackage.name})`}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
