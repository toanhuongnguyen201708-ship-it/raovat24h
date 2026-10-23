const fs = require('fs');
const path = require('path');
const extracted = require('../shopee_real_extracted.json');

const shopInfoMap = {
  1: { seller: 'Deli Tools Official Store', price: 145000, cat: 'Dụng cụ & Thiết bị' },
  2: { seller: 'Thiết Bị Bảo Hộ MADIS', price: 38000, cat: 'Dụng cụ & Thiết bị' },
  3: { seller: 'Bảo Hộ Lao Động SSEDA', price: 45000, cat: 'Dụng cụ & Thiết bị' },
  4: { seller: 'Năng Lượng Mặt Trời Mall', price: 89000, cat: 'Đồ điện tử & Công nghệ' },
  5: { seller: 'TopGia HCM Store', price: 39000, cat: 'Đồ gia dụng & Bếp' },
  6: { seller: 'NENON Official Store', price: 139000, cat: 'Đồ gia dụng & Bếp' },
  7: { seller: 'AKUBA Official Store', price: 199000, cat: 'Thời trang & Giày dép' },
  8: { seller: 'TopGia HCM Store', price: 195000, cat: 'Đồ gia dụng & Bếp' },
  9: { seller: 'ASAKI Store', price: 95000, cat: 'Đồ điện tử & Công nghệ' },
  10: { seller: 'Đèn Pin Siêu Sáng Mall', price: 85000, cat: 'Đồ điện tử & Công nghệ' },
  11: { seller: 'Thế Giới Phụ Kiện Store', price: 139000, cat: 'Đồ điện tử & Công nghệ' },
  12: { seller: 'TopGia HCM Store', price: 39000, cat: 'Đồ gia dụng & Bếp' },
  13: { seller: 'Xưởng May Bảo Hộ Lao Động', price: 145000, cat: 'Dụng cụ & Thiết bị' },
  14: { seller: 'Xưởng May Bảo Hộ Lao Động', price: 119000, cat: 'Dụng cụ & Thiết bị' },
  15: { seller: 'Xưởng May Bảo Hộ Lao Động', price: 155000, cat: 'Dụng cụ & Thiết bị' },
  16: { seller: 'Xưởng May Bảo Hộ Lao Động', price: 155000, cat: 'Dụng cụ & Thiết bị' },
  17: { seller: 'Bảo Hộ Lao Động SSEDA', price: 65000, cat: 'Dụng cụ & Thiết bị' },
  18: { seller: 'TONNIFU Official Store', price: 195000, cat: 'Đồ điện tử & Công nghệ' },
  19: { seller: 'Ugreen Official Store', price: 1350000, cat: 'Đồ điện tử & Công nghệ' },
  20: { seller: 'Realfit Official Store', price: 179000, cat: 'Đồ điện tử & Công nghệ' },
  21: { seller: 'ROBOT Official Store', price: 189000, cat: 'Đồ điện tử & Công nghệ' },
  22: { seller: 'Soundcore Anker Official Store', price: 490000, cat: 'Đồ điện tử & Công nghệ' },
  23: { seller: 'JBL Official Store', price: 1490000, cat: 'Đồ điện tử & Công nghệ' },
  24: { seller: 'Upper You Store', price: 35000, cat: 'Thời trang & Giày dép' },
  25: { seller: 'GUZADO Official Store', price: 79000, cat: 'Thời trang & Giày dép' },
  26: { seller: 'NOWEAR Official Store', price: 129000, cat: 'Thời trang & Giày dép' },
  27: { seller: 'Coolmate Official Store', price: 189000, cat: 'Thời trang & Giày dép' },
  28: { seller: 'PTLUXURY Official Store', price: 39000, cat: 'Đồ gia dụng & Bếp' },
  29: { seller: 'SHANEN Store', price: 179000, cat: 'Đồ gia dụng & Bếp' },
  30: { seller: 'Gia Dụng Tiện Ích Mall', price: 95000, cat: 'Đồ gia dụng & Bếp' },
  31: { seller: 'GOOJODOQ Official Store', price: 129000, cat: 'Đồ điện tử & Công nghệ' },
  32: { seller: 'Thiết Bị Nhà Bếp Store', price: 69000, cat: 'Đồ gia dụng & Bếp' },
  33: { seller: 'Masler Footwear', price: 69000, cat: 'Thời trang & Giày dép' },
  34: { seller: 'Carnaval Shoes Official', price: 199000, cat: 'Thời trang & Giày dép' },
  35: { seller: 'Unisex Sandals Store', price: 75000, cat: 'Thời trang & Giày dép' },
  36: { seller: 'MiSTERY Shoes Store', price: 219000, cat: 'Thời trang & Giày dép' },
  37: { seller: 'Elmich Official Store', price: 249000, cat: 'Đồ gia dụng & Bếp' },
  38: { seller: 'Ugreen Official Store', price: 349000, cat: 'Đồ điện tử & Công nghệ' }
};

const fullProducts = extracted.map((item) => {
  const meta = shopInfoMap[item.index] || { seller: 'Shopee Mall Chính Hãng', price: 99000, cat: 'Đồ gia dụng & Bếp' };
  
  const desc = `100% Sản phẩm chính hãng phân phối qua Shopee Mall.
- Tên sản phẩm: ${item.title}
- Gian hàng uy tín: ${meta.seller}
- Tình trạng: Mới 100% nguyên hộp, đầy đủ tem mác và phụ kiện kèm theo từ nhà sản xuất.
- Tiêu chuẩn: Đổi trả 15 ngày miễn phí theo chính sách Shopee, bảo hành uy tín.
- Bấm "Mua ngay" để nhận ưu đãi giá sốc và chuyển tiếp trực tiếp sang ứng dụng Shopee.`;

  return {
    id: 'prod_shopee_' + item.index,
    user_id: 'user_admin',
    seller_name: meta.seller,
    seller_phone: '0961513578',
    seller_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: item.title,
    description: desc,
    category: meta.cat,
    price: meta.price,
    condition: 'Mới 100%',
    location: item.index % 2 === 0 ? 'TP. Hồ Chí Minh & Toàn Quốc' : 'Hà Nội & Toàn Quốc (Giao Hỏa Tốc)',
    images: [item.image],
    contact_phone: '0961513578',
    status: 'approved',
    shopee_affiliate_url: item.link,
    shopee_button_label: 'Mua ngay',
    is_affiliate_active: true,
    is_shopee_direct: true,
    is_pinned: item.index === 1,
    ...(item.index === 1 ? {
      pinned_until: '2026-11-23T00:00:00Z',
      pin_package: '30_days',
      pinned_at: '2026-10-23T00:00:00Z'
    } : {}),
    shopee_sub_url: '',
    shopee_sub_label: '',
    views_count: 150 + item.index * 12,
    affiliate_clicks_count: 30 + item.index * 4,
    created_at: new Date(Date.now() - (39 - item.index) * 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  };
});

fs.writeFileSync(path.join(__dirname, '../full_real_products.json'), JSON.stringify(fullProducts, null, 2));
console.log('Successfully generated full_real_products.json with', fullProducts.length, 'products');
