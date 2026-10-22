import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/storage';
import {
  X,
  Lock,
  Phone,
  Mail,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  messageNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  messageNotice,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ Số điện thoại/Email và Mật khẩu.');
      return;
    }

    const res = loginUser(loginIdentifier, loginPassword);
    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Đăng nhập không thành công.');
      return;
    }

    setSuccessMsg(`Chào mừng ${res.user.name} đã quay trở lại!`);
    setTimeout(() => {
      onSuccess(res.user!);
      onClose();
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regPhone.trim() || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mật khẩu.');
      return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(regPhone.trim())) {
      setErrorMsg('Số điện thoại không đúng định dạng Việt Nam hợp lệ.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword,
    });

    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Đăng ký tài khoản không thành công.');
      return;
    }

    setSuccessMsg('Đăng ký tài khoản người bán thành công! Đang đăng nhập...');
    setTimeout(() => {
      onSuccess(res.user!);
      onClose();
    }, 900);
  };

  const fillAdminCredentials = () => {
    setMode('login');
    setLoginIdentifier('toanhuongnguyen201708@gmail.com');
    setLoginPassword('Toanhuong1');
    setErrorMsg('');
  };

  const fillSellerCredentials = () => {
    setMode('login');
    setLoginIdentifier('0912345678');
    setLoginPassword('123456');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-xs tracking-tight shadow-xs">
              24h
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản bán hàng'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Chợ Việt 24h - Sàn Mua Bán & Rao Vặt Trực Tuyến
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

        {/* Notice if user was redirected because they clicked "Đăng tin bán" */}
        {messageNotice && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{messageNotice}</span>
          </div>
        )}

        {/* Tab switch between Login and Register */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng ký bán hàng
            </button>
          </div>
        </div>

        {/* Error / Success Notifications */}
        <div className="px-6 pt-3">
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
        </div>

        {/* MODE: LOGIN */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            
            {/* Quick Fill Admin Button */}
            <div className="p-3 bg-orange-50/80 border border-orange-200/80 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-orange-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Tài khoản Quản trị viên (Admin) thử nghiệm:</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Email: <span className="font-mono font-bold text-slate-900">toanhuongnguyen201708@gmail.com</span> · MK: <span className="font-mono font-bold text-slate-900">Toanhuong1</span>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="w-full py-1.5 px-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Bấm điền nhanh tài khoản Admin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Input Phone or Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Số điện thoại hoặc Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="VD: admin hoặc email/số điện thoại..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Mật khẩu
                </label>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              Đăng nhập ngay
            </button>

            {/* Seller Quick fill */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={fillSellerCredentials}
                className="text-xs text-slate-500 hover:text-orange-600 transition-colors"
              >
                Hoặc thử đăng nhập tài khoản Khách bán mẫu (0912345678 / 123456)
              </button>
            </div>

          </form>
        ) : (
          /* MODE: REGISTER TO SELL */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              Đăng ký tài khoản người bán để đăng tin rao vặt miễn phí, quản lý sản phẩm và nhận liên hệ trực tiếp từ người mua qua SĐT/Zalo.
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Họ và tên người bán <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Anh"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Phone (Required for contact & login) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Số điện thoại (dùng đăng nhập & khách liên hệ) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="VD: 0988123456"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="VD: banhang@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Mật khẩu (tối thiểu 6 ký tự) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mật khẩu của bạn..."
                  className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Xác nhận lại mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Submit Register */}
            <button
              type="submit"
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm mt-2"
            >
              Hoàn tất đăng ký & Bắt đầu bán hàng
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
