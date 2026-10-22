import React, { useState, useEffect, useRef } from 'react';
import { Product, User, Conversation, ChatMessage } from '../types';
import {
  getStoredConversations,
  sendChatMessage,
  getOrCreateConversation,
  markConversationAsRead
} from '../services/storage';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import {
  X,
  Send,
  MessageSquare,
  Image as ImageIcon,
  CheckCheck,
  Check,
  Phone,
  Sparkles,
  ShieldCheck,
  BellRing,
  Camera,
  ExternalLink
} from 'lucide-react';

interface InAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currentUser: User | null;
  onRequireLogin: () => void;
  onOpenZaloApp?: (phone: string, sellerName: string, productTitle: string) => void;
}

const QUICK_REPLIES = [
  'Sản phẩm này còn không bạn?',
  'Giá này có bớt chút xăng xe được không ạ?',
  'Cho mình xem thêm ảnh và video thực tế với.',
  'Mình có thể qua xem hàng trực tiếp lúc nào?',
  'Có hỗ trợ gửi COD hoặc giao hỏa tốc không bạn?',
];

export const InAppChatModal: React.FC<InAppChatModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUser,
  onRequireLogin,
  onOpenZaloApp,
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [attachmentImage, setAttachmentImage] = useState<string | null>(null);
  const [zaloAlertNotice, setZaloAlertNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load or create conversation for this product and current user
  useEffect(() => {
    if (!isOpen || !product) return;

    if (!currentUser) {
      setConversation(null);
      return;
    }

    const conv = getOrCreateConversation(product, currentUser);
    setConversation(conv);
    markConversationAsRead(conv.id, currentUser.id);
  }, [isOpen, product, currentUser]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!isOpen || !product) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim() && !attachmentImage) return;

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!conversation) return;

    try {
      const { conversation: updatedConv } = sendChatMessage(
        conversation.id,
        currentUser,
        text.trim(),
        attachmentImage || undefined
      );

      setConversation(updatedConv);
      setInputText('');
      setAttachmentImage(null);

      // Show real-time automated Zalo dispatch feedback
      const sellerPhone = product.contact_phone || product.seller_phone;
      setZaloAlertNotice(`Đã tự động gửi thông báo tin nhắn mới tới Zalo số ${sellerPhone}!`);
      setTimeout(() => setZaloAlertNotice(null), 4000);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAttachmentImage(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full h-[600px] max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={product.seller_name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{product.seller_name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-medium">
                  Trực tuyến
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>SĐT: {product.contact_phone}</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-mono text-[11px]">Zalo Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenZaloApp && (
              <button
                type="button"
                onClick={() => onOpenZaloApp(product.contact_phone, product.seller_name, product.title)}
                className="px-2.5 py-1.5 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Chuyển sang ứng dụng Zalo"
              >
                <span>Mở Zalo</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Snippet Bar */}
        <div className="px-4 py-2.5 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-11 h-11 rounded-lg object-cover border border-orange-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
              <div className="text-xs font-extrabold text-orange-600 font-mono">
                {formatVND(product.price)}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 shrink-0 text-right">
            <span>Khu vực: </span>
            <span className="font-semibold text-slate-700">{product.location}</span>
          </div>
        </div>

        {/* Automated Zalo Alert Notification Banner */}
        {zaloAlertNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center gap-2 animate-fadeIn shrink-0">
            <BellRing className="w-4 h-4 text-emerald-200 animate-bounce shrink-0" />
            <span className="font-medium">{zaloAlertNotice}</span>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
          
          {/* Welcome & Automated Zalo Dispatch Info */}
          <div className="text-center py-2 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hệ thống chat nội bộ bảo mật Chợ Việt 24h</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
              Mọi tin nhắn bạn gửi tại đây sẽ được hệ thống <strong>tự động chuyển tiếp thông báo tới Zalo của người bán</strong>, giúp người bán nhận được tin nhắn tức thì.
            </p>
          </div>

          {/* If user is not logged in */}
          {!currentUser ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs my-6">
              <MessageSquare className="w-10 h-10 text-orange-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">
                Đăng nhập để trò chuyện trực tiếp với người bán
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Đăng nhập bằng số điện thoại để người bán có thể nhận diện và phản hồi tin nhắn của bạn.
              </p>
              <button
                type="button"
                onClick={onRequireLogin}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : conversation?.messages.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-slate-400">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
              <p className="text-xs text-slate-500 font-medium">
                Hãy chọn một tin nhắn nhanh bên dưới hoặc gõ lời chào để bắt đầu!
              </p>
            </div>
          ) : (
            conversation?.messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-orange-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Đính kèm"
                        className="rounded-lg max-h-48 w-auto object-cover mb-1.5 border border-black/10"
                      />
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1 font-mono">
                    <span>{formatTimeAgoVN(msg.created_at)}</span>
                    {isMe && (
                      <span>
                        {msg.read ? (
                          <CheckCheck className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Suggestions */}
        {currentUser && (
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 pl-1">
              Gợi ý:
            </span>
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(reply)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-full text-xs text-slate-600 whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Attachment preview if selected */}
        {attachmentImage && (
          <div className="px-4 py-2 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={attachmentImage} alt="" className="w-10 h-10 object-cover rounded-md border" />
              <span className="text-xs text-orange-900 font-medium">Đã chọn 1 ảnh đính kèm</span>
            </div>
            <button
              onClick={() => setAttachmentImage(null)}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Hủy ảnh
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          {/* Attach Image Button */}
          <label className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors" title="Gửi ảnh">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Camera className="w-5 h-5" />
          </label>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!currentUser}
            placeholder={
              currentUser
                ? 'Nhập tin nhắn cho người bán (Tự động báo về Zalo)...'
                : 'Vui lòng đăng nhập để gửi tin nhắn...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!currentUser || (!inputText.trim() && !attachmentImage)}
            className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-40 shadow-xs flex items-center justify-center shrink-0"
            title="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
