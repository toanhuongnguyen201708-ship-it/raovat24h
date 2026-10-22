import React from 'react';
import { User } from '../types';
import {
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  BarChart3,
  LogIn,
  UserPlus,
  KeyRound,
  LogOut,
  ChevronDown,
  Sparkles,
  Crown,
  MessageSquare,
  Users
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  availableUsers: User[];
  activeTab: 'marketplace' | 'seller_dashboard' | 'admin_moderation' | 'admin_shopee_import' | 'admin_analytics' | 'admin_users';
  setActiveTab: (tab: 'marketplace' | 'seller_dashboard' | 'admin_moderation' | 'admin_shopee_import' | 'admin_analytics' | 'admin_users') => void;
  onOpenPostModal: () => void;
  pendingCount: number;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenChangePasswordModal: () => void;
  onLogout: () => void;
  onOpenPinModal?: () => void;
  onOpenConversations?: () => void;
  unreadMessagesCount?: number;
  onOpenAboutModal?: () => void;
  pendingPinCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  availableUsers,
  activeTab,
  setActiveTab,
  onOpenPostModal,
  pendingCount,
  onOpenAuthModal,
  onOpenChangePasswordModal,
  onLogout,
  onOpenPinModal,
  onOpenConversations,
  unreadMessagesCount = 0,
  onOpenAboutModal,
  pendingPinCount = 0,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones, gap-8, single line */}
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm group-hover:bg-orange-700 transition-colors">
                24h
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                Chợ Việt 24h
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeTab === 'marketplace'
                  ? 'border-orange-600 text-orange-600 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Chợ Rao Vặt
            </button>

            {currentUser && (
              <button
                onClick={() => setActiveTab('seller_dashboard')}
                className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                  activeTab === 'seller_dashboard'
                    ? 'border-orange-600 text-orange-600 font-semibold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                Tin Của Tôi
              </button>
            )}

            {/* VIP Pin Advertising Navigation Link */}
            {onOpenPinModal && (
              <button
                type="button"
                onClick={onOpenPinModal}
                className="flex items-center gap-1.5 whitespace-nowrap text-amber-700 hover:text-amber-800 font-bold transition-colors pb-1 border-b-2 border-transparent"
              >
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Ghim Tin VIP</span>
              </button>
            )}

            {/* Giới thiệu web & hỗ trợ */}
            {onOpenAboutModal && (
              <button
                type="button"
                onClick={onOpenAboutModal}
                className="whitespace-nowrap text-slate-600 hover:text-orange-600 font-medium transition-colors pb-1 border-b-2 border-transparent"
              >
                Giới Thiệu & Hỗ Trợ
              </button>
            )}

            {/* ONLY ADMIN CAN SEE THESE 2 TABS */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('admin_moderation')}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 ${
                    activeTab === 'admin_moderation'
                      ? 'border-orange-600 text-orange-600 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Duyệt Tin & Ghim VIP</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                      {pendingCount}
                    </span>
                  )}
                  {pendingPinCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-xs font-bold rounded flex items-center gap-0.5">
                      <Crown className="w-3 h-3 text-purple-600" />
                      <span>{pendingPinCount}</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('admin_shopee_import')}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 ${
                    activeTab === 'admin_shopee_import'
                      ? 'border-orange-600 text-orange-600 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Đăng Nhanh Link Shopee</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin_users')}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 ${
                    activeTab === 'admin_users'
                      ? 'border-orange-600 text-orange-600 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-rose-600" />
                  <span>Quản Lý Tài Khoản</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin_analytics')}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 ${
                    activeTab === 'admin_analytics'
                      ? 'border-orange-600 text-orange-600 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span>Hiệu Quả Affiliate (Admin)</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1 primary action & Account controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Web Messages Inbox Button */}
            {onOpenConversations && (
              <button
                type="button"
                onClick={onOpenConversations}
                className="relative p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-slate-200"
                title="Hộp thư tin nhắn trên Web & Thông báo Zalo"
              >
                <MessageSquare className="w-4 h-4 text-slate-700" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Post Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Tin Bán</span>
            </button>

            {/* When Logged In */}
            {currentUser ? (
              <div className="relative group">
                <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-semibold text-slate-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-slate-500 flex items-center gap-1">
                      {currentUser.role === 'admin' ? (
                        <span className="text-emerald-700 font-bold">Quản trị viên</span>
                      ) : (
                        <span className="text-slate-600">Khách bán</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 hidden group-hover:block hover:block z-50">
                  <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                    {currentUser.role === 'admin' ? (
                      <div className="text-[11px] font-semibold text-emerald-600">Quản trị viên hệ thống</div>
                    ) : (
                      <div className="text-[11px] font-mono text-slate-500">SĐT: {currentUser.phone}</div>
                    )}
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email || 'Chưa cập nhật email'}</div>
                  </div>

                  {/* Change Password button */}
                  <button
                    onClick={onOpenChangePasswordModal}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-orange-600" />
                    <span>Đổi mật khẩu tài khoản</span>
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    CHUYỂN NHANH TÀI KHOẢN MẪU
                  </div>

                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSelectUser(u)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-orange-50 text-orange-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="truncate max-w-[130px] font-medium">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {u.role === 'admin' ? 'Tài khoản Quản trị' : `${u.phone} (Khách bán)`}
                          </div>
                        </div>
                      </div>
                      {u.id === currentUser.id && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                      )}
                    </button>
                  ))}

                  <div className="my-1 border-t border-slate-100"></div>

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            ) : (
              /* When Not Logged In */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Đăng ký bán hàng</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
