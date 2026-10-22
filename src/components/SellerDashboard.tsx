import React, { useState } from 'react';
import { Product, User, ProductStatus } from '../types';
import { formatVND, formatTimeAgoVN } from '../utils/security';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  EyeOff,
  ShoppingBag,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  Info,
  Eye,
  MousePointerClick
} from 'lucide-react';

interface SellerDashboardProps {
  currentUser: User;
  products: Product[];
  onOpenPostModal: () => void;
  onEditProduct: (product: Product) => void;
  onMarkSold: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  products,
  onOpenPostModal,
  onEditProduct,
  onMarkSold,
  onDeleteProduct,
  onViewProduct,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');

  // Filter products belonging to current user
  const userProducts = products.filter((p) => p.user_id === currentUser.id);

  const filtered = userProducts.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã duyệt (Đang hiển thị)
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded font-medium">
            <Clock className="w-3.5 h-3.5" />
            Chờ Admin duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Bị từ chối
          </span>
        );
      case 'sold':
        return (
          <span className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded font-medium">
            <Check className="w-3.5 h-3.5" />
            Đã bán
          </span>
        );
      case 'hidden':
        return (
          <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded font-medium">
            <EyeOff className="w-3.5 h-3.5" />
            Đã ẩn
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý tin đăng của tôi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi trạng thái duyệt, chỉnh sửa hoặc đánh dấu đã bán các món hàng của bạn.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng tin mới</span>
        </button>
      </div>

      {/* Rules Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900">Quy tắc chỉnh sửa bài đăng: </span>
          Theo quy định hệ thống, khi bạn chỉnh sửa bất kỳ thông tin nào (giá, ảnh, mô tả), bài viết sẽ tự động chuyển về trạng thái <span className="font-semibold text-amber-700">Chờ duyệt (Pending)</span> để Admin xác minh lại nhằm tránh chèn link spam.
        </div>
      </div>

      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: `Tất cả (${userProducts.length})` },
          { id: 'approved', label: `Đã duyệt (${userProducts.filter(p => p.status === 'approved').length})` },
          { id: 'pending', label: `Chờ duyệt (${userProducts.filter(p => p.status === 'pending').length})` },
          { id: 'rejected', label: `Bị từ chối (${userProducts.filter(p => p.status === 'rejected').length})` },
          { id: 'sold', label: `Đã bán (${userProducts.filter(p => p.status === 'sold').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Chưa có bài đăng nào trong mục này</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bạn có thể đăng bán sản phẩm điện tử, gia dụng, thời trang thanh lý để tiếp cận người mua ngay hôm nay.
          </p>
          <button
            onClick={onOpenPostModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng tin ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={product.images?.[0] || ''}
                  alt={product.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(product.status)}
                    <span className="text-xs text-slate-400 font-mono">
                      {formatTimeAgoVN(product.created_at)}
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewProduct(product)}
                    className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer truncate"
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="text-orange-600 font-bold font-mono text-sm tabular-nums">
                      {formatVND(product.price)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.location}</span>
                  </div>

                  {/* Rejection reason banner if rejected */}
                  {product.status === 'rejected' && product.rejection_reason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Lý do từ chối từ Admin: </span>
                        <span>{product.rejection_reason}</span>
                      </div>
                    </div>
                  )}


                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                <button
                  onClick={() => onViewProduct(product)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Xem tin
                </button>

                {product.status !== 'sold' && (
                  <button
                    onClick={() => onMarkSold(product.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Đánh dấu đã giao dịch xong"
                  >
                    <Check className="w-3 h-3" />
                    <span>Đã bán</span>
                  </button>
                )}

                <button
                  onClick={() => onEditProduct(product)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Chỉnh sửa tin (tin sẽ chuyển về chờ duyệt)"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
                      onDeleteProduct(product.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors"
                  title="Xóa vĩnh viễn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
