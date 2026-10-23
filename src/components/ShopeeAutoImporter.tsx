import React, { useState } from 'react';
import { User, Product, ProductCondition } from '../types';
import {
  extractShopeeProductFromUrl,
  ExtractedShopeeProduct,
  SAMPLE_SHOPEE_LINKS
} from '../utils/shopeeExtractor';
import { createProductFromShopeeLink } from '../services/storage';
import { formatVND } from '../utils/security';
import {
  Link as LinkIcon,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Eye,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Edit3,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Upload,
  Camera
} from 'lucide-react';

interface ShopeeAutoImporterProps {
  currentUser: User;
  onProductPublished: (newProduct: Product) => void;
  onGoToMarketplace: () => void;
}

const CATEGORY_OPTIONS = [
  'Đồ điện tử & Công nghệ',
  'Đồ gia dụng & Bếp',
  'Thời trang & Giày dép',
  'Xe cộ & Phụ tùng',
  'Thể thao & Dã ngoại',
];

const CONDITION_OPTIONS: ProductCondition[] = [
  'Mới 100%',
  'Like New 99%',
  'Đã qua sử dụng',
  'Cũ theo thời gian',
];

export const ShopeeAutoImporter: React.FC<ShopeeAutoImporterProps> = ({
  currentUser,
  onProductPublished,
  onGoToMarketplace,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedShopeeProduct | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Mode: 'preview' or 'edit'
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  // New Image URL input for editing gallery
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleExtract = async (urlToExtract: string) => {
    if (!urlToExtract.trim()) {
      setErrorMsg('Vui lòng dán đường link sản phẩm Shopee Affiliate vào ô bên dưới.');
      return;
    }

    setErrorMsg('');
    setIsExtracting(true);
    setPublishedProduct(null);

    try {
      // 1. Try server-side live OpenGraph metadata extractor first
      const resp = await fetch('/api/extract-shopee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToExtract.trim() }),
      });
      if (resp.ok) {
        const liveData = await resp.json();
        setExtractedData(liveData);
        setActiveTab('preview');
        setIsExtracting(false);
        return;
      }
    } catch (e) {
      console.warn('Live API extraction fallback:', e);
    }

    // 2. Client-side verified catalog fallback
    try {
      const result = extractShopeeProductFromUrl(urlToExtract.trim());
      setExtractedData(result);
      setActiveTab('preview');
    } catch (err) {
      setErrorMsg('Không thể trích xuất link này. Vui lòng kiểm tra lại URL Shopee.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePublish = () => {
    if (!extractedData) return;

    if (!extractedData.title.trim()) {
      setErrorMsg('Tên sản phẩm không được để trống.');
      return;
    }
    if (!extractedData.price || extractedData.price <= 0) {
      setErrorMsg('Giá sản phẩm phải lớn hơn 0 VNĐ.');
      return;
    }
    if (extractedData.images.length === 0) {
      setErrorMsg('Sản phẩm cần có ít nhất một hình ảnh hiển thị.');
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      const created = createProductFromShopeeLink(currentUser, extractedData);
      setPublishedProduct(created);
      onProductPublished(created);
      setIsPublishing(false);
    }, 350);
  };

  const handleSelectSample = (sample: typeof SAMPLE_SHOPEE_LINKS[0]) => {
    setInputUrl(sample.url);
    handleExtract(sample.url);
  };

  // Editing helper functions
  const handleUpdateField = <K extends keyof ExtractedShopeeProduct>(key: K, value: ExtractedShopeeProduct[K]) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      [key]: value,
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim() || !extractedData) return;
    if (extractedData.images.includes(newImageUrl.trim())) return;
    setExtractedData({
      ...extractedData,
      images: [...extractedData.images, newImageUrl.trim()],
    });
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !extractedData) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setExtractedData(prev => {
            if (!prev) return prev;
            if (prev.images.includes(dataUrl)) return prev;
            return {
              ...prev,
              images: [...prev.images, dataUrl]
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!extractedData || extractedData.images.length <= 1) return;
    setExtractedData({
      ...extractedData,
      images: extractedData.images.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    if (!extractedData || indexToPrimary === 0) return;
    const selected = extractedData.images[indexToPrimary];
    const remaining = extractedData.images.filter((_, idx) => idx !== indexToPrimary);
    setExtractedData({
      ...extractedData,
      images: [selected, ...remaining],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trình Quản Trị Viên (Admin Shopee Affiliate)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Trích Xuất Hình Ảnh, Giá Chuẩn & Mô Tả Chi Tiết Từ Link Shopee
        </h1>

        <p className="text-sm sm:text-base text-orange-100 max-w-3xl leading-relaxed">
          Dán link sản phẩm Shopee gắn mã hoa hồng của Admin. Bộ trích xuất tự động phân tích hình ảnh sắc nét, giá bán niêm yết chuẩn VNĐ, thông số kỹ thuật và chính sách bảo hành 100% Shopee Mall, cho phép Admin tinh chỉnh nhanh rồi đẩy trực tiếp lên Bảng tin.
        </p>

        {/* Quick Link Presets */}
        <div className="pt-2">
          <div className="text-xs font-bold text-orange-200 uppercase tracking-wider mb-2">
            Link mẫu dùng thử nhanh đa ngành hàng:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SAMPLE_SHOPEE_LINKS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/25 rounded-lg text-xs font-semibold text-white transition-all border border-white/20 backdrop-blur-xs shadow-xs"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <label className="block text-sm font-bold text-slate-800">
          Dán đường dẫn sản phẩm Shopee (Hỗ trợ link đầy đủ, link rút gọn shope.ee, s.shopee.vn):
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <LinkIcon className="w-4 h-4 text-orange-500 absolute left-3.5 top-3.5" />
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="VD: https://shopee.vn/apple-iphone-16-pro-max-256gb-chinh-hang-vna-i.8837192.991827461"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="button"
            onClick={() => handleExtract(inputUrl)}
            disabled={isExtracting}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang trích xuất dữ liệu...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Trích xuất chi tiết chuẩn 100%</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Published Success Alert */}
      {publishedProduct && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Đã tự động đẩy sản phẩm lên Bảng tin Chợ Việt 24h thành công!</span>
          </div>

          <p className="text-xs text-emerald-800 leading-relaxed">
            Sản phẩm đã được duyệt công khai. Khi khách hàng bấm vào bài đăng này trên Bảng tin, hệ thống sẽ <strong>tự động chuyển hướng ngay sang Shopee theo đường link affiliate của bạn</strong>, ghi nhận lượt click và mang lại hoa hồng trực tiếp.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onGoToMarketplace}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Xem bài đăng trên Bảng tin ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setInputUrl('');
                setExtractedData(null);
                setPublishedProduct(null);
              }}
              className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Dán link sản phẩm khác
            </button>
          </div>
        </div>
      )}

      {/* Extracted Details Preview & Edit Workspace */}
      {extractedData && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Top action row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Trích xuất hoàn tất & Chuẩn hóa thông tin</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Kiểm tra thông tin trước khi xuất bản lên Bảng tin
              </h3>
            </div>

            {/* Mode switch tabs & Publish CTA */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Xem trước hiển thị
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'edit'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa chi tiết</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing || publishedProduct !== null}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {publishedProduct
                    ? 'Đã đẩy lên bảng tin'
                    : isPublishing
                    ? 'Đang đẩy lên...'
                    : 'Đẩy lên bảng tin ngay'}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: PREVIEW MODE */}
          {activeTab === 'preview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Image Gallery (5 cols) */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={extractedData.images[0]}
                    alt={extractedData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    Ảnh chính ({extractedData.images.length} ảnh)
                  </div>
                </div>

                {extractedData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {extractedData.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Bấm để đặt làm ảnh chính"
                        className={`aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          idx === 0 ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct quick file upload in preview mode */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-orange-200 shadow-2xs">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Tải thêm ảnh từ máy</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Quản lý ảnh
                  </button>
                </div>

                <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-orange-900 font-bold">
                    <span>Liên kết Shopee Mall tự động gán:</span>
                    <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-mono">
                      Shopee Direct Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    Nút bấm: <span className="font-bold text-orange-700">{extractedData.shopee_button_label}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Link đích: {extractedData.shopee_affiliate_url}
                  </div>
                </div>
              </div>

              {/* Product Details & Formatted Specs (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      {extractedData.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                      {extractedData.condition}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-orange-700 font-semibold">{extractedData.seller_name}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {extractedData.title}
                  </h2>

                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-bold text-orange-600 font-mono tabular-nums">
                      {formatVND(extractedData.price)}
                    </span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      Giá niêm yết chính hãng Shopee
                    </span>
                  </div>
                </div>

                {/* Full Description & Policies */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Mô tả & Thông số kỹ thuật & Chính sách bảo hành trích xuất:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('edit')}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa mô tả</span>
                    </button>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl max-h-64 overflow-y-auto text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                    {extractedData.description}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[11px]">Khu vực giao dịch:</span>
                    <span className="font-semibold text-slate-800">{extractedData.location}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[11px]">Trạng thái đăng:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tự động duyệt công khai
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: INLINE EDIT MODE (Allows fine-tuning price, title, images, description) */}
          {activeTab === 'edit' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Admin có thể chỉnh sửa trực tiếp giá bán thực tế, tiêu đề hoặc hình ảnh nếu muốn khớp 100% với chương trình khuyến mãi Shopee hiện tại.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold text-xs"
                >
                  Xong & Xem lại
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên sản phẩm hiển thị trên Bảng tin:</label>
                  <input
                    type="text"
                    value={extractedData.title}
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Price in VND */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Giá bán thực tế (VNĐ):</span>
                    <span className="text-orange-600 font-mono font-bold">
                      {formatVND(extractedData.price)}
                    </span>
                  </label>
                  <input
                    type="number"
                    value={extractedData.price}
                    step={10000}
                    onChange={(e) => handleUpdateField('price', Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Danh mục sản phẩm:</label>
                  <select
                    value={extractedData.category}
                    onChange={(e) => handleUpdateField('category', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seller Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên gian hàng hiển thị:</label>
                  <input
                    type="text"
                    value={extractedData.seller_name}
                    onChange={(e) => handleUpdateField('seller_name', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Condition */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tình trạng sản phẩm:</label>
                  <select
                    value={extractedData.condition}
                    onChange={(e) => handleUpdateField('condition', e.target.value as ProductCondition)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                  >
                    {CONDITION_OPTIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Quản lý hình ảnh sản phẩm ({extractedData.images.length} ảnh):</span>
                  <span className="text-slate-500 text-[11px]">Bấm vào ảnh để đặt làm ảnh đại diện</span>
                </label>

                {/* Image Grid with Delete / Set Primary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {extractedData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group aspect-square rounded-xl overflow-hidden border bg-slate-50 ${
                        idx === 0 ? 'border-orange-500 ring-2 ring-orange-300' : 'border-slate-200'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Ảnh bìa
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            title="Đặt làm ảnh bìa"
                            className="p-1 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-600 rounded text-[10px] font-bold"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {extractedData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Xóa ảnh này"
                            className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Options: Direct File Upload & URL Paste */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Option 1: Direct File Upload / Camera */}
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-xl bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition-all group text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-orange-950">
                      Tải ảnh trực tiếp từ máy / Chụp ảnh
                    </span>
                    <span className="text-[11px] text-orange-700/80 mt-0.5">
                      Chọn một hoặc nhiều ảnh (JPG, PNG, WebP)
                    </span>
                  </label>

                  {/* Option 2: Add by Image URL */}
                  <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-bold text-slate-700">
                      Hoặc dán link ảnh trực tuyến:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddImage}
                        disabled={!newImageUrl.trim()}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Ảnh sẽ được tự động đồng bộ vào bài đăng Shopee
                    </span>
                  </div>
                </div>
              </div>

              {/* Description & Warranty */}
              <div className="space-y-1 pt-3 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Mô tả sản phẩm, thông số & chính sách bảo hành:</span>
                  <span className="text-[11px] text-slate-400">Đầy đủ quy chuẩn 100% Shopee Mall</span>
                </label>
                <textarea
                  rows={8}
                  value={extractedData.description}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Shopee CTA Button text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Chữ hiển thị trên nút mua hàng Shopee:</label>
                  <input
                    type="text"
                    value={extractedData.shopee_button_label}
                    onChange={(e) => handleUpdateField('shopee_button_label', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Link Affiliate Shopee đích:</label>
                  <input
                    type="url"
                    value={extractedData.shopee_affiliate_url}
                    onChange={(e) => handleUpdateField('shopee_affiliate_url', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Xem lại kết quả
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing || publishedProduct !== null}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg text-xs font-extrabold shadow-sm flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Lưu & Đẩy ngay lên Bảng tin</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
