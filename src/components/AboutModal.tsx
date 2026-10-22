import React from 'react';
import { X, Headphones, ShieldCheck, Sparkles, MessageSquare, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveChat: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenLiveChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              24h
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Giới Thiệu Chợ Việt 24h & Kênh Hỗ Trợ
              </h3>
              <p className="text-xs text-orange-200">
                Sàn Mua Bán & Rao Vặt Trực Tuyến Toàn Quốc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-slate-700 text-sm max-h-[75vh] overflow-y-auto">
          
          {/* Section: Giới thiệu chung */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>1. Về Nền Tảng Chợ Việt 24h</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Chợ Việt 24h</strong> là sàn thương mại điện tử và cổng rao vặt C2C trực tiếp giữa người mua và người bán trên toàn quốc. Nền tảng cho phép người dùng đăng tin thanh lý đồ cũ, mua bán đồ công nghệ, gia dụng, xe máy với hệ thống nhắn tin trao đổi nội bộ bảo mật kèm cảnh báo thông báo về số Zalo đã đăng ký. Ngoài ra, website tích hợp hệ thống gợi ý sản phẩm chính hãng Shopee Mall giúp người mua có thêm lựa chọn uy tín, có bảo hành đầy đủ.
            </p>
          </div>

          {/* Section: Quy định hỗ trợ & Bảo mật SĐT Admin */}
          <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200/90 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Kênh Hỗ Trợ Ban Quản Trị (Admin)</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-rose-600">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Chính sách bảo mật: Không cung cấp SĐT / Hotline Admin</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Để bảo vệ quyền riêng tư, tránh tình trạng giả mạo danh nghĩa Admin qua điện thoại và đảm bảo mọi trao đổi hỗ trợ đều được lưu vết minh bạch, Ban Quản Trị <strong>không công khai và không hỗ trợ qua số điện thoại cá nhân</strong>.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phương thức hỗ trợ DUY NHẤT: Nhắn tin trực tiếp trên web</span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed">
                Người dùng và người bán cần hỗ trợ vui lòng nhắn tin trực tiếp qua <strong>cửa sổ Chat Hỗ Trợ 24/7</strong> ở góc dưới màn hình. Admin và đội ngũ quản trị viên trực tuyến phản hồi ngay lập tức.
              </p>
            </div>
          </div>

          {/* Section: Các dịch vụ hỗ trợ trực tiếp */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Headphones className="w-4 h-4 text-orange-600" />
              <span>3. Các Yêu Cầu Được Giải Quyết Trực Tiếp Qua Chat</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                <span>Tư vấn & kích hoạt gói VIP ghim tin</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                <span>Yêu cầu duyệt bài đăng nhanh</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                <span>Báo cáo bài đăng nghi ngờ lừa đảo</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                <span>Hỗ trợ kỹ thuật và khôi phục tài khoản</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenLiveChat();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 text-yellow-200 group-hover:scale-110 transition-transform" />
              <span>Nhắn tin hỗ trợ trực tiếp với Admin ngay (24/7)</span>
              <ArrowRight className="w-4 h-4 text-orange-200" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
