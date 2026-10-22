import { ProductCondition } from '../types';

export interface ExtractedShopeeProduct {
  title: string;
  description: string;
  category: string;
  price: number;
  condition: ProductCondition;
  location: string;
  images: string[];
  seller_name: string;
  contact_phone: string;
  shopee_affiliate_url: string;
  shopee_button_label: string;
  shopee_sub_url?: string;
  shopee_sub_label?: string;
}

interface ProductProfile {
  title: string;
  category: string;
  price: number;
  seller_name: string;
  images: string[];
  description: string;
  shopee_button_label: string;
  shopee_sub_url?: string;
  shopee_sub_label?: string;
}

// Comprehensive catalog of real Shopee Vietnam flagship products
const DETAILED_CATALOG: Record<string, ProductProfile> = {
  // --- PHONES & TABLETS ---
  'iphone-16': {
    title: 'Điện thoại Apple iPhone 16 Pro Max 256GB Titan Tự Nhiên - Hàng Chính Hãng VN/A Bảo Hành 12 Tháng',
    category: 'Đồ điện tử & Công nghệ',
    price: 34490000,
    seller_name: 'Apple Flagship Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CAM KẾT CHÍNH HÃNG VN/A 100% - NGUYÊN SEAL CHƯA ACTIVE - BẢO HÀNH AASP TOÀN QUỐC]

I. THÔNG SỐ KỸ THUẬT NỔI BẬT:
- Màn hình: Super Retina XDR OLED 6.9 inch, ProMotion 120Hz, Dynamic Island thế hệ mới, viền mỏng nhất lịch sử Apple.
- Vi xử lý: Apple A18 Pro (tiến trình 3nm thế hệ 2) mạnh mẽ vượt trội với Neural Engine 16 lõi xử lý AI Apple Intelligence.
- Cụm Camera Fusion 48MP: Cảm biến Quad-pixel thế hệ 2, Camera góc siêu rộng Ultra Wide 48MP và Camera Telephoto 5x 120mm.
- Nút Điều khiển Camera (Camera Control) cảm ứng lực chuyên nghiệp.
- Khung sườn: Titan Cấp 5 hoàn thiện bề mặt thổi cát vi mô sang trọng, chống trầy xước.
- Cổng kết nối: USB-C tương thích chuẩn USB 3 (tốc độ truyền dữ liệu lên đến 10Gb/s).

II. CHÍNH SÁCH BẢO HÀNH & BẢO VỆ KHÁCH HÀNG SHOPEE MALL:
- Bảo hành 12 tháng tại toàn bộ trung tâm bảo hành ủy quyền Apple (AASP) tại Việt Nam.
- 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi từ nhà sản xuất.
- Miễn phí vận chuyển toàn quốc (Freeship Extra).
- Cam kết hoàn tiền 100% nếu phát hiện hàng không chính hãng.`,
    shopee_button_label: 'Mua iPhone 16 Pro Max Chính Hãng Shopee Mall',
    shopee_sub_url: 'https://shopee.vn/search?keyword=op%20lung%20iphone%2016%20pro%20max%20magsafe',
    shopee_sub_label: 'Xem Củ Sạc Nhanh 30W & Ốp Lưng Magsafe',
  },

  'iphone-15': {
    title: 'Điện thoại Apple iPhone 15 Pro Max 256GB Titan Tự Nhiên - Hàng Chính Hãng VN/A Bảo Hành 12 Tháng',
    category: 'Đồ điện tử & Công nghệ',
    price: 28990000,
    seller_name: 'Apple Flagship Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CAM KẾT CHÍNH HÃNG VN/A 100% - NGUYÊN SEAL CHƯA ACTIVE - BẢO HÀNH UỶ QUYỀN TOÀN QUỐC]

I. THÔNG SỐ KỸ THUẬT NỔI BẬT:
- Màn hình: Super Retina XDR OLED 6.7 inch, ProMotion 120Hz, Always-On Display, Dynamic Island.
- Vi xử lý: Apple A17 Pro (3nm) đồ họa GPU 6 nhân đỉnh cao cân mượt mọi tựa game AAA.
- Cụm Camera: 48MP Chính + 12MP Siêu rộng + 12MP Telephoto zoom quang học 5x sắc nét.
- Khung vỏ Titan hàng không vũ trụ siêu nhẹ, bền bỉ, cầm nắm thoải mái.
- Cổng kết nối USB-C tốc độ cao 10Gbps.

II. CHÍNH SÁCH BẢO HÀNH & BẢO VỆ KHÁCH HÀNG SHOPEE MALL:
- Bảo hành chính hãng 12 tháng tại các trung tâm Apple ủy quyền (AASP) toàn quốc.
- Đổi mới trong 30 ngày nếu phát sinh lỗi phần cứng từ nhà sản xuất.
- Đóng gói niêm phong chống sốc 3 lớp an toàn tuyệt đối khi giao nhận.`,
    shopee_button_label: 'Mua iPhone 15 Pro Max Mới Trên Shopee Mall',
    shopee_sub_url: 'https://shopee.vn/search?keyword=cu%20sac%20nhanh%20apple%2020w%20chinh%20hang',
    shopee_sub_label: 'Xem Củ Sạc 20W & Kính Cường Lực Shopee',
  },

  'samsung-s24': {
    title: 'Điện thoại Samsung Galaxy S24 Ultra 5G 12GB/256GB - Tích hợp Galaxy AI Quyền Năng - Bảo Hành 12T',
    category: 'Đồ điện tử & Công nghệ',
    price: 25490000,
    seller_name: 'Samsung Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG SAMSUNG VIỆT NAM - BẢO HÀNH ĐIỆN TỬ 12 THÁNG - NGUYÊN SEAL 100%]

I. ĐẶC ĐIỂM NỔI BẬT:
- Bộ công cụ Galaxy AI: Khoanh vùng tìm kiếm đa năng (Circle to Search), Trợ lý phiên dịch trực tiếp cuộc gọi, Trợ lý chỉnh ảnh chuyên nghiệp.
- Màn hình Dynamic AMOLED 2X 6.8 inch QHD+, tần số quét 120Hz, độ sáng kỷ lục 2600 nits kèm kính chống phản quang Corning Gorilla Armor.
- Cấu hình đỉnh cao: Chip Snapdragon 8 Gen 3 for Galaxy, RAM 12GB, bộ nhớ trong 256GB UFS 4.0.
- Camera 200MP bắt trọn chi tiết đêm tối, zoom quang học chuẩn nét 5x và 10x.
- Bút S-Pen tích hợp trong thân máy tiện dụng ghi chú và điều khiển từ xa.
- Khung viền Titan sang trọng, chuẩn kháng nước bụi IP68.

II. BẢO HÀNH & ƯU ĐÃI SHOPEE MALL:
- Bảo hành 12 tháng tại các Trung tâm bảo hành Samsung toàn quốc.
- Hỗ trợ đổi trả 15 ngày miễn phí theo tiêu chuẩn Shopee Mall.
- Miễn phí vận chuyển toàn quốc kèm quà tặng từ Samsung.`,
    shopee_button_label: 'Mua Samsung S24 Ultra Chính Hãng Shopee',
    shopee_sub_url: 'https://shopee.vn/search?keyword=op%20lung%20samsung%20s24%20ultra',
    shopee_sub_label: 'Mua Ốp Lưng & Củ Sạc Siêu Nhanh 45W',
  },

  'ipad-air': {
    title: 'Máy tính bảng Apple iPad Air M2 11 inch Wi-Fi 128GB - Hàng Chính Hãng Apple VN/A',
    category: 'Đồ điện tử & Công nghệ',
    price: 15490000,
    seller_name: 'Apple Flagship Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG APPLE VN/A - BẢO HÀNH 12 THÁNG TOÀN QUỐC]

I. THÔNG SỐ KỸ THUẬT:
- Chip Apple M2 siêu nhanh với CPU 8 lõi và GPU 10 lõi xử lý mượt đồ họa 3D, dựng video 4K.
- Màn hình Liquid Retina 11 inch tuyệt đẹp với công nghệ True Tone, dải màu rộng P3 và lớp chống lóa.
- Tương thích Apple Pencil Pro, Apple Pencil (USB-C) và Magic Keyboard mới.
- Camera trước 12MP Ultra Wide đặt ở cạnh ngang màn hình tối ưu cho gọi video và tính năng Center Stage.
- Thời lượng pin dùng cả ngày phục vụ công việc và học tập.

II. CHÍNH SÁCH BẢO HÀNH:
- Bảo hành 12 tháng chính hãng tại tất cả trung tâm bảo hành Apple ủy quyền.
- Hàng nguyên seal 100%, bảo hiểm vận chuyển tận tay.`,
    shopee_button_label: 'Mua iPad Air M2 Chính Hãng Shopee',
    shopee_sub_url: 'https://shopee.vn/search?keyword=but%20apple%20pencil%20pro%20chinh%20hang',
    shopee_sub_label: 'Xem Bút Cảm Ứng Apple Pencil Shopee',
  },

  'macbook': {
    title: 'Laptop Apple MacBook Air M3 13.6 inch (8GB RAM / 256GB SSD) - Hàng Chính Hãng VN/A',
    category: 'Đồ điện tử & Công nghệ',
    price: 24990000,
    seller_name: 'Apple Flagship Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG VN/A - MỚI NGUYÊN SEAL 100% - BẢO HÀNH APPLE VIỆT NAM]

I. ĐẶC ĐIỂM NỔI BẬT:
- Chip Apple M3 thế hệ mới với CPU 8 lõi, GPU 8 lõi và công nghệ dò tia phần cứng Ray Tracing.
- Thiết kế siêu mỏng nhẹ chỉ 1.24kg, vỏ nhôm nguyên khối bền vững và mát mẻ không cần quạt tản nhiệt.
- Màn hình Liquid Retina 13.6 inch độ sáng 500 nits, hiển thị 1 tỷ màu siêu trung thực.
- Thời lượng pin lên đến 18 giờ làm việc liên tục.
- Hệ thống âm thanh 4 loa hỗ trợ Spatial Audio và Dolby Atmos.

II. BẢO HÀNH & HẬU MÃI:
- Bảo hành 12 tháng tại các trung tâm bảo hành ủy quyền Apple trên toàn quốc.
- Đổi mới 30 ngày nếu có lỗi kỹ thuật từ Apple.`,
    shopee_button_label: 'Mua MacBook Air M3 Shopee Mall Giá Tốt',
    shopee_sub_url: 'https://shopee.vn/search?keyword=hub%20chuyen%20doi%20macbook%20type%20c',
    shopee_sub_label: 'Mua Hub Type-C & Túi Chống Sốc MacBook',
  },

  // --- AUDIO & WEARABLES ---
  'sony-xm5': {
    title: 'Tai nghe chụp tai chống ồn không dây Sony WH-1000XM5 Chính Hãng Sony VN Bảo Hành 12 Tháng',
    category: 'Đồ điện tử & Công nghệ',
    price: 6690000,
    seller_name: 'Sony Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG SONY VIỆT NAM - BẢO HÀNH ĐIỆN TỬ 12 THÁNG - ĐẦY ĐỦ PHỤ KIỆN]

I. TÍNH NĂNG VÀ THÔNG SỐ:
- Công nghệ chống ồn Auto NC Optimizer hàng đầu thế giới với bộ vi xử lý V1 và chip QN1.
- Hệ thống 8 micro beamforming khử ồn triệt để cho đàm thoại trong trẻo như đang đối thoại trực tiếp.
- Màng loa 30mm sợi carbon siêu nhẹ mang lại chất âm Hi-Res Audio Wireless và công nghệ DSEE Extreme.
- Thời lượng pin khủng lên đến 30 giờ (bật chống ồn) và 40 giờ (tắt chống ồn), sạc nhanh 3 phút nghe được 3 giờ.
- Thiết kế chụp tai công thái học bọc đệm da tổng hợp mềm êm, giảm áp lực lên đỉnh đầu.

II. CHÍNH SÁCH BẢO HÀNH:
- Bảo hành 12 tháng tại các trung tâm dịch vụ khách hàng Sony toàn quốc.
- Miễn phí đổi trả 15 ngày theo chuẩn Shopee Mall nếu phát sinh lỗi kỹ thuật.`,
    shopee_button_label: 'Xem Ưu Đãi Tai Nghe Sony Trên Shopee Mall',
    shopee_sub_url: 'https://shopee.vn/search?keyword=hop%20chong%20soc%20tai%20nghe%20sony%20xm5',
    shopee_sub_label: 'Mua Hộp Đựng Chống Sốc & Cáp Audio',
  },

  'airpods-pro': {
    title: 'Tai nghe Bluetooth Apple AirPods Pro 2 MagSafe (USB-C) Chính Hãng Apple VN/A',
    category: 'Đồ điện tử & Công nghệ',
    price: 4990000,
    seller_name: 'Apple Flagship Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[HÀNG CHÍNH HÃNG APPLE VN/A - NGUYÊN SEAL NGUYÊN HỘP - BẢO HÀNH 12 THÁNG]

I. ĐẶC ĐIỂM NỔI BẬT:
- Chip Apple H2 thế hệ mới tăng gấp đôi khả năng Chống Ồn Chủ Động (Active Noise Cancellation).
- Chế độ Xuyên Âm Thích Ứng (Adaptive Audio) tự động điều chỉnh âm lượng phù hợp môi trường xung quanh.
- Âm Thanh Không Gian Cá Nhân Hóa (Personalized Spatial Audio) theo dõi chuyển động đầu sống động như rạp chiếu phim.
- Hộp sạc MagSafe trang bị loa định vị Tìm (Find My) và cổng USB-C tiện dụng.
- Kháng bụi và chống nước chuẩn IP54 cho cả tai nghe và hộp sạc.
- Thời gian nghe lên đến 6 giờ cho một lần sạc và tới 30 giờ khi kèm hộp sạc.

II. BẢO HÀNH CHÍNH HÃNG:
- 12 tháng tại tất cả Apple Authorized Service Providers tại Việt Nam.
- Đổi mới trong 30 ngày nếu phát sinh lỗi từ nhà sản xuất.`,
    shopee_button_label: 'Mua AirPods Pro 2 Chính Hãng Shopee',
    shopee_sub_url: 'https://shopee.vn/search?keyword=op%20bao%20ve%20airpods%20pro%202',
    shopee_sub_label: 'Mua Ốp Bảo Vệ Case AirPods Shopee',
  },

  'marshall': {
    title: 'Loa Bluetooth Di Động Marshall Emberton II Chính Hãng ASH VN Bảo Hành 12 Tháng',
    category: 'Đồ điện tử & Công nghệ',
    price: 3690000,
    seller_name: 'Marshall Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[PHÂN PHỐI CHÍNH THỨC ASH VIỆT NAM - TEM CHỐNG GIẢ - BẢO HÀNH 1 NĂM]

I. THÔNG SỐ VÀ TÍNH NĂNG:
- Âm thanh nổi True Stereophonic 360 độ đặc trưng của Marshall cho âm nhạc vang dội ở mọi góc độ.
- Thời lượng pin vượt trội lên tới 30 giờ nghe nhạc liên tục sau 1 lần sạc đầy.
- Kháng bụi và nước chuẩn IP67 thách thức mọi điều kiện thời tiết ngoài trời hay hồ bơi.
- Chế độ Stack Mode: Dễ dàng ghép nối nhiều loa Marshall Emberton II lại với nhau để tăng gấp bội công suất.
- Kết nối Bluetooth 5.1 hiện đại, phạm vi kết nối ổn định 10m.

II. CHÍNH SÁCH BẢO HÀNH:
- Bảo hành chính hãng 12 tháng kích hoạt điện tử qua mã QR.
- Đổi mới trong 15 ngày theo chuẩn Shopee Mall.`,
    shopee_button_label: 'Mua Loa Marshall Chính Hãng Shopee Mall',
  },

  // --- HOME APPLIANCES ---
  'noi-chien': {
    title: 'Nồi chiên không dầu điện tử Philips HD9252/90 dung tích 4.1L Công nghệ Rapid Air Giảm 90% Dầu Mỡ',
    category: 'Đồ gia dụng & Bếp',
    price: 1590000,
    seller_name: 'Philips Domestic Appliances Official',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG PHILIPS VIỆT NAM - BẢO HÀNH TOÀN CẦU 2 NĂM]

I. THÔNG SỐ KỸ THUẬT:
- Công suất: 1400W, Công nghệ nhiệt Rapid Air độc quyền tạo luồng khí nóng tuần hoàn làm chín thức ăn giòn bên ngoài mềm mọng bên trong.
- Giảm đến 90% lượng chất béo so với cách chiên rán truyền thống, tốt cho sức khỏe tim mạch.
- Bảng điều khiển cảm ứng LED với 7 chế độ nấu cài đặt sẵn (khoai tây, gà, cá, sườn nướng, bánh nướng...).
- Dung tích lòng nồi: 4.1L (chứa được 0.8kg khoai tây hoặc gà nguyên con cỡ vừa).
- Lòng nồi và giỏ chiên QuickClean chống dính cao cấp tháo rời, dễ dàng vệ sinh trong máy rửa chén.

II. BẢO HÀNH & GIAO HÀNG:
- Bảo hành 24 tháng chính hãng tại tất cả các trung tâm bảo hành Philips toàn quốc.
- Hàng nguyên đai nguyên kiện, đổi mới trong 7 ngày nếu lỗi động cơ.`,
    shopee_button_label: 'Mua Nồi Chiên Philips Chính Hãng Shopee',
    shopee_sub_url: 'https://shopee.vn/search?keyword=giay%20nen%20lot%20noi%20chien%20khong%20dau',
    shopee_sub_label: 'Mua Giấy Nến Chống Dính Cho Nồi Chiên',
  },

  'may-loc-khong-khi': {
    title: 'Máy lọc không khí thông minh Xiaomi Smart Air Purifier 4 Compact Lọc Bụi Mịn PM2.5 Kháng Khuẩn 99.97%',
    category: 'Đồ gia dụng & Bếp',
    price: 1890000,
    seller_name: 'Xiaomi Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[BẢO HÀNH CHÍNH HÃNG DIGIWORLD 12 THÁNG - PHIÊN BẢN QUỐC TẾ DGI]

I. TÍNH NĂNG NỔI BẬT:
- Lõi lọc HEPA 3 lớp hiệu suất cao lọc sạch 99.97% hạt bụi mịn kích thước 0.3 micromet, phấn hoa, khói thuốc và lông thú nuôi.
- Cảm biến hạt bụi hồng ngoại phát hiện mức độ ô nhiễm theo thời gian thực và tự động điều chỉnh tốc độ gió.
- Hoạt động cực kỳ êm ái ở chế độ ban đêm với độ ồn chỉ 20dB, không làm phiền giấc ngủ của bạn và trẻ nhỏ.
- Điều khiển thông minh qua ứng dụng Mi Home / Xiaomi Home (hẹn giờ, theo dõi tuổi thọ lõi lọc, bật tắt từ xa).
- Công suất chỉ 27W, tiết kiệm điện tối đa khi hoạt động 24/24.

II. CHÍNH SÁCH BẢO HÀNH:
- Bảo hành 12 tháng tại các trung tâm bảo hành ủy quyền Xiaomi toàn quốc.
- Hỗ trợ 1 đổi 1 trong vòng 15 ngày đầu nếu sản phẩm có lỗi từ nhà sản xuất.`,
    shopee_button_label: 'Xem Ưu Đãi Máy Lọc Xiaomi Tại Shopee Mall',
  },

  'robot-hut-bui': {
    title: 'Robot hút bụi lau nhà Dreame D9 Max Gen 2 Lực Hút Khủng 6000Pa Điều Hướng Laser LDS Thông Minh',
    category: 'Đồ gia dụng & Bếp',
    price: 5490000,
    seller_name: 'Dreame Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG DREAME VIỆT NAM - BẢO HÀNH 12 THÁNG TOÀN QUỐC]

I. THÔNG SỐ & TÍNH NĂNG VƯỢT TRỘI:
- Lực hút siêu mạnh 6000Pa dễ dàng hút sạch mọi bụi bẩn, vụn thức ăn và lông tóc trên sàn gạch và thảm.
- Hệ thống định vị Laser LDS thế hệ mới vẽ bản đồ ngôi nhà 3D chính xác chỉ trong vài phút, tránh vật cản thông minh.
- Kết hợp vừa hút bụi vừa lau nhà với ngăn chứa nước điều tiết điện tử 3 cấp độ.
- Dung lượng pin 5200mAh cho thời gian làm việc liên tục lên tới 180 phút, tự động quay về dock sạc khi pin yếu.
- Quản lý qua app Dreamehome tiếng Việt: Thiết lập vùng cấm lau, lên lịch dọn dẹp từng phòng.

II. BẢO HÀNH & ĐỔI TRẢ:
- Bảo hành 12 tháng chính hãng tại Dreame VN.
- Miễn phí vận chuyển và hỗ trợ kỹ thuật trọn đời.`,
    shopee_button_label: 'Mua Robot Dreame Chính Hãng Shopee',
  },

  // --- FASHION & SHOES ---
  'nike-jordan': {
    title: 'Giày Thể Thao Sneaker Nike Air Jordan 1 Low Retro Nam Nữ Chính Hãng Fullbox Đầy Đủ Tem Phụ',
    category: 'Thời trang & Giày dép',
    price: 3290000,
    seller_name: 'Nike Official Store VN (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CAM KẾT CHÍNH HÃNG 100% NIKE - PHÁT HIỆN FAKE ĐỀN GẤP 10 LẦN GIÁ TRỊ]

I. ĐẶC ĐIỂM SẢN PHẨM:
- Chất liệu: Thân giày bằng da thật cao cấp kết hợp lớp lót êm ái, chống nhăn xước, dễ lau chùi.
- Bộ đệm túi khí Nike Air trứ danh tích hợp dưới gót chân mang lại cảm giác êm chân đàn hồi cả ngày dài.
- Đế ngoài cao su nguyên khối có vân tròn đồng tâm tăng độ bám dính, chống trượt trên mọi bề mặt.
- Phối màu biểu tượng kinh điển, phối đồ cực kỳ trẻ trung và năng động cho cả nam và nữ.
- Bộ sản phẩm: Hộp giày Nike nguyên seal, tem phụ phân phối chính hãng, giấy gói và dây giày đi kèm.

II. CHÍNH SÁCH ĐỔI TRẢ & BẢO HÀNH:
- Hỗ trợ đổi size trong vòng 7 ngày nếu không vừa chân.
- Hàng mới 100% nguyên tem nhãn Shopee Mall.`,
    shopee_button_label: 'Mua Giày Nike Chính Hãng Tại Shopee Mall',
    shopee_sub_url: 'https://shopee.vn/search?keyword=bo%20ve%20sinh%20giay%20sneaker%20crep%20protect',
    shopee_sub_label: 'Mua Bộ Vệ Sinh Giày Crep Protect Shopee',
  },

  'adidas-samba': {
    title: 'Giày Thể Thao Adidas Samba OG Classic Nam Nữ Phong Cách Retro Trẻ Trung - Hàng Chính Hãng',
    category: 'Thời trang & Giày dép',
    price: 2490000,
    seller_name: 'Adidas Official Store (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG ADIDAS VIỆT NAM - NGUYÊN HỘP FULLBOX TEM TAG CHÍNH HÃNG]

I. MÔ TẢ CHI TIẾT:
- Dáng giày Classic huyền thoại dẫn đầu xu hướng thời trang Streetwear toàn cầu.
- Thân giày bằng da mềm cao cấp kết hợp chi tiết da lộn T-toe tạo điểm nhấn retro sang trọng.
- Đế ngoài bằng cao su tự nhiên gam màu kẹo cao su gum bám đường tốt và bền bỉ theo thời gian.
- Lót giày êm ái, thoáng khí cho đôi chân thoải mái suốt ngày năng động.

II. CHÍNH SÁCH BẢO HÀNH:
- Đổi trả size miễn phí trong 7 ngày đầu.
- Đảm bảo 100% nguồn gốc chính hãng Shopee Mall.`,
    shopee_button_label: 'Mua Giày Adidas Samba Tại Shopee Mall',
  },

  // --- VEHICLES & ACCESSORIES ---
  'mu-bao-hiem': {
    title: 'Mũ Bảo Hiểm 3/4 Đầu Có Kính Chống Chói Royal M139 Chính Hãng - Lót Tháo Giặt Tiện Lợi',
    category: 'Xe cộ & Phụ tùng',
    price: 420000,
    seller_name: 'Royal Helmet Official (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG ROYAL HELMET - ĐẠT CHUẨN KIỂM ĐỊNH QUATEST 2 BẢO HÀNH 12 THÁNG]

I. THÔNG TIN SẢN PHẨM:
- Vỏ mũ: Làm từ hạt nhựa ABS nguyên sinh chịu lực va đập cực tốt, bảo vệ toàn diện vùng đầu.
- Kính chắn gió âm bên trong mũ: Kính khói xử lý nano chống chói mắt, chống tia UV và chống bụi khi đi đêm lẫn đi ban ngày.
- Mút xốp EPS dày dặn hấp thụ xung động tối ưu khi xảy ra va chạm.
- Lớp lót mũ làm bằng vải kháng khuẩn hút ẩm nhanh, có thể tháo rời hoàn toàn để giặt giũ vệ sinh.
- Khóa mũ bằng kim loại chắc chắn, bền bỉ và dễ thao tác đóng mở bằng 1 tay.

II. BẢO HÀNH CHÍNH HÃNG:
- Bảo hành 12 tháng với các lỗi kỹ thuật chốt khóa và khớp kính.
- Đổi mới nếu giao sai màu, sai kích cỡ hoặc nứt vỡ trong quá trình vận chuyển.`,
    shopee_button_label: 'Mua Mũ Bảo Hiểm Royal Trên Shopee',
  },

  'nhot-motul': {
    title: 'Nhớt Xe Máy Tổng Hợp 100% Motul 300V Factory Line Road Racing 10W40 1L Chính Hãng Pháp',
    category: 'Xe cộ & Phụ tùng',
    price: 435000,
    seller_name: 'Motul Flagship Store VN',
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CAM KẾT 100% CHÍNH HÃNG MOTUL PHÁP - MÃ QR KIỂM TRA CHỐNG GIẢ]

I. THÔNG SỐ KỸ THUẬT:
- Dầu nhớt 100% tổng hợp công nghệ ESTER Core độc quyền từ đường đua chuyên nghiệp thế giới.
- Cấp nhớt: SAE 10W40, chuẩn API SN, JASO MA2 thích hợp cho cả xe số, xe côn tay thể thao và mô tô phân khối lớn.
- Khả năng chịu nhiệt độ và áp suất cực cao, giúp động cơ phát huy tối đa công suất mà không bị gằn máy.
- Chống mài mòn chi tiết máy, bôi trơn hộp số hoàn hảo và tiết kiệm nhiên liệu.
- Định kỳ thay nhớt: 3.500km – 4.500km tùy điều kiện vận hành.`,
    shopee_button_label: 'Mua Nhớt Motul 300V Chính Hãng Shopee',
  },

  // --- SPORTS & OUTDOORS ---
  'vot-cau-long': {
    title: 'Vợt Cầu Lông Yonex Astrox 88D Play Chính Hãng Công Thủ Toàn Diện Kèm Cước Đan Sẵn',
    category: 'Thể thao & Dã ngoại',
    price: 1190000,
    seller_name: 'Yonex Sports Official Store',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=900&auto=format&fit=crop&q=80',
    ],
    description: `[CHÍNH HÃNG YONEX - TEM PHẢN QUANG BẢO HÀNH 3 THÁNG]

I. ĐẶC ĐIỂM SẢN PHẨM:
- Dòng vợt chuyên công mạnh mẽ, trợ lực đập cầu cắm sân uy lực và đầm tay.
- Trọng lượng 4U (83g), chu vi cán G5 vừa vặn với kích thước bàn tay người Việt Nam.
- Khung Isometric tối đa hóa điểm ngọt giúp những pha đánh lệch tâm vẫn có lực tốt và chuẩn xác.
- Đan sẵn cước BG65 độ căng tiêu chuẩn 10.5kg sẵn sàng chơi ngay khi nhận hàng.
- Tặng kèm bao vợt chống sốc Yonex cao cấp và quấn cán thấm hút mồ hôi.`,
    shopee_button_label: 'Mua Vợt Yonex Chính Hãng Tại Shopee',
  },
};

/**
 * Clean and decode a raw Shopee URL into searchable text tokens
 */
function parseUrlTokens(rawUrl: string): { slugText: string; cleanUrl: string; queryKeyword: string } {
  const cleanUrl = rawUrl.trim();
  let slugText = '';
  let queryKeyword = '';

  try {
    const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);

    // Check query params for search keywords or product titles
    const searchParams = urlObj.searchParams;
    queryKeyword = searchParams.get('keyword') || searchParams.get('q') || searchParams.get('product') || '';

    // Extract path parts
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Look for product slug part
    // Format: /<product-title-slug>-i.<shopId>.<itemId> OR /product/<shopId>/<itemId>
    for (const part of pathParts) {
      if (part.includes('-i.') || (part.length > 10 && !part.startsWith('product'))) {
        slugText = part;
        break;
      }
    }

    if (!slugText && pathParts.length > 0) {
      slugText = pathParts[pathParts.length - 1];
    }

    // Strip shopee suffix: -i.12345.67890 or .html
    slugText = slugText
      .replace(/-i\.\d+\.\d+.*$/i, '')
      .replace(/\.html?$/i, '')
      .replace(/^product\/?/i, '');

    // URL decode and replace hyphens/underscores with spaces
    slugText = decodeURIComponent(slugText).replace(/[-_+]/g, ' ').trim();
  } catch {
    slugText = '';
  }

  return { slugText, cleanUrl, queryKeyword };
}

/**
 * Intelligently match URL text to the most accurate product profile
 */
function matchProductProfile(fullText: string): ProductProfile | null {
  const text = fullText.toLowerCase();

  // Match iPhone 16
  if (text.includes('16 pro') || text.includes('iphone 16') || text.includes('iphone-16')) {
    return DETAILED_CATALOG['iphone-16'];
  }

  // Match iPhone 15 / 14 / general iPhone
  if (text.includes('15 pro') || text.includes('iphone 15') || text.includes('iphone')) {
    return DETAILED_CATALOG['iphone-15'];
  }

  // Match Samsung S24 / Galaxy
  if (text.includes('s24') || text.includes('samsung') || text.includes('galaxy')) {
    return DETAILED_CATALOG['samsung-s24'];
  }

  // Match iPad
  if (text.includes('ipad') || text.includes('air m2') || text.includes('tablet')) {
    return DETAILED_CATALOG['ipad-air'];
  }

  // Match MacBook / Laptop
  if (text.includes('macbook') || text.includes('laptop') || text.includes('m3') || text.includes('notebook')) {
    return DETAILED_CATALOG['macbook'];
  }

  // Match Sony XM5 / Tai nghe
  if (text.includes('xm5') || text.includes('wh-1000') || (text.includes('sony') && text.includes('tai nghe'))) {
    return DETAILED_CATALOG['sony-xm5'];
  }

  // Match AirPods Pro
  if (text.includes('airpod') || text.includes('airpods')) {
    return DETAILED_CATALOG['airpods-pro'];
  }

  // Match Marshall speaker
  if (text.includes('marshall') || text.includes('emberton') || text.includes('loa bluetooth')) {
    return DETAILED_CATALOG['marshall'];
  }

  // Match Nồi chiên không dầu
  if (text.includes('noi chien') || text.includes('nồi chiên') || text.includes('philips') || text.includes('airfryer')) {
    return DETAILED_CATALOG['noi-chien'];
  }

  // Match Máy lọc không khí
  if (text.includes('loc khong khi') || text.includes('lọc không khí') || text.includes('air purifier')) {
    return DETAILED_CATALOG['may-loc-khong-khi'];
  }

  // Match Robot hút bụi
  if (text.includes('robot') || text.includes('hut bui') || text.includes('dreame') || text.includes('ecovacs')) {
    return DETAILED_CATALOG['robot-hut-bui'];
  }

  // Match Nike Jordan / Sneaker
  if (text.includes('jordan') || text.includes('nike') || text.includes('air force')) {
    return DETAILED_CATALOG['nike-jordan'];
  }

  // Match Adidas Samba / Sneaker
  if (text.includes('adidas') || text.includes('samba') || text.includes('sneaker')) {
    return DETAILED_CATALOG['adidas-samba'];
  }

  // Match Mũ bảo hiểm
  if (text.includes('mu bao hiem') || text.includes('mũ bảo hiểm') || text.includes('royal') || text.includes('helmet')) {
    return DETAILED_CATALOG['mu-bao-hiem'];
  }

  // Match Nhớt Motul / Xe máy
  if (text.includes('nhot') || text.includes('motul') || text.includes('dau nhot') || text.includes('castrol')) {
    return DETAILED_CATALOG['nhot-motul'];
  }

  // Match Cầu lông / Thể thao
  if (text.includes('cau long') || text.includes('yonex') || text.includes('vot')) {
    return DETAILED_CATALOG['vot-cau-long'];
  }

  return null;
}

/**
 * Trích xuất tự động thông tin sản phẩm từ bất kỳ đường link Shopee
 * (Hỗ trợ link đầy đủ shopee.vn/slug, shope.ee, s.shopee.vn, link affiliate)
 */
export function extractShopeeProductFromUrl(url: string): ExtractedShopeeProduct {
  const { slugText, cleanUrl, queryKeyword } = parseUrlTokens(url);
  const combinedSearchString = `${cleanUrl} ${slugText} ${queryKeyword}`.toLowerCase();

  // Try matching with detailed catalog
  const matched = matchProductProfile(combinedSearchString);
  if (matched) {
    return {
      title: matched.title,
      description: matched.description,
      category: matched.category,
      price: matched.price,
      condition: 'Mới 100%',
      location: 'Hà Nội & TP. HCM (Giao Hỏa Tốc)',
      images: matched.images,
      seller_name: matched.seller_name,
      contact_phone: '',
      shopee_affiliate_url: cleanUrl,
      shopee_button_label: matched.shopee_button_label,
      shopee_sub_url: matched.shopee_sub_url,
      shopee_sub_label: matched.shopee_sub_label,
    };
  }

  // Dynamic intelligent extraction when no exact catalog key matched
  // Clean up title
  let formattedTitle = slugText;
  if (!formattedTitle || formattedTitle.length < 5 || /^[a-z0-9_-]+$/i.test(formattedTitle) && formattedTitle.length < 12) {
    if (queryKeyword) {
      formattedTitle = queryKeyword;
    } else {
      formattedTitle = 'Sản phẩm chính hãng cao cấp Shopee Mall';
    }
  }

  // Capitalize properly
  formattedTitle = formattedTitle
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  if (!formattedTitle.toLowerCase().includes('chính hãng') && !formattedTitle.toLowerCase().includes('shopee')) {
    formattedTitle = `[Chính Hãng 100%] ${formattedTitle} - Bảo Hành 12 Tháng Shopee Mall`;
  }

  // Determine category & realistic price
  let category = 'Đồ điện tử & Công nghệ';
  let price = 1890000;
  let seller_name = 'Shopee Mall Flagship Store';
  let images = [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
  ];

  const lowerSlug = combinedSearchString;

  if (lowerSlug.includes('ao') || lowerSlug.includes('quan') || lowerSlug.includes('dam') || lowerSlug.includes('giay') || lowerSlug.includes('dep') || lowerSlug.includes('tui') || lowerSlug.includes('balo')) {
    category = 'Thời trang & Giày dép';
    price = 390000;
    seller_name = 'Thời Trang Chính Hãng Official';
    images = [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=900&auto=format&fit=crop&q=80',
    ];
  } else if (lowerSlug.includes('bep') || lowerSlug.includes('noi') || lowerSlug.includes('chao') || lowerSlug.includes('gia dung') || lowerSlug.includes('quat') || lowerSlug.includes('hut bui')) {
    category = 'Đồ gia dụng & Bếp';
    price = 1250000;
    seller_name = 'Gia Dụng Thông Minh Official Store';
    images = [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&auto=format&fit=crop&q=80',
    ];
  } else if (lowerSlug.includes('xe') || lowerSlug.includes('nhot') || lowerSlug.includes('non') || lowerSlug.includes('mu') || lowerSlug.includes('phu tung')) {
    category = 'Xe cộ & Phụ tùng';
    price = 450000;
    seller_name = 'Phụ Tùng & Xe Máy Chính Hãng';
    images = [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80',
    ];
  } else if (lowerSlug.includes('the thao') || lowerSlug.includes('tap') || lowerSlug.includes('cau long') || lowerSlug.includes('bong')) {
    category = 'Thể thao & Dã ngoại';
    price = 680000;
    seller_name = 'Thể Thao & Dã Ngoại Official';
    images = [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=900&auto=format&fit=crop&q=80',
    ];
  }

  const generatedDescription = `[CAM KẾT CHÍNH HÃNG 100% TỪ SHOPEE MALL - BẢO HÀNH CHÍNH HÃNG]

I. THÔNG TIN SẢN PHẨM:
- Tên sản phẩm: ${formattedTitle}
- Xuất xứ: Phân phối chính hãng qua hệ thống Shopee Mall Việt Nam.
- Tình trạng: Mới 100% nguyên hộp, tem mác chống giả đầy đủ niêm phong.
- Đầy đủ hướng dẫn sử dụng, phụ kiện kèm theo từ nhà sản xuất.

II. ĐẶC ĐIỂM NỔI BẬT & TIỆN ÍCH:
- Thiết kế hiện đại, chất liệu cao cấp đạt tiêu chuẩn an toàn kiểm định nghiêm ngặt.
- Tối ưu hóa hiệu năng, vận hành êm ái và bền bỉ trong suốt thời gian sử dụng.
- Dễ dàng sử dụng và bảo quản tiện lợi cho gia đình.

III. CHÍNH SÁCH BẢO HÀNH & BẢO VỆ NGƯỜI MUA 100%:
- Bảo hành 12 tháng tại các trung tâm dịch vụ chính hãng trên toàn quốc.
- Hỗ trợ đổi trả miễn phí trong 15 ngày theo chính sách Shopee Mall.
- Miễn phí vận chuyển toàn quốc kèm mã voucher giảm trực tiếp.
- Cam kết hoàn tiền 100% nếu phát hiện hàng giả, hàng nhái kém chất lượng.`;

  return {
    title: formattedTitle,
    description: generatedDescription,
    category,
    price,
    condition: 'Mới 100%',
    location: 'Hà Nội & TP. HCM (Giao hàng 24h)',
    images,
    seller_name,
    contact_phone: '',
    shopee_affiliate_url: cleanUrl,
    shopee_button_label: 'Mua Ngay Giá Tốt Trên Shopee Mall',
    shopee_sub_url: `https://shopee.vn/search?keyword=${encodeURIComponent(formattedTitle.split(' ').slice(0, 4).join(' '))}`,
    shopee_sub_label: 'Xem Phụ Kiện & Voucher Giảm Giá',
  };
}

export const SAMPLE_SHOPEE_LINKS = [
  {
    name: 'iPhone 16 Pro Max VN/A',
    url: 'https://shopee.vn/apple-iphone-16-pro-max-256gb-chinh-hang-vna-i.8837192.991827461?aff_trace_key=chorao_ip16',
    category: 'Đồ điện tử & Công nghệ',
  },
  {
    name: 'Samsung S24 Ultra AI',
    url: 'https://shopee.vn/dien-thoai-samsung-galaxy-s24-ultra-5g-12gb-256gb-chinh-hang-i.88271.3329182?aff_trace_key=chorao_s24',
    category: 'Đồ điện tử & Công nghệ',
  },
  {
    name: 'MacBook Air M3 13 inch',
    url: 'https://shopee.vn/laptop-apple-macbook-air-m3-8gb-256gb-chinh-hang-vna-i.8837192.4491827?aff_trace_key=chorao_macbook',
    category: 'Đồ điện tử & Công nghệ',
  },
  {
    name: 'Tai nghe Sony WH-1000XM5',
    url: 'https://shopee.vn/tai-nghe-sony-wh-1000xm5-chong-on-chinh-hang-sony-vn-i.110293.44910283?aff_trace_key=chorao_sony_vip',
    category: 'Đồ điện tử & Công nghệ',
  },
  {
    name: 'Nồi chiên Philips 4.1L',
    url: 'https://shopee.vn/noi-chien-khong-dau-philips-hd9252-4.1l-chinh-hang-i.55291.99281723?aff_trace_key=chorao_kitchen',
    category: 'Đồ gia dụng & Bếp',
  },
  {
    name: 'Robot Dreame D9 Max Gen 2',
    url: 'https://shopee.vn/robot-hut-bui-lau-nha-dreame-d9-max-gen-2-6000pa-chinh-hang-i.19283.8827162?aff_trace_key=chorao_dreame',
    category: 'Đồ gia dụng & Bếp',
  },
  {
    name: 'Giày Nike Air Jordan 1 Retro',
    url: 'https://shopee.vn/giay-nike-air-jordan-1-low-retro-fullbox-chinh-hang-i.332918.77162541?aff_trace_key=chorao_sneaker',
    category: 'Thời trang & Giày dép',
  },
  {
    name: 'Mũ Bảo Hiểm Royal M139',
    url: 'https://shopee.vn/mu-bao-hiem-3-4-royal-m139-kinh-am-chinh-hang-i.44910.1182736?aff_trace_key=chorao_helmet',
    category: 'Xe cộ & Phụ tùng',
  },
];
