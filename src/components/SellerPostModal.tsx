import React, { useState, useRef, useEffect } from 'react';
import { User, ProductCondition } from '../types';
import { validateNoExternalLinks, formatVND } from '../utils/security';
import { CATEGORIES, VIETNAM_LOCATIONS, CONDITIONS } from '../data/mockData';
import {
  X,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  Plus,
  ShieldCheck,
  RefreshCw,
  Check
} from 'lucide-react';

interface SellerPostModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    description: string;
    category: string;
    price: number;
    condition: ProductCondition;
    location: string;
    images: string[];
    contact_phone: string;
  }) => void;
}

export const SellerPostModal: React.FC<SellerPostModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Đồ điện tử & Công nghệ');
  const [priceInput, setPriceInput] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Like New 99%');
  const [location, setLocation] = useState('Hà Nội');
  const [contactPhone, setContactPhone] = useState(currentUser.role === 'admin' ? '' : (currentUser.phone || ''));
  const [description, setDescription] = useState('');

  // Images state (supports up to 6 uploaded or captured photos)
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/product_iphone14_display_1792691162211.jpg',
  ]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Live Camera states
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hidden native inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement>(null);

  // Link violation detection
  const titleValidation = validateNoExternalLinks(title);
  const descValidation = validateNoExternalLinks(description);
  const hasLinkViolation = !titleValidation.isValid || !descValidation.isValid;

  const numericPrice = parseInt(priceInput.replace(/\D/g, ''), 10) || 0;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setPriceInput(rawVal);
  };

  // Image compressor to prevent localStorage overflow
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle files selected from computer or phone gallery
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    try {
      const newImagesList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (images.length + newImagesList.length >= 6) {
          alert('Tối đa 6 hình ảnh cho một bài đăng.');
          break;
        }
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file);
          newImagesList.push(compressed);
        }
      }
      if (newImagesList.length > 0) {
        setImages((prev) => [...prev, ...newImagesList].slice(0, 6));
      }
    } catch (err) {
      alert('Không thể tải ảnh lên. Vui lòng thử lại ảnh khác.');
    } finally {
      setIsProcessingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Start Live Camera stream
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError('');
    setIsLiveCameraOpen(true);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError(
        'Không thể mở camera trình duyệt (vui lòng cấp quyền truy cập camera hoặc dùng nút "Chụp từ máy").'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraOpen(false);
    setCameraError('');
  };

  // Capture snapshot from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setImages((prev) => [photoDataUrl, ...prev].slice(0, 6));
      stopCamera();
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const removeImage = (indexToRemove: number) => {
    if (images.length === 1) {
      alert('Bài đăng cần ít nhất 1 hình ảnh sản phẩm thực tế.');
      return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasLinkViolation) {
      alert('Phát hiện đường link ngoại vi! Quy định sàn nghiêm cấm chèn liên kết quảng cáo hoặc link website vào bài đăng.');
      return;
    }

    if (!title.trim() || numericPrice <= 0 || !description.trim() || !contactPhone.trim()) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    if (images.length === 0) {
      alert('Vui lòng đăng ít nhất 1 hình ảnh sản phẩm.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      price: numericPrice,
      condition,
      location,
      images,
      contact_phone: contactPhone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Đăng tin bán hàng</h3>
            <p className="text-xs text-slate-500">
              Bài đăng sẽ được Quản trị viên duyệt để đảm bảo an toàn cho cộng đồng.
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* RBAC Security Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Đăng bán: </span>
              Bạn đang đăng với tư cách <span className="font-bold underline">{currentUser.name}</span>. Hệ thống tự động lọc các đường link quảng cáo ngoại vi.
            </div>
          </div>

          {/* Link violation warning if seller attempts to insert URL */}
          {hasLinkViolation && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">VI PHẠM QUY ĐỊNH BẢO MẬT:</div>
                <div>
                  Hệ thống phát hiện ký tự đường link ngoại vi: 
                  <code className="mx-1 px-1 bg-rose-100 text-rose-800 rounded font-mono font-bold">
                    {titleValidation.matchedUrl || descValidation.matchedUrl}
                  </code>
                </div>
                <div className="mt-1 text-slate-600">
                  Vui lòng xóa đường link trước khi gửi bài đăng.
                </div>
              </div>
            </div>
          )}

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Tiêu đề sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bán iPhone 14 Pro Max 128GB Tím Quốc Tế pin 91% Fullbox"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                !titleValidation.isValid
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Danh mục <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-orange-500 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Tình trạng sản phẩm <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-orange-500 focus:outline-none"
              >
                {CONDITIONS.filter((c) => c !== 'Tất cả tình trạng').map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price (VNĐ) & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Giá bán mong muốn (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={priceInput ? Number(priceInput).toLocaleString('vi-VN') : ''}
                  onChange={handlePriceChange}
                  placeholder="VD: 5.500.000"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                  VNĐ
                </span>
              </div>
              {numericPrice > 0 && (
                <div className="text-[11px] text-orange-600 mt-1 font-mono">
                  Hiển thị: {formatVND(numericPrice)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Khu vực giao dịch <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-orange-500 focus:outline-none"
              >
                {VIETNAM_LOCATIONS.filter((l) => l !== 'Tất cả khu vực').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Phone / Zalo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Số điện thoại / Zalo liên hệ <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="VD: 0912345678"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:border-orange-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Người mua sẽ trực tiếp bấm nút "Gọi điện" hoặc "Trò chuyện qua Zalo" tới số này.
            </p>
          </div>

          {/* PRODUCT IMAGE SECTION: UPLOAD DIRECTLY OR LIVE CAMERA */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Hình ảnh sản phẩm ({images.length}/6 ảnh) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tải ảnh từ máy hoặc chụp trực tiếp
              </span>
            </div>

            {/* Hidden Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            <input
              type="file"
              ref={mobileCameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFilesSelected}
              className="hidden"
            />

            {/* Action Buttons: Upload & Camera */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
              {/* Button 1: Upload from Device */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage || images.length >= 6}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4 text-orange-600" />
                <span>{isProcessingImage ? 'Đang xử lý...' : 'Tải ảnh từ máy'}</span>
              </button>

              {/* Button 2: Live Camera Viewfinder */}
              <button
                type="button"
                onClick={() => startCamera('environment')}
                disabled={images.length >= 6}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Chụp ảnh camera</span>
              </button>

              {/* Button 3: Mobile Native Camera prompt */}
              <button
                type="button"
                onClick={() => mobileCameraInputRef.current?.click()}
                disabled={images.length >= 6}
                className="hidden sm:flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>Chụp bằng điện thoại</span>
              </button>
            </div>

            {/* Live Camera Viewfinder Modal / Inline View */}
            {isLiveCameraOpen && (
              <div className="mb-4 p-3 bg-slate-900 rounded-2xl text-white space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                    <Camera className="w-4 h-4" />
                    <span>Camera chụp ảnh trực tiếp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                      title="Đổi camera trước/sau"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Đổi camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {cameraError ? (
                  <div className="p-3 bg-rose-900/60 border border-rose-700 rounded-xl text-xs text-rose-200">
                    {cameraError}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => mobileCameraInputRef.current?.click()}
                        className="px-3 py-1 bg-white text-slate-900 rounded-md font-bold text-xs"
                      >
                        Dùng camera hệ điều hành
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Shutter Button */}
                    <div className="absolute bottom-4 inset-x-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="w-14 h-14 rounded-full border-4 border-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                        title="Bấm chụp ảnh"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images Grid Preview */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs"
                >
                  <img
                    src={img}
                    alt={`Ảnh sản phẩm ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] px-1 rounded font-bold">
                      Ảnh bìa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/40 flex flex-col items-center justify-center text-slate-400 hover:text-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-semibold">Thêm ảnh</span>
                </button>
              )}
            </div>
          </div>

          {/* Description (Plain Text Only, No Links) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Mô tả chi tiết sản phẩm (Thuần văn bản, không chứa liên kết) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả nguồn gốc, tình trạng pin, ngoại hình, bảo hành, lý do thanh lý và địa chỉ xem hàng trực tiếp..."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm leading-relaxed focus:outline-none focus:ring-2 ${
                !descValidation.isValid
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Hệ thống tự động lọc các đường link ngoại vi.</span>
              <span>{description.length} ký tự</span>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={hasLinkViolation || isProcessingImage}
              className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center gap-2 ${
                hasLinkViolation || isProcessingImage
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Gửi bài đăng</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
