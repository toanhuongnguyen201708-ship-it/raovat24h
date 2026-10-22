/**
 * Link Security & Content Filtering Rules
 * Khách hàng không có quyền chèn link tiếp thị hoặc link ngoại vi
 */

// Regex to catch web URLs, domains, and affiliate tracking fragments
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+|(?:shopee\.[a-z.]+|lazada\.[a-z.]+|tiki\.[a-z.]+|facebook\.com|zalo\.me|bit\.ly|tinyurl\.com|[a-zA-Z0-9-]+\.(?:com|vn|net|org|edu|xyz|io|top|shop|store|online)(?:\/[^\s]*)?)/i;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  matchedUrl?: string;
}

export function validateNoExternalLinks(text: string): ValidationResult {
  if (!text) return { isValid: true };
  
  const match = text.match(URL_REGEX);
  if (match) {
    return {
      isValid: false,
      message: 'Quy định bảo mật: Tiêu đề và mô tả không được chứa đường link ngoại vi hoặc liên kết quảng cáo.',
      matchedUrl: match[0],
    };
  }
  return { isValid: true };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateVN(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTimeAgoVN(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return formatDateVN(dateString);
}
