import { Product, User, ProductStatus, ProductCondition, Conversation, ChatMessage, AdminSupportMessage, ZaloNotification, PinPackage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS } from '../data/mockData';

const PRODUCTS_KEY = 'chorao_products_v1';
const USERS_KEY = 'chorao_users_v1';
const CURRENT_USER_KEY = 'chorao_current_user_v1';
const CONVERSATIONS_KEY = 'choviet24h_conversations_v1';
const ZALO_NOTIFICATIONS_KEY = 'choviet24h_zalo_notifications_v1';
const ADMIN_SUPPORT_MESSAGES_KEY = 'choviet24h_admin_support_v1';

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed: User[] = JSON.parse(raw);
    const adminIndex = parsed.findIndex(u => u.role === 'admin');
    if (adminIndex !== -1) {
      if (parsed[adminIndex].name !== 'Admin' || !parsed[adminIndex].password) {
        parsed[adminIndex].phone = '0961513578';
        parsed[adminIndex].password = 'Toanhuong1';
        parsed[adminIndex].name = 'Admin';
        localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
      }
    } else {
      parsed.unshift(INITIAL_USERS[0]);
      localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (!user) return null;
      const users = getStoredUsers();
      const existing = users.find(u => u.id === user.id);
      if (existing) return existing;
    }
  } catch {
    // fallback
  }
  return null; // Guest by default or user can log in
}

export function setCurrentUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function registerUser(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const cleanPhone = data.phone.trim();
  const cleanEmail = data.email.trim().toLowerCase();

  // Check phone duplication
  if (users.some(u => u.phone === cleanPhone)) {
    return { success: false, error: 'Số điện thoại này đã được đăng ký tài khoản trên hệ thống.' };
  }

  // Check email duplication
  if (cleanEmail && users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'Email này đã được sử dụng. Vui lòng chọn email khác.' };
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name: data.name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    password: data.password,
    role: 'user',
    status: 'active',
    avatar: `https://images.unsplash.com/photo-${1535713875002 + (users.length % 5)}?w=150&auto=format&fit=crop&q=80`,
    created_at: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function loginUser(
  phoneOrEmail: string,
  pass: string
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const identifier = phoneOrEmail.trim().toLowerCase();

  const found = users.find(
    u => u.phone.toLowerCase() === identifier ||
         u.email.toLowerCase() === identifier ||
         (identifier === 'admin' && u.role === 'admin')
  );

  if (!found) {
    return { success: false, error: 'Không tìm thấy tài khoản với Số điện thoại hoặc Email này.' };
  }

  if (found.status === 'banned') {
    return { success: false, error: 'Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng.' };
  }

  // Check password
  const expectedPassword = found.password || '123456';
  if (pass !== expectedPassword) {
    return { success: false, error: 'Mật khẩu không chính xác. Vui lòng thử lại.' };
  }

  setCurrentUser(found);
  return { success: true, user: found };
}

export function changePassword(
  userId: string,
  currentPass: string,
  newPass: string
): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) {
    return { success: false, error: 'Không tìm thấy người dùng.' };
  }

  const user = users[index];
  const expectedCurrent = user.password || (user.role === 'admin' ? 'Toanhuong1' : '123456');

  if (currentPass !== expectedCurrent) {
    return { success: false, error: 'Mật khẩu hiện tại không chính xác.' };
  }

  if (newPass.length < 6) {
    return { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
  }

  users[index].password = newPass;
  saveUsers(users);
  setCurrentUser(users[index]);

  return { success: true };
}

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const list: Product[] = JSON.parse(raw);
    let changed = false;
    const hasAdminShopee = list.some(p => p.id === 'prod_shopee_admin_1' || p.is_shopee_direct);
    if (!hasAdminShopee && INITIAL_PRODUCTS[0]?.id === 'prod_shopee_admin_1') {
      list.unshift(INITIAL_PRODUCTS[0]);
      changed = true;
    }

    // Ensure sample customer pin requests are populated if not present
    const hasAnyPinRequested = list.some(p => p.pin_requested);
    if (!hasAnyPinRequested) {
      list.forEach(p => {
        const init = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
        if (init && init.pin_requested) {
          p.pin_requested = init.pin_requested;
          p.pin_requested_package = init.pin_requested_package;
          p.pin_requested_at = init.pin_requested_at;
          p.pin_request_status = init.pin_request_status;
          p.pin_request_note = init.pin_request_note;
          changed = true;
        }
      });
    }

    if (changed) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getProductById(id: string): Product | undefined {
  const products = getStoredProducts();
  return products.find(p => p.id === id);
}

export function createProductBySeller(
  currentUser: User,
  data: Omit<Product, 'id' | 'user_id' | 'seller_name' | 'seller_phone' | 'seller_avatar' | 'status' | 'shopee_affiliate_url' | 'shopee_button_label' | 'is_affiliate_active' | 'shopee_sub_url' | 'shopee_sub_label' | 'views_count' | 'affiliate_clicks_count' | 'created_at' | 'updated_at'>
): Product {
  const products = getStoredProducts();
  const now = new Date().toISOString();
  
  // Strict rule: Seller CANNOT supply affiliate URLs; status starts as 'pending'
  const newProduct: Product = {
    ...data,
    id: `prod_${Date.now()}`,
    user_id: currentUser.id,
    seller_name: currentUser.name,
    seller_phone: currentUser.phone,
    seller_avatar: currentUser.avatar,
    status: 'pending',
    shopee_affiliate_url: '',
    shopee_button_label: 'Xem giá ưu đãi trên Shopee',
    is_affiliate_active: false,
    views_count: 0,
    affiliate_clicks_count: 0,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [newProduct, ...products];
  saveProducts(updatedList);
  return newProduct;
}

export function createProductFromShopeeLink(
  adminUser: User,
  data: {
    title: string;
    description: string;
    category: string;
    price: number;
    condition?: ProductCondition;
    location?: string;
    images: string[];
    contact_phone?: string;
    shopee_affiliate_url: string;
    shopee_button_label?: string;
    shopee_sub_url?: string;
    shopee_sub_label?: string;
    seller_name?: string;
  }
): Product {
  const products = getStoredProducts();
  const now = new Date().toISOString();

  const newProduct: Product = {
    id: `prod_shopee_${Date.now()}`,
    user_id: adminUser.id,
    seller_name: data.seller_name || 'Shopee Mall Official Store',
    seller_phone: '',
    seller_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price,
    condition: data.condition || 'Mới 100%',
    location: data.location || 'Hà Nội & Toàn Quốc (Giao Hỏa Tốc)',
    images: data.images,
    contact_phone: '',
    status: 'approved', // Tự động đẩy lên bảng tin để khách hàng xem ngay lập tức
    shopee_affiliate_url: data.shopee_affiliate_url,
    shopee_button_label: data.shopee_button_label || 'Mua Hàng Mới Chính Hãng trên Shopee Mall',
    is_affiliate_active: true,
    is_shopee_direct: true, // Auto-redirects directly to Shopee when clicked by buyer
    shopee_sub_url: data.shopee_sub_url || '',
    shopee_sub_label: data.shopee_sub_label || 'Xem phụ kiện & mã giảm giá Shopee',
    views_count: 1,
    affiliate_clicks_count: 0,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [newProduct, ...products];
  saveProducts(updatedList);
  return newProduct;
}

export function updateProductBySeller(
  id: string,
  updates: Partial<Pick<Product, 'title' | 'description' | 'category' | 'price' | 'condition' | 'location' | 'images' | 'contact_phone'>>
): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  // Strict Rule II.1: "khi chỉnh sửa, bài viết sẽ tự động chuyển về trạng thái chờ duyệt"
  const updated: Product = {
    ...products[index],
    ...updates,
    status: 'pending', // Re-enter moderation queue
    rejection_reason: undefined,
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function markProductAsSold(id: string): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index].status = 'sold';
  products[index].updated_at = new Date().toISOString();
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return true;
}

export function moderateProductByAdmin(
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
): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const target = products[index];
  const updated: Product = {
    ...target,
    status: action.status,
    rejection_reason: action.status === 'rejected' ? action.rejection_reason : undefined,
    shopee_affiliate_url: action.shopee_affiliate_url !== undefined ? action.shopee_affiliate_url : target.shopee_affiliate_url,
    shopee_button_label: action.shopee_button_label !== undefined ? action.shopee_button_label : target.shopee_button_label,
    is_affiliate_active: action.is_affiliate_active !== undefined ? action.is_affiliate_active : target.is_affiliate_active,
    shopee_sub_url: action.shopee_sub_url !== undefined ? action.shopee_sub_url : target.shopee_sub_url,
    shopee_sub_label: action.shopee_sub_label !== undefined ? action.shopee_sub_label : target.shopee_sub_label,
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function recordProductView(id: string): void {
  const products = getStoredProducts();
  const item = products.find(p => p.id === id);
  if (item) {
    item.views_count = (item.views_count || 0) + 1;
    saveProducts(products);
  }
}

export function recordAffiliateClick(id: string): number {
  const products = getStoredProducts();
  const item = products.find(p => p.id === id);
  if (item) {
    item.affiliate_clicks_count = (item.affiliate_clicks_count || 0) + 1;
    saveProducts(products);
    return item.affiliate_clicks_count;
  }
  return 0;
}

export function toggleUserStatus(userId: string): User | null {
  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return null;
  if (target.role === 'admin' || target.id === 'admin') return null;
  target.status = target.status === 'active' ? 'banned' : 'active';
  saveUsers(users);
  return target;
}

export function deleteUser(userId: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (!target) {
    return { success: false, error: 'Không tìm thấy tài khoản người dùng!' };
  }
  if (target.role === 'admin' || target.id === 'admin') {
    return { success: false, error: 'Không thể xóa tài khoản Quản trị viên tối cao!' };
  }
  const nextUsers = users.filter(u => u.id !== userId);
  saveUsers(nextUsers);
  return { success: true };
}

export function resetDemoData(): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USERS[0]));
  localStorage.removeItem(CONVERSATIONS_KEY);
  localStorage.removeItem(ZALO_NOTIFICATIONS_KEY);
  localStorage.removeItem(ADMIN_SUPPORT_MESSAGES_KEY);
}

// ==========================================
// VIP PINNING / GHIM TIN QUẢNG CÁO LÊN ĐẦU TRANG
// ==========================================
// ==========================================
// DỊCH VỤ GHIM TIN & QUẢNG CÁO VIP THEO GÓI
// ==========================================
export function pinProduct(id: string, packageType: PinPackage): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const days = packageType === '1_day' ? 1 : packageType === '3_days' ? 3 : packageType === '7_days' ? 7 : 30;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  const updated: Product = {
    ...products[index],
    is_pinned: true,
    pin_package: packageType,
    pinned_at: new Date().toISOString(),
    pinned_until: expiryDate.toISOString(),
    pin_requested: false,
    pin_request_status: 'approved',
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function requestPinProduct(
  id: string,
  packageType: PinPackage,
  note?: string
): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    pin_requested: true,
    pin_requested_package: packageType,
    pin_requested_at: new Date().toISOString(),
    pin_request_status: 'pending',
    pin_request_note: note || '',
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function rejectPinRequest(id: string): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    pin_requested: false,
    pin_request_status: 'rejected',
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function unpinProduct(id: string): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    is_pinned: false,
    pinned_until: undefined,
    pin_package: undefined,
    pin_requested: false,
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

// ==========================================
// TRỰC TIẾP NHẮN TIN CHO NGƯỜI BÁN (WEB CHAT)
// ==========================================
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_sample_1',
    product_id: 'prod_2',
    product_title: 'Tai nghe Sony WH-1000XM4 Chống Ồn Cao Cấp',
    product_price: 3400000,
    product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    buyer_id: 'user_admin',
    buyer_name: 'Admin',
    buyer_phone: '',
    seller_id: 'user_seller_1',
    seller_name: 'Nguyễn Văn Minh',
    seller_phone: '0912345678',
    last_message: 'Dạ tai nghe này pin còn trâu, em có fix chút xăng xe cho bác ạ!',
    last_message_time: new Date(Date.now() - 3600000).toISOString(),
    unread_buyer: 1,
    unread_seller: 0,
    messages: [
      {
        id: 'msg_1',
        conversation_id: 'conv_sample_1',
        sender_id: 'user_admin',
        sender_name: 'Admin',
        sender_role: 'buyer',
        text: 'Chào bạn, tai nghe Sony XM4 này còn bảo hành chính hãng không bạn?',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        read: true,
      },
      {
        id: 'msg_2',
        conversation_id: 'conv_sample_1',
        sender_id: 'user_seller_1',
        sender_name: 'Nguyễn Văn Minh',
        sender_role: 'seller',
        text: 'Dạ tai nghe này pin còn trâu, em có fix chút xăng xe cho bác ạ! Bác nhắn qua Zalo số 0912345678 em gửi video test chống ồn nhé.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
    ],
  },
];

export function getStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function saveConversations(list: Conversation[]): void {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
}

export function getOrCreateConversation(product: Product, buyer: User): Conversation {
  const conversations = getStoredConversations();
  const existing = conversations.find(
    c => c.product_id === product.id && c.buyer_id === buyer.id
  );

  if (existing) return existing;

  const newConv: Conversation = {
    id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    product_id: product.id,
    product_title: product.title,
    product_price: product.price,
    product_image: product.images[0] || '',
    buyer_id: buyer.id,
    buyer_name: buyer.name,
    buyer_phone: buyer.phone,
    seller_id: product.user_id,
    seller_name: product.seller_name,
    seller_phone: product.contact_phone || product.seller_phone,
    last_message: 'Bắt đầu cuộc trò chuyện',
    last_message_time: new Date().toISOString(),
    unread_buyer: 0,
    unread_seller: 0,
    messages: [],
  };

  const updated = [newConv, ...conversations];
  saveConversations(updated);
  return newConv;
}

export function sendChatMessage(
  conversationId: string,
  sender: User,
  text: string,
  image?: string
): { conversation: Conversation; message: ChatMessage } {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) {
    throw new Error('Conversation not found');
  }

  const conv = conversations[index];
  const isBuyer = sender.id === conv.buyer_id;

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    conversation_id: conversationId,
    sender_id: sender.id,
    sender_name: sender.name,
    sender_role: isBuyer ? 'buyer' : 'seller',
    text: text.trim(),
    image,
    created_at: new Date().toISOString(),
    read: false,
  };

  const updatedConv: Conversation = {
    ...conv,
    last_message: text.trim() || (image ? '[Hình ảnh]' : ''),
    last_message_time: newMsg.created_at,
    unread_buyer: isBuyer ? conv.unread_buyer : conv.unread_buyer + 1,
    unread_seller: isBuyer ? conv.unread_seller + 1 : conv.unread_seller,
    messages: [...conv.messages, newMsg],
  };

  // If buyer sent a message, automatically dispatch a notification to the seller's registered Zalo!
  if (isBuyer) {
    triggerZaloNotification(
      conv.seller_phone,
      conv.seller_name,
      `Khách hàng ${sender.name} nhắn tin hỏi mua`,
      `Khách nhắn: "${text.trim()}". Bấm để vào Chợ Việt 24h trả lời ngay!`,
      conv.product_id,
      conv.product_title
    );
  }

  conversations[index] = updatedConv;
  saveConversations(conversations);
  return { conversation: updatedConv, message: newMsg };
}

export function markConversationAsRead(conversationId: string, forUserId: string): void {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return;

  const conv = conversations[index];
  const isBuyer = forUserId === conv.buyer_id;

  const updatedConv: Conversation = {
    ...conv,
    unread_buyer: isBuyer ? 0 : conv.unread_buyer,
    unread_seller: !isBuyer ? 0 : conv.unread_seller,
    messages: conv.messages.map(m => m.sender_id !== forUserId ? { ...m, read: true } : m),
  };

  conversations[index] = updatedConv;
  saveConversations(conversations);
}

// ==========================================
// TỰ ĐỘNG THÔNG BÁO VỀ ZALO ĐÃ ĐĂNG KÝ (ZALO NOTIFICATIONS)
// ==========================================
const INITIAL_ZALO_NOTIFICATIONS: ZaloNotification[] = [
  {
    id: 'zalo_notif_sample',
    phone: '0912345678',
    receiver_name: 'Nguyễn Văn Minh',
    title: 'Tin nhắn mới từ khách hàng trên Chợ Việt 24h',
    content: 'Khách hàng Admin vừa gửi tin nhắn hỏi mua tai nghe Sony XM4 của bạn.',
    product_title: 'Tai nghe Sony WH-1000XM4 Chống Ồn Cao Cấp',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'delivered',
  },
];

export function getStoredZaloNotifications(): ZaloNotification[] {
  try {
    const raw = localStorage.getItem(ZALO_NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(ZALO_NOTIFICATIONS_KEY, JSON.stringify(INITIAL_ZALO_NOTIFICATIONS));
      return INITIAL_ZALO_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ZALO_NOTIFICATIONS;
  }
}

export function saveZaloNotifications(notifications: ZaloNotification[]): void {
  localStorage.setItem(ZALO_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function triggerZaloNotification(
  phone: string,
  receiverName: string,
  title: string,
  content: string,
  productId?: string,
  productTitle?: string
): ZaloNotification {
  const list = getStoredZaloNotifications();
  const newNotif: ZaloNotification = {
    id: `znotif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    phone,
    receiver_name: receiverName,
    title,
    content,
    product_id: productId,
    product_title: productTitle,
    created_at: new Date().toISOString(),
    status: 'delivered',
  };

  const updated = [newNotif, ...list];
  saveZaloNotifications(updated);
  return newNotif;
}

// ==========================================
// HỖ TRỢ TRỰC TIẾP TRÊN WEB VỚI ADMIN (ADMIN LIVE SUPPORT)
// ==========================================
const INITIAL_ADMIN_SUPPORT_MESSAGES: AdminSupportMessage[] = [
  {
    id: 'admin_sup_1',
    sender_id: 'user_admin',
    sender_name: 'Admin',
    sender_role: 'admin',
    text: 'Xin chào quý khách! Tôi là Admin Chợ Việt 24h. Bạn cần tư vấn dịch vụ tăng VIP, ghim tin lên đầu trang hay hỗ trợ kỹ thuật hãy nhắn tin trực tiếp tại đây nhé!',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function getStoredAdminSupportMessages(): AdminSupportMessage[] {
  try {
    const raw = localStorage.getItem(ADMIN_SUPPORT_MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_SUPPORT_MESSAGES_KEY, JSON.stringify(INITIAL_ADMIN_SUPPORT_MESSAGES));
      return INITIAL_ADMIN_SUPPORT_MESSAGES;
    }
    const parsed: AdminSupportMessage[] = JSON.parse(raw);
    // Sanitize any older messages that might contain the phone number or Toàn Hướng
    let cleaned = false;
    const sanitized = parsed.map(msg => {
      let text = msg.text || '';
      let sender_name = msg.sender_name || '';
      if (sender_name.includes('Toàn Hướng')) {
        sender_name = 'Admin';
        cleaned = true;
      }
      if (text && (text.includes('0961513578') || text.includes('Hotline') || text.includes('Toàn Hướng'))) {
        cleaned = true;
        text = text
          .replace(/\(Hotline\/Zalo:\s*0961513578\)/g, '')
          .replace(/hoặc liên hệ Hotline\/Zalo 0961513578/g, 'trực tiếp tại khung chat này')
          .replace(/Hotline & Zalo hỗ trợ trực tiếp của Admin Chợ Việt 24h: 0961513578 \(Mr\. Toàn Hướng\) phục vụ 24\/7\./g, 'Ban Quản Trị Chợ Việt 24h hỗ trợ trực tiếp 24/7 độc quyền qua khung chat trực tuyến trên website.')
          .replace(/Admin \(0961513578\)/g, 'Admin')
          .replace(/Admin Toàn Hướng/g, 'Admin')
          .replace(/\(Toàn Hướng\)/g, '')
          .replace(/Mr\. Toàn Hướng/g, 'Admin')
          .replace(/hoặc gọi điện hỗ trợ\./g, 'ngay tại đây.')
          .replace(/0961513578/g, '')
          .trim();
      }
      return {
        ...msg,
        sender_name: sender_name || 'Admin',
        text,
      };
    });
    if (cleaned) {
      localStorage.setItem(ADMIN_SUPPORT_MESSAGES_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return INITIAL_ADMIN_SUPPORT_MESSAGES;
  }
}

export function saveAdminSupportMessages(messages: AdminSupportMessage[]): void {
  localStorage.setItem(ADMIN_SUPPORT_MESSAGES_KEY, JSON.stringify(messages));
}

export function sendAdminSupportMessage(
  sender: User | null,
  text: string
): AdminSupportMessage[] {
  const current = getStoredAdminSupportMessages();
  const userMsg: AdminSupportMessage = {
    id: `adm_msg_${Date.now()}`,
    sender_id: sender?.id || 'guest_user',
    sender_name: sender?.name || 'Khách vãng lai',
    sender_role: sender?.role === 'admin' ? 'admin' : 'user',
    text: text.trim(),
    created_at: new Date().toISOString(),
  };

  let updated = [...current, userMsg];

  // If user (not admin) sends a message, auto-respond with live web chat support
  if (sender?.role !== 'admin') {
    let autoReplyText = '';
    const lower = text.toLowerCase();
    if (lower.includes('ghim') || lower.includes('vip') || lower.includes('tăng') || lower.includes('quảng cáo')) {
      autoReplyText = 'Dạ chào bạn! Về dịch vụ tăng VIP / Ghim tin lên đầu trang: Admin hỗ trợ riêng 1-1, kiểm tra tối ưu bài viết và kích hoạt trực tiếp theo yêu cầu. Bạn cần kích hoạt cho tin đăng nào hãy gửi tên hoặc link bài trực tiếp tại khung chat này nhé!';
    } else if (lower.includes('duyệt') || lower.includes('gấp') || lower.includes('bài')) {
      autoReplyText = 'Dạ Admin đã nhận yêu cầu duyệt bài gấp của bạn! Admin đang kiểm tra nội dung và sẽ phê duyệt hiển thị ngay trong vài phút.';
    } else if (lower.includes('lừa đảo') || lower.includes('báo cáo') || lower.includes('gian lận')) {
      autoReplyText = 'Cảm ơn bạn đã phản ánh! Ban Quản Trị sẽ đối soát ngay thông tin tài khoản bị báo cáo và tiến hành xử lý để bảo vệ cộng đồng người mua bán.';
    } else if (lower.includes('số') || lower.includes('điện thoại') || lower.includes('hotline') || lower.includes('zalo') || lower.includes('sđt')) {
      autoReplyText = 'Ban Quản Trị Chợ Việt 24h hỗ trợ trực tiếp 24/7 độc quyền qua khung chat trực tuyến này trên website (không dùng số điện thoại hotline). Bạn cần hỗ trợ gì cứ nhắn tin trực tiếp tại đây nhé!';
    } else {
      autoReplyText = 'Cảm ơn bạn đã nhắn tin cho Ban Quản Trị Chợ Việt 24h! Admin đã nhận được tin nhắn và sẽ phản hồi riêng ngay cho bạn qua khung chat trực tiếp này.';
    }

    const botMsg: AdminSupportMessage = {
      id: `adm_msg_reply_${Date.now() + 1}`,
      sender_id: 'user_admin',
      sender_name: 'Admin',
      sender_role: 'admin',
      text: autoReplyText,
      created_at: new Date(Date.now() + 800).toISOString(),
    };

    updated.push(botMsg);
  }

  saveAdminSupportMessages(updated);
  return updated;
}
