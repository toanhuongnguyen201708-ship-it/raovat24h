import React, { useState } from 'react';
import { Product, User } from '../types';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import {
  TrendingUp,
  MousePointerClick,
  Eye,
  ShoppingBag,
  DollarSign,
  Users,
  ShieldAlert,
  CheckCircle,
  Ban,
  ArrowUpRight,
  ExternalLink,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface AdminAnalyticsProps {
  products: Product[];
  users: User[];
  onToggleUserBan: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onResetData: () => void;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  products,
  users,
  onToggleUserBan,
  onDeleteUser,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  // Aggregations
  const totalViews = products.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const totalAffiliateClicks = products.reduce((sum, p) => sum + (p.affiliate_clicks_count || 0), 0);
  const ctr = totalViews > 0 ? ((totalAffiliateClicks / totalViews) * 100).toFixed(1) : '0.0';

  // Estimated affiliate commission: average 4% conversion with ~400k avg order
  const estimatedRevenue = totalAffiliateClicks * 32000;

  const topAffiliateProducts = [...products]
    .filter(p => (p.affiliate_clicks_count || 0) > 0)
    .sort((a, b) => (b.affiliate_clicks_count || 0) - (a.affiliate_clicks_count || 0))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Báo Cáo Hiệu Quả Doanh Thu Shopee Affiliate
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Khai thác hoa hồng tiếp thị liên kết từ lưu lượng người xem rao vặt tự nhiên (Organic C2C Traffic).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Khôi phục lại dữ liệu mẫu ban đầu?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu mẫu</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Tổng lượt xem tin</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalViews.toLocaleString('vi-VN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Lưu lượng từ khách mua tìm đồ thanh lý
          </div>
        </div>

        {/* Total Affiliate Clicks */}
        <div className="bg-white rounded-xl border border-orange-200 p-5 shadow-xs bg-gradient-to-br from-white to-orange-50/30">
          <div className="flex items-center justify-between text-orange-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide">Lượt Click Shopee</span>
            <MousePointerClick className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-orange-600 font-mono tabular-nums">
            {totalAffiliateClicks.toLocaleString('vi-VN')}
          </div>
          <div className="text-[11px] text-orange-800/80 mt-1">
            Đã chuyển hướng gắn mã hoa hồng Admin
          </div>
        </div>

        {/* Global CTR */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Tỷ Lệ Chuyển Đổi (CTR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {ctr}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tỷ lệ click nút mua Shopee trên lượt xem
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Ước tính hoa hồng</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatVND(estimatedRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Doanh thu ròng chỉ dành riêng cho Admin
          </div>
        </div>

      </div>

      {/* Sub Tabs: Performance & User Management */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Top Bài Đăng Mang Lại Click Shopee
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Quản Lý Tài Khoản Người Dùng ({users.length})
        </button>
      </div>

      {/* Tab 1: Top Affiliate Products */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hiệu quả theo từng bài viết rao vặt
              </h3>
              <p className="text-xs text-slate-500">
                Các tin rao vặt thu hút nhiều lượt nhấn sang link Shopee Affiliate nhất.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Sản phẩm</th>
                  <th className="py-3 px-4">Người đăng</th>
                  <th className="py-3 px-4 text-right">Lượt xem</th>
                  <th className="py-3 px-4 text-right">Click Shopee</th>
                  <th className="py-3 px-4 text-right">CTR</th>
                  <th className="py-3 px-6">Trạng thái Shopee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topAffiliateProducts.map((p) => {
                  const itemCtr = p.views_count > 0
                    ? ((p.affiliate_clicks_count / p.views_count) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || ''}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-sm">
                            <div className="font-semibold text-slate-900 truncate">
                              {p.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {formatVND(p.price)} · {p.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {p.seller_name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {p.views_count}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-orange-600">
                        {p.affiliate_clicks_count}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                        {itemCtr}%
                      </td>
                      <td className="py-3.5 px-6">
                        {p.is_affiliate_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-orange-700 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            <ShoppingBag className="w-3 h-3 text-orange-600" />
                            Đang chạy Affiliate
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Đã tắt</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User RBAC Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Danh sách người dùng hệ thống (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Quản lý quyền hạn người bán và khóa các tài khoản spam, chèn liên kết trái phép.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Người dùng</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isUserAdmin = u.role === 'admin';
                  const isBanned = u.status === 'banned';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {u.phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                          isUserAdmin
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {isUserAdmin ? 'Quản trị viên (Admin)' : 'Người bán (Seller)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                          isBanned
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isBanned ? 'Đã bị khóa (Banned)' : 'Hoạt động bình thường'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {!isUserAdmin && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const actionText = isBanned ? 'mở khóa' : 'khóa';
                                if (window.confirm(`[Admin] Bạn có chắc chắn muốn ${actionText} tài khoản: "${u.name}"?`)) {
                                  onToggleUserBan(u.id);
                                }
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                isBanned
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {isBanned ? 'Mở khóa' : 'Khóa TK'}
                            </button>

                            {onDeleteUser && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`[Admin] Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản: "${u.name}" (${u.email})?`)) {
                                    onDeleteUser(u.id);
                                  }
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Xóa</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
