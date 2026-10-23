import React, { useState, useEffect } from 'react';
import { User, Product } from './types';
import {
  getStoredUsers,
  getCurrentUser,
  setCurrentUser,
  getStoredProducts,
  saveProducts,
  saveUsers,
  createProductBySeller,
  updateProductBySeller,
  markProductAsSold,
  deleteProduct,
  moderateProductByAdmin,
  recordProductView,
  recordAffiliateClick,
  toggleUserStatus,
  deleteUser,
  resetDemoData,
  pinProduct,
  unpinProduct,
  rejectPinRequest,
} from './services/storage';
import { fetchServerProducts, fetchServerUsers } from './services/api';
import { Header } from './components/Header';
import { Marketplace } from './components/Marketplace';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerPostModal } from './components/SellerPostModal';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminModeration } from './components/AdminModeration';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminUserManagement } from './components/AdminUserManagement';
import { ShopeeAutoImporter } from './components/ShopeeAutoImporter';
import { ZaloChatModal } from './components/ZaloChatModal';
import { AuthModal } from './components/AuthModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { FloatingShopeeRecommendation } from './components/FloatingShopeeRecommendation';
import { InAppChatModal } from './components/InAppChatModal';
import { AdminLiveSupport } from './components/AdminLiveSupport';
import { PinProductModal } from './components/PinProductModal';
import { ConversationsInboxModal } from './components/ConversationsInboxModal';
import { AboutModal } from './components/AboutModal';
import { getStoredConversations } from './services/storage';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState<User[]>(getStoredUsers());
  // STRICT GUEST DEFAULT: When visiting the website, users always start as unauthenticated guest (khách hàng)
  const [currentUser, setUser] = useState<User | null>(() => {
    return getCurrentUser(); // null for guest!
  });
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [activeTab, setActiveTab] = useState<'marketplace' | 'seller_dashboard' | 'admin_moderation' | 'admin_shopee_import' | 'admin_analytics' | 'admin_users'>('marketplace');

  // Synchronize with persistent server database on mount
  useEffect(() => {
    async function initServerData() {
      const serverProducts = await fetchServerProducts();
      if (serverProducts) {
        setProducts(serverProducts);
        saveProducts(serverProducts);
      }
      const serverUsers = await fetchServerUsers();
      if (serverUsers) {
        setUsers(serverUsers);
        saveUsers(serverUsers);
      }
    }
    initServerData();
  }, []);
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Auth Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authMessageNotice, setAuthMessageNotice] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [zaloChatData, setZaloChatData] = useState<{
    isOpen: boolean;
    phone: string;
    sellerName: string;
    productTitle: string;
  }>({
    isOpen: false,
    phone: '',
    sellerName: '',
    productTitle: '',
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Web In-App Chat & Messaging
  const [webChatProduct, setWebChatProduct] = useState<Product | null>(null);
  const [isWebChatOpen, setIsWebChatOpen] = useState(false);
  const [isConversationsInboxOpen, setIsConversationsInboxOpen] = useState(false);

  // VIP Pinning Modal
  const [pinModalProduct, setPinModalProduct] = useState<Product | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // About Website & Support Policy Modal
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshData = async () => {
    setProducts(getStoredProducts());
    setUsers(getStoredUsers());
    const refreshedCurrent = getCurrentUser();
    if (refreshedCurrent) {
      setUser(refreshedCurrent);
    }

    const serverProducts = await fetchServerProducts();
    if (serverProducts) {
      setProducts(serverProducts);
      saveProducts(serverProducts);
    }
    const serverUsers = await fetchServerUsers();
    if (serverUsers) {
      setUsers(serverUsers);
      saveUsers(serverUsers);
    }
  };

  const unreadCount = currentUser
    ? getStoredConversations().reduce((acc, conv) => {
        const count = currentUser.id === conv.seller_id ? conv.unread_seller : (currentUser.id === conv.buyer_id ? conv.unread_buyer : 0);
        return acc + count;
      }, 0)
    : 0;

  const handleOpenInAppChat = (product: Product) => {
    setWebChatProduct(product);
    setIsWebChatOpen(true);
  };

  const handleOpenPinModal = (product?: Product) => {
    setPinModalProduct(product || null);
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = (updatedProduct: Product) => {
    refreshData();
    showToast(`Đã kích hoạt ghim tin VIP "${updatedProduct.title}" lên đầu Bảng tin thành công!`);
  };

  const pendingCount = products.filter((p) => p.status === 'pending').length;

  const handleSelectUser = (user: User) => {
    setUser(user);
    setCurrentUser(user);
    // If switched away from admin while in admin tabs, navigate back to marketplace
    if (user.role !== 'admin' && (activeTab === 'admin_moderation' || activeTab === 'admin_shopee_import' || activeTab === 'admin_analytics' || activeTab === 'admin_users')) {
      setActiveTab('marketplace');
    }
    showToast(`Đã chuyển sang tài khoản: ${user.name} (${user.role === 'admin' ? 'Quản trị viên' : 'Khách bán'})`, 'info');
  };

  const handleOpenAuth = (mode: 'login' | 'register', notice = '') => {
    setAuthModalMode(mode);
    setAuthMessageNotice(notice);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    refreshData();
    showToast(`Đăng nhập thành công! Xin chào ${user.name} (${user.role === 'admin' ? 'Quản trị viên' : 'Người bán'}).`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    if (activeTab === 'seller_dashboard' || activeTab === 'admin_moderation' || activeTab === 'admin_shopee_import' || activeTab === 'admin_analytics' || activeTab === 'admin_users') {
      setActiveTab('marketplace');
    }
    showToast('Đã đăng xuất khỏi tài khoản.', 'info');
  };

  const handleOpenPostModal = () => {
    if (!currentUser) {
      handleOpenAuth('register', 'Bạn cần đăng ký tài khoản hoặc đăng nhập trước khi đăng tin bán hàng.');
      return;
    }
    setIsPostModalOpen(true);
  };

  const handleCreateProduct = (data: any) => {
    if (!currentUser) return;
    createProductBySeller(currentUser, data);
    refreshData();
    setIsPostModalOpen(false);
    showToast('Tin đăng đã gửi thành công và đang chuyển đến Quản trị viên để duyệt!');
    setActiveTab('seller_dashboard');
  };

  const handleEditProduct = (product: Product) => {
    const newTitle = prompt('Chỉnh sửa tiêu đề sản phẩm (Lưu ý: Sau khi sửa, bài sẽ tự động chuyển về trạng thái Chờ duyệt):', product.title);
    if (newTitle && newTitle.trim() !== '') {
      updateProductBySeller(product.id, { title: newTitle.trim() });
      refreshData();
      showToast('Đã cập nhật bài đăng! Trạng thái đã chuyển về "Chờ duyệt" theo quy định bảo mật.', 'info');
    }
  };

  const handleMarkSold = (id: string) => {
    markProductAsSold(id);
    refreshData();
    showToast('Đã đánh dấu sản phẩm là Đã bán!');
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    refreshData();
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    showToast('Đã xóa bài đăng thành công.');
  };

  const handleModerate = (id: string, action: any) => {
    moderateProductByAdmin(id, action);
    refreshData();
    if (action.status === 'approved') {
      showToast('Đã duyệt bài đăng & xuất bản lên Chợ Rao Vặt thành công!');
    } else if (action.status === 'rejected') {
      showToast('Đã từ chối bài đăng kèm lý do cụ thể gửi tới người bán.', 'info');
    } else {
      showToast('Đã cập nhật trạng thái bài đăng.');
    }
  };

  const handleSelectProduct = (product: Product) => {
    recordProductView(product.id);
    refreshData();
    setSelectedProduct(product);
  };

  const handleAffiliateClick = (productId: string, url: string) => {
    recordAffiliateClick(productId);
    refreshData();
    showToast('Đang chuyển hướng trực tiếp sang Shopee...', 'success');
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.location.href = url;
    }
  };

  const handleOpenZaloChat = (phone: string, sellerName: string, productTitle: string) => {
    setZaloChatData({
      isOpen: true,
      phone,
      sellerName,
      productTitle,
    });
  };

  const handleToggleUserBan = (userId: string) => {
    toggleUserStatus(userId);
    refreshData();
    showToast('Đã thay đổi trạng thái khóa tài khoản người dùng!');
  };

  const handleDeleteUser = (userId: string) => {
    const res = deleteUser(userId);
    if (res.success) {
      refreshData();
      showToast('Đã xóa vĩnh viễn tài khoản người dùng thành công.');
    } else {
      showToast(res.error || 'Không thể xóa tài khoản này.', 'info');
    }
  };

  const handleResetData = () => {
    resetDemoData();
    setUser(null);
    setActiveTab('marketplace');
    refreshData();
    showToast('Đã khôi phục dữ liệu mẫu hệ thống! Vui lòng đăng nhập lại với tài khoản Admin: toanhuongnguyen201708@gmail.com / Toanhuong1', 'info');
  };

  // Strict check: Only admin can view analytics
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <ShoppingBag className="w-5 h-5 text-orange-400 shrink-0" />
          )}
          <span className="text-xs font-medium leading-relaxed">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        availableUsers={users}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={handleOpenPostModal}
        pendingCount={pendingCount}
        onOpenAuthModal={(m) => handleOpenAuth(m)}
        onOpenChangePasswordModal={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        onOpenPinModal={() => handleOpenPinModal()}
        onOpenConversations={() => setIsConversationsInboxOpen(true)}
        unreadMessagesCount={unreadCount}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        pendingPinCount={products.filter(p => p.pin_requested && !p.is_pinned).length}
      />

      {/* Main Views */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            onSelectProduct={handleSelectProduct}
            onOpenPostModal={handleOpenPostModal}
            onAffiliateClick={handleAffiliateClick}
            onOpenPinModal={(prod) => handleOpenPinModal(prod)}
            isAdmin={isAdmin}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'seller_dashboard' && currentUser && (
          <SellerDashboard
            currentUser={currentUser}
            products={products}
            onOpenPostModal={handleOpenPostModal}
            onEditProduct={handleEditProduct}
            onMarkSold={handleMarkSold}
            onDeleteProduct={handleDeleteProduct}
            onViewProduct={handleSelectProduct}
          />
        )}

        {/* ADMIN EXCLUSIVE: MODERATION & VIP PIN MANAGEMENT */}
        {activeTab === 'admin_moderation' && isAdmin && (
          <AdminModeration
            products={products}
            onModerate={handleModerate}
            onDelete={handleDeleteProduct}
            onOpenShopeeImporter={() => setActiveTab('admin_shopee_import')}
            onPinProduct={(id, pkg) => {
              const updated = pinProduct(id, pkg);
              if (updated) {
                refreshData();
                showToast(`Đã kích hoạt ghim VIP "${updated.title}" thành công!`);
              }
            }}
            onUnpinProduct={(id) => {
              const updated = unpinProduct(id);
              if (updated) {
                refreshData();
                showToast('Đã gỡ ghim VIP cho bài đăng!', 'info');
              }
            }}
            onRejectPinRequest={(id) => {
              const updated = rejectPinRequest(id);
              if (updated) {
                refreshData();
                showToast('Đã từ chối yêu cầu đăng ký ghim tin.', 'info');
              }
            }}
            onOpenInAppChat={(prod) => handleOpenInAppChat(prod)}
          />
        )}

        {/* ADMIN EXCLUSIVE: AUTO-IMPORT FROM SHOPEE AFFILIATE LINK */}
        {activeTab === 'admin_shopee_import' && isAdmin && (
          <ShopeeAutoImporter
            currentUser={currentUser!}
            onProductPublished={(newProd) => {
              refreshData();
              showToast(`Đã tự động đẩy sản phẩm "${newProd.title}" lên bảng tin thành công!`, 'success');
            }}
            onGoToMarketplace={() => {
              setActiveTab('marketplace');
            }}
          />
        )}

        {/* ADMIN EXCLUSIVE: USER ACCOUNT MANAGEMENT (LOCK / DELETE) */}
        {activeTab === 'admin_users' && isAdmin && (
          <AdminUserManagement
            users={users}
            products={products}
            currentUser={currentUser!}
            onToggleUserBan={handleToggleUserBan}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {/* ADMIN EXCLUSIVE: AFFILIATE PERFORMANCE DASHBOARD */}
        {activeTab === 'admin_analytics' && isAdmin && (
          <AdminAnalytics
            products={products}
            users={users}
            onToggleUserBan={handleToggleUserBan}
            onDeleteUser={handleDeleteUser}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer & Giới Thiệu Website & Kênh Hỗ Trợ */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
            {/* Cột 1: Giới thiệu web */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-600 text-white font-bold flex items-center justify-center text-[11px]">
                  24h
                </div>
                <span className="font-bold text-slate-900 text-sm">Chợ Việt 24h</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Sàn Mua Bán & Rao Vặt Trực Tuyến C2C Toàn Quốc. Kết nối trực tiếp giữa người mua và người bán, bảo vệ giao dịch và tích hợp đề xuất sản phẩm chính hãng Shopee Mall.
              </p>
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(true)}
                className="text-orange-600 hover:text-orange-700 font-bold text-[11px] hover:underline flex items-center gap-1"
              >
                <span>Xem chi tiết giới thiệu website</span>
                <span>→</span>
              </button>
            </div>

            {/* Cột 2: Kênh hỗ trợ trực tiếp */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-sm">Kênh Hỗ Trợ Ban Quản Trị</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Để bảo mật và tránh mạo danh, Ban Quản Trị không sử dụng số điện thoại hotline cá nhân. Mọi hỗ trợ duyệt tin, tư vấn tăng VIP, ghim tin hoặc phản ánh được tiếp nhận 100% qua hình thức nhắn tin trực tiếp trên website.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open_admin_live_support'))}
                className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 font-bold rounded-lg text-[11px] inline-flex items-center gap-1.5 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Nhắn tin hỗ trợ trực tiếp 24/7</span>
              </button>
            </div>

            {/* Cột 3: An toàn & Bảo mật */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-sm">An Toàn Mua Bán</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Tin nhắn nội bộ bảo mật, thông báo tức thời về Zalo đã đăng ký. Đối soát kiểm duyệt bài đăng nghiêm ngặt.
              </p>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-2">
                <span>✓ Kiểm duyệt bài đăng</span>
                <span>·</span>
                <span>✓ Hỗ trợ trực tuyến 24/7</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>
              <span>© 2026 Chợ Việt 24h</span>
              <span className="mx-2">·</span>
              <span>Sàn Mua Bán & Rao Vặt Trực Tuyến Toàn Quốc</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(true)}
                className="hover:text-slate-700 transition-colors"
              >
                Giới Thiệu
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open_admin_live_support'))}
                className="hover:text-slate-700 transition-colors"
              >
                Hỗ Trợ Trực Tiếp
              </button>
              <span>·</span>
              <span>An Toàn & Bảo Mật</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAffiliateClick={handleAffiliateClick}
        onOpenZaloChat={handleOpenZaloChat}
        onOpenInAppChat={(prod) => handleOpenInAppChat(prod)}
        onOpenPinModal={(prod) => handleOpenPinModal(prod)}
        isAdmin={isAdmin}
        onDeleteProduct={handleDeleteProduct}
      />

      {isPostModalOpen && currentUser && (
        <SellerPostModal
          currentUser={currentUser}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreateProduct}
        />
      )}

      {/* Auth Modal (Login & Registration) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        messageNotice={authMessageNotice}
      />

      {/* Change Password Modal */}
      {currentUser && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          currentUser={currentUser}
          onSuccess={() => {
            refreshData();
            showToast('Đã đổi mật khẩu thành công!');
          }}
        />
      )}

      {/* External Zalo Chat Modal */}
      <ZaloChatModal
        isOpen={zaloChatData.isOpen}
        onClose={() => setZaloChatData(prev => ({ ...prev, isOpen: false }))}
        sellerPhone={zaloChatData.phone}
        sellerName={zaloChatData.sellerName}
        productTitle={zaloChatData.productTitle}
      />

      {/* In-App Direct Web Chat with Seller & Automated Zalo Dispatch */}
      <InAppChatModal
        isOpen={isWebChatOpen}
        onClose={() => setIsWebChatOpen(false)}
        product={webChatProduct}
        currentUser={currentUser}
        onRequireLogin={() => handleOpenAuth('login', 'Vui lòng đăng nhập để gửi tin nhắn cho người bán.')}
        onOpenZaloApp={handleOpenZaloChat}
      />

      {/* VIP Pinning Modal */}
      <PinProductModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        product={pinModalProduct}
        userProducts={currentUser ? products.filter(p => p.user_id === currentUser.id) : []}
        currentUser={currentUser}
        onPinSuccess={handlePinSuccess}
      />

      {/* Conversations & Automated Zalo Notifications Inbox Modal */}
      <ConversationsInboxModal
        isOpen={isConversationsInboxOpen}
        onClose={() => setIsConversationsInboxOpen(false)}
        currentUser={currentUser}
        products={products}
        onSelectConversation={(prod) => {
          handleOpenInAppChat(prod);
        }}
        onOpenZaloApp={handleOpenZaloChat}
      />

      {/* Sticky Corner Shopee Recommendation Widget (Psychology-driven) */}
      <FloatingShopeeRecommendation
        products={products}
        onAffiliateClick={handleAffiliateClick}
      />

      {/* Admin Live Support (Chat trực tiếp với Admin) */}
      <AdminLiveSupport
        currentUser={currentUser}
        onOpenPinModal={() => handleOpenPinModal()}
      />

      {/* Website Introduction & Support Channel Policy Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenLiveChat={() => window.dispatchEvent(new CustomEvent('open_admin_live_support'))}
      />

    </div>
  );
}
