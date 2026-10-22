import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink, Send } from 'lucide-react';

interface ZaloChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerPhone: string;
  sellerName: string;
  productTitle: string;
}

export const ZaloChatModal: React.FC<ZaloChatModalProps> = ({
  isOpen,
  onClose,
  sellerPhone,
  sellerName,
  productTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    `Chào ${sellerName}, mình đang quan tâm đến sản phẩm "${productTitle}" bạn đăng trên Chợ Việt 24h. Sản phẩm còn không bạn?`
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(sellerPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenZaloWeb = () => {
    // Standard Zalo direct web chat URL
    window.open(`https://zalo.me/${sellerPhone.replace(/\D/g, '')}`, '_blank');
  };

  const handleSimulatedSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Zalo blue */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0068FF] text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <div className="text-sm font-bold">Trò chuyện qua Zalo</div>
              <div className="text-[11px] text-blue-100">Kết nối trực tiếp với người bán</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-xs text-slate-500">Người bán:</div>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{sellerName}</span>
              <span className="font-mono text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {sellerPhone}
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate mt-1">
              Tin: {productTitle}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenZaloWeb}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <span>Mở Zalo.me</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyPhone}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Đã chép số SĐT' : 'Chép số SĐT'}</span>
            </button>
          </div>

          {/* Chat simulator input */}
          <form onSubmit={handleSimulatedSend} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Soạn tin nhắn gửi tới người bán:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0068FF]"
            />

            {sentSuccess ? (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded text-center font-medium">
                Đã gửi tin nhắn mẫu đến người bán thành công!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời nhắn nhanh</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
