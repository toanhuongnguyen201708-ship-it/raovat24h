import React, { useState, useMemo } from 'react';
import { User, Product } from '../types';
import { formatTimeAgoVN } from '../utils/security';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  UserCheck,
  Filter,
  AlertTriangle
} from 'lucide-react';

interface AdminUserManagementProps {
  users: User[];
  products: Product[];
  currentUser: User;
  onToggleUserBan: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  users,
  products,
  currentUser,
  onToggleUserBan,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'sellers'>('all');

  // Counts
  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'active') return u.status === 'active';
      if (statusFilter === 'banned') return u.status === 'banned';
      if (statusFilter === 'sellers') return u.role !== 'admin';

      return true;
    });
  }, [users, searchQuery, statusFilter]);

  const getUserProductCount = (userId: string) => {
    return products.filter(p => p.user_id === userId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <Users className="w-6 h-6 text-rose-600" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản Lý Tài Khoản Đã Đăng Ký
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Khu vực đặc quyền Quản trị viên: Kiểm soát, khóa tài khoản vi phạm hoặc xóa vĩnh viễn tài khoản người dùng trên hệ thống.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Quyền hạn Admin tối cao</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng tài khoản</span>
            <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Đã đăng ký trong hệ thống
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đang hoạt động</span>
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {activeCount}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Tài khoản hợp lệ và có thể đăng tin
          </div>
        </div>

        {/* Banned / Locked Accounts */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đã bị khóa</span>
            <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <Ban className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">
            {bannedCount}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            Bị khóa do vi phạm hoặc spam
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs bg-gradient-to-br from-white to-purple-50/30">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quản trị viên BQT</span>
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">
            {adminCount}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            Có quyền kiểm duyệt & quản trị
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        
        {/* Controls: Search and Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đang hoạt động ({activeCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('banned')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                statusFilter === 'banned'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Đã bị khóa ({bannedCount})</span>
              {bannedCount > 0 && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('sellers')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === 'sellers'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Khách hàng / Người bán ({users.filter(u => u.role !== 'admin').length})
            </button>
          </div>
        </div>

        {/* User Table */}
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">Không tìm thấy tài khoản nào phù hợp</div>
            <p className="text-xs text-slate-400">Vui lòng thử từ khóa tìm kiếm khác hoặc đặt lại bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Người dùng</th>
                  <th className="py-3 px-4 font-bold">Liên hệ / Zalo</th>
                  <th className="py-3 px-4 font-bold">Vai trò</th>
                  <th className="py-3 px-4 font-bold text-center">Số bài đăng</th>
                  <th className="py-3 px-4 font-bold">Trạng thái</th>
                  <th className="py-3 px-4 font-bold text-right">Thao tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isUserAdmin = u.role === 'admin' || u.id === 'admin';
                  const isBanned = u.status === 'banned';
                  const postCount = getUserProductCount(u.id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cột 1: Người dùng */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isUserAdmin && (
                                <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded uppercase">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.email}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Tham gia: {formatTimeAgoVN(u.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: SĐT */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-800 font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.phone || 'Chưa cập nhật'}</span>
                        </div>
                      </td>

                      {/* Cột 3: Vai trò */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isUserAdmin
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isUserAdmin ? 'Quản trị viên (Admin)' : 'Người bán C2C'}
                        </span>
                      </td>

                      {/* Cột 4: Số tin đăng */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-slate-700 text-xs px-2 py-1 bg-slate-100 rounded-lg">
                          {postCount} tin
                        </span>
                      </td>

                      {/* Cột 5: Trạng thái */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          isBanned
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isBanned ? (
                            <>
                              <Ban className="w-3 h-3" />
                              <span>Đã bị khóa</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Hoạt động</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Cột 6: Thao tác Admin (Khóa hoặc Xóa) */}
                      <td className="py-3.5 px-4 text-right">
                        {isUserAdmin ? (
                          <span className="text-[11px] text-slate-400 font-medium italic">
                            Tài khoản BQT (Bảo vệ)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Nút Khóa / Mở Khóa */}
                            <button
                              type="button"
                              onClick={() => {
                                const actionText = isBanned ? 'mở khóa' : 'khóa';
                                if (window.confirm(`[Admin] Bạn có chắc chắn muốn ${actionText} tài khoản: "${u.name}" (${u.email})?`)) {
                                  onToggleUserBan(u.id);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                isBanned
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isBanned ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mở khóa</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Khóa TK</span>
                                </>
                              )}
                            </button>

                            {/* Nút Xóa Tài Khoản Vĩnh Viễn */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`[Admin CẢNH BÁO] Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản: "${u.name}" (${u.email}) khỏi hệ thống? Hành động này không thể hoàn tác.`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Xóa TK</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
