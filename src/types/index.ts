export type Role = 'user' | 'admin';
export type UserStatus = 'active' | 'banned';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  created_at: string;
}

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold';

export type ProductCondition = 'Mới 100%' | 'Like New 99%' | 'Đã qua sử dụng' | 'Cũ theo thời gian';

export type PinPackage = '1_day' | '3_days' | '7_days' | '30_days';

export interface Product {
  id: string;
  user_id: string;
  seller_name: string;
  seller_phone: string;
  seller_avatar?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition: ProductCondition;
  location: string;
  images: string[];
  contact_phone: string;
  status: ProductStatus;
  rejection_reason?: string;
  
  // Shopee Affiliate fields (Admin Exclusive)
  shopee_affiliate_url: string;
  shopee_button_label: string;
  is_affiliate_active: boolean;
  shopee_sub_url?: string;
  shopee_sub_label?: string;
  is_shopee_direct?: boolean; // True for products imported directly from Shopee link by admin
  
  // VIP Pinning Advertising (Ghim Tin Lên Đầu Trang)
  is_pinned?: boolean;
  pinned_until?: string;
  pin_package?: PinPackage;
  pinned_at?: string;

  // Customer VIP Pin Advertising Request
  pin_requested?: boolean;
  pin_requested_package?: PinPackage;
  pin_requested_at?: string;
  pin_request_status?: 'pending' | 'approved' | 'rejected';
  pin_request_note?: string;
  
  // Analytics
  views_count: number;
  affiliate_clicks_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  item_count: number;
}

export interface FilterState {
  search: string;
  category: string;
  location: string;
  condition: string;
  priceRange: [number, number];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role?: 'buyer' | 'seller';
  text: string;
  image?: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  product_image: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone?: string;
  seller_id: string;
  seller_name: string;
  seller_phone: string;
  last_message: string;
  last_message_time: string;
  unread_buyer: number;
  unread_seller: number;
  messages: ChatMessage[];
  zalo_notified?: boolean;
}

export interface AdminSupportMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'user' | 'admin' | 'system';
  text: string;
  created_at: string;
}

export interface ZaloNotification {
  id: string;
  phone: string;
  receiver_name: string;
  title: string;
  content: string;
  product_id?: string;
  product_title?: string;
  created_at: string;
  status: 'sent' | 'delivered';
}
