import React, { useState } from 'react';
import { User, Conversation, ZaloNotification, Product } from '../types';
import {
  getStoredConversations,
  getStoredZaloNotifications
} from '../services/storage';
import { formatTimeAgoVN } from '../utils/security';
import {
  X,
  MessageSquare,
  BellRing,
  CheckCircle2,
  Phone,
  ArrowRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface ConversationsInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  products: Product[];
  onSelectConversation: (product: Product) => void;
  onOpenZaloApp?: (phone: string, sellerName: string, productTitle: string) => void;
}

export const ConversationsInboxModal: React.FC<ConversationsInboxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  products,
  onSelectConversation,
  onOpenZaloApp,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'zalo'>('chats');
  const conversations = getStoredConversations();
  const zaloNotifications = getStoredZaloNotifications();

  if (!isOpen) return null;

  // Filter conversations relevant to current user (as buyer or seller)
  const myConversations = currentUser
    ? conversations.filter(
        (c) => c.buyer_id === currentUser.id || c.seller_id === currentUser.id
      )
    : conversations;

  const handleOpenChat = (conv: Conversation) => {
    const product = products.find((p) => p.id === conv.product_id) || {
      id: conv.product_id,
      user_id: conv.seller_id,
      seller_name: conv.seller_name,
      seller_phone: conv.seller_phone,
      title: conv.product_title,
      description: '',
      category: 'Đồ điện tử',
      price: conv.product_price,
      condition: 'Đã qua sử dụng',
      location: 'Hà Nội',
      images: [conv.product_image],
      contact_phone: conv.seller_phone,
      status: 'approved',
      shopee_affiliate_url: '',
      shopee_button_label: '',
      is_affiliate_active: false,
      views_count: 1,
      affiliate_clicks_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product;

    onSelectConversation(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full h-[550px] max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hộp Thư Tin Nhắn & Thông Báo Zalo
            </h3>
            <p className="text-xs text-slate-500">
              Quản lý các cuộc trò chuyện mua bán trực tiếp trên Chợ Việt 24h
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'chats'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tin Nhắn Web ({myConversations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('zalo')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'zalo'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BellRing className="w-4 h-4 text-emerald-600" />
            <span>Thông Báo Zalo Tự Động ({zaloNotifications.length})</span>
          </button>
        </div>

        {/* Tab 1: Chat Conversations */}
        {activeTab === 'chats' && (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {myConversations.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Chưa có cuộc trò chuyện nào</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Bấm vào nút "Nhắn tin cho người bán" trên bất kỳ bài đăng nào để bắt đầu trò chuyện trực tiếp!
                </p>
              </div>
            ) : (
              myConversations.map((conv) => {
                const isSeller = currentUser?.id === conv.seller_id;
                const otherPartyName = isSeller ? conv.buyer_name : conv.seller_name;
                const unread = isSeller ? conv.unread_seller : conv.unread_buyer;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleOpenChat(conv)}
                    className="p-3 hover:bg-orange-50/50 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={conv.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {otherPartyName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatTimeAgoVN(conv.last_message_time)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-medium">
                          {conv.product_title}
                        </div>
                        <div className="text-xs text-slate-600 truncate mt-0.5">
                          {conv.last_message || 'Bấm để xem cuộc trò chuyện'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {unread > 0 && (
                        <span className="w-5 h-5 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Automated Zalo Notifications Log */}
        {activeTab === 'zalo' && (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Hệ thống Chợ Việt 24h tự động gửi thông báo tin nhắn và cuộc gọi đến số Zalo đã đăng ký của người bán.
              </span>
            </div>

            {zaloNotifications.map((notif) => (
              <div key={notif.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Zalo gửi tới: {notif.phone}</span>
                    <span className="text-[11px] text-slate-500 font-normal">({notif.receiver_name})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatTimeAgoVN(notif.created_at)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-orange-900">
                  {notif.title}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg font-sans">
                  {notif.content}
                </p>

                {onOpenZaloApp && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenZaloApp(notif.phone, notif.receiver_name, notif.product_title || '')}
                      className="text-xs text-[#0068FF] hover:underline font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Mở Zalo với {notif.phone}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
