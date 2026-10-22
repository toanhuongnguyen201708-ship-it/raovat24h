import React, { useState } from 'react';
import { User } from '../types';
import { changePassword } from '../services/storage';
import { X, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    const res = changePassword(currentUser.id, currentPassword, newPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Đổi mật khẩu thất bại.');
      return;
    }

    setSuccessMsg('Đổi mật khẩu thành công! Mật khẩu mới đã được lưu an toàn.');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Đổi mật khẩu tài khoản</h3>
              <p className="text-[11px] text-slate-500">
                {currentUser.role === 'admin' ? 'Tài khoản Quản trị viên (Admin)' : 'Tài khoản Người bán'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="text-slate-500">Đang đổi mật khẩu cho:</div>
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>{currentUser.name}</span>
              <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentUser.phone}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Mật khẩu hiện tại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Mật khẩu mới (tối thiểu 6 ký tự) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Cập nhật mật khẩu mới
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
