import React, { useState, useEffect, useRef } from 'react';
import { User, AdminSupportMessage } from '../types';
import {
  getStoredAdminSupportMessages,
  sendAdminSupportMessage
} from '../services/storage';
import { formatTimeAgoVN } from '../utils/security';
import {
  Headphones,
  X,
  Send,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCheck,
  ChevronDown
} from 'lucide-react';

interface AdminLiveSupportProps {
  currentUser: User | null;
  onOpenPinModal?: () => void;
}

const SUPPORT_TOPICS = [
  'Tư vấn đăng ký dịch vụ tăng VIP',
  'Gói ghim tin nổi bật lên đầu',
  'Nhờ Admin duyệt bài đăng gấp',
  'Báo cáo tin đăng có dấu hiệu lừa đảo',
];

export const AdminLiveSupport: React.FC<AdminLiveSupportProps> = ({
  currentUser,
  onOpenPinModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AdminSupportMessage[]>(getStoredAdminSupportMessages());
  const [inputText, setInputText] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getStoredAdminSupportMessages());
  }, [isOpen]);

  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      setIsOpen(true);
      setMessages(getStoredAdminSupportMessages());
    };
    window.addEventListener('open_admin_live_support', handleOpenEvent);
    return () => window.removeEventListener('open_admin_live_support', handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim()) return;

    const updated = sendAdminSupportMessage(currentUser, text.trim());
    setMessages(updated);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-900 to-orange-700 hover:from-black hover:to-orange-800 text-white rounded-full shadow-2xl hover:shadow-orange-500/20 border-2 border-white transition-all transform hover:scale-105 group"
            title="Nhắn tin hỗ trợ trực tiếp với Admin Chợ Việt 24h"
          >
            <div className="relative">
              <Headphones className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight">Hỗ trợ trực tiếp</div>
              <div className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Trực tuyến 24/7</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Messenger Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[360px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                  alt="Admin"
                  className="w-9 h-9 rounded-full object-cover border-2 border-orange-400"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Admin</span>
                  <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                    BQT
                  </span>
                </div>
                <div className="text-[11px] text-orange-200 flex items-center gap-1.5">
                  <span className="text-emerald-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Trực tuyến 24/7
                  </span>
                  <span>·</span>
                  <span>Hỗ trợ trực tiếp trên web</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                title="Đóng cửa sổ chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-orange-50 px-3.5 py-2 border-b border-orange-100 flex items-center justify-between text-[11px] text-orange-900">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Tư vấn dịch vụ tăng VIP & Hỗ trợ kỹ thuật 24/7</span>
            </div>
            {onOpenPinModal && (
              <button
                onClick={onOpenPinModal}
                className="font-bold text-orange-700 hover:underline"
              >
                Gói VIP
              </button>
            )}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => {
              const isAdmin = m.sender_role === 'admin';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1">
                    <span className="font-semibold text-slate-600">{m.sender_name}</span>
                    <span>·</span>
                    <span>{formatTimeAgoVN(m.created_at)}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isAdmin
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        : 'bg-orange-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topic Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {SUPPORT_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(topic)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-full text-[11px] text-slate-600 whitespace-nowrap transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập nội dung cần hỗ trợ với Admin..."
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-40 shadow-xs shrink-0"
              title="Gửi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
