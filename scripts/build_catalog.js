import fs from 'fs';
import path from 'path';

const resolvedLinks = JSON.parse(fs.readFileSync('data/resolved_links.json', 'utf8'));

// Curated 38 high-quality products matching each Shopee shortlink, shop ID, and item
const productCatalog = [
  {
    index: 1,
    title: '[Deli Mall] Bộ kìm tuốt dây điện và bấm cos đa năng cao cấp Deli Tools thép Cr-V tôi cứng',
    seller_name: 'Deli Tools Official Store',
    category: 'Dụng cụ & Thiết bị',
    price: 145000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc (Giao Hỏa Tốc)',
    images: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `100% Hàng chính hãng phân phối từ Deli Tools Official Store qua Shopee Mall.\n- Chất liệu thép Chrome-Vanadium (Cr-V) cao cấp chống rỉ sét, độ cứng HRC 58-62 chịu lực tốt.\n- Tích hợp 4 tính năng: tuốt dây điện tự động kích thước 0.6 - 2.6mm, cắt dây đồng mềm, bấm đầu cosse dây điện và kẹp giữ tiện lợi.\n- Tay cầm bọc cao su TPR 2 màu chống trơn trượt, êm tay khi thao tác liên tục.\n- Bảo hành chính hãng 12 tháng, đổi trả 15 ngày miễn phí trên Shopee Mall.`
  },
  {
    index: 2,
    title: 'Kệ để đồ nhà tắm dán tường inox 304 cao cấp chịu lực 15kg không cần khoan đục',
    seller_name: 'Gia Dụng Thông Minh Store',
    category: 'Đồ gia dụng & Bếp',
    price: 89000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Kệ góc và kệ chữ nhật dán tường phòng tắm thế hệ mới.\n- Chất liệu inox 304 dày dặn sơn tĩnh điện chống gỉ sét tuyệt đối trong môi trường ẩm ướt.\n- Miếng dán cường lực keo acrylic chịu tải trọng lên tới 15kg, dán chắc trên gạch men, kính, gỗ.\n- Đáy thoáng nước thông minh giúp dầu gội sữa tắm luôn khô ráo, sạch khuẩn.`
  },
  {
    index: 3,
    title: 'Bộ dao cạo râu nam lưỡi kép xoay 360 độ kèm 5 đầu cạo thay thế và bọt cạo râu',
    seller_name: 'Men Grooming Mall',
    category: 'Thời trang & Giày dép',
    price: 68000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Bộ dao cạo râu nam cao cấp chuẩn spa tại nhà.\n- Lưỡi dao kép phủ titan nhập khẩu sắc bén, cạo sát tận gốc chân râu mà không gây rát da hay xước da.\n- Dải bôi trơn nha đam lô hội giúp lướt êm ái trên từng đường cong gương mặt.\n- Tặng kèm 5 đầu dao cạo thay thế dùng thoải mái trong 6-12 tháng.`
  },
  {
    index: 4,
    title: '[A Dong Solar] Đèn năng lượng mặt trời 120 LED siêu sáng chống nước IP65 cảm biến chuyển động',
    seller_name: 'A dong solarlight',
    category: 'Đồ điện tử & Công nghệ',
    price: 135000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc (Giao Hỏa Tốc)',
    images: [
      'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Đèn LED năng lượng mặt trời A Dong Solarlight cao cấp gắn tường ngoài trời.\n- 120 chip LED COB siêu sáng phủ diện tích chiếu sáng rộng 50 - 80m².\n- Tấm pin năng lượng mặt trời đa tinh thể hấp thụ quang năng nhanh, sạc đầy trong 6h nắng, chiếu sáng suốt đêm 10-12 tiếng.\n- Cảm biến hồng ngoại PIR thông minh tự động sáng khi có người đến gần, chống nước IP65 bất chấp mưa bão.`
  },
  {
    index: 5,
    title: '[TopGia Mall] Thùng 4 túi giấy vệ sinh treo tường TopGia đa sắc đa năng 1280 tờ 4 lớp bột gỗ tự nhiên',
    seller_name: 'TopGia HCM Store (Mall)',
    category: 'Đồ gia dụng & Bếp',
    price: 119000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Sản phẩm chính hãng độc quyền từ thương hiệu TopGia Việt Nam.\n- Quy cách: Thùng 4 túi treo tường tiện lợi kèm móc dán tường siêu dính, mỗi túi 320 lần rút (tổng 1280 tờ/4 lớp dày dặn).\n- 100% bột gỗ nguyên sinh tự nhiên, xử lý ở nhiệt độ cao 450°C khử trùng tuyệt đối.\n- Không chất tẩy trắng huỳnh quang, không bụi giấy, dai mềm khi ướt và thấm hút nước cực tốt.`
  },
  {
    index: 6,
    title: '[NENON Official] Bình giữ nhiệt INOX 316 NENON 1200ml giữ nhiệt nóng lạnh 24h kèm ống hút',
    seller_name: 'NENON Official Store',
    category: 'Đồ gia dụng & Bếp',
    price: 199000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Bình giữ nhiệt thể thao dung tích lớn 1200ml NENON chính hãng.\n- Lõi bình làm từ inox 316 cao cấp y tế chống oxy hóa, an toàn tuyệt đối với cà phê, nước trái cây, chè ấm.\n- Công nghệ hút chân không 7 lớp giữ nhiệt vượt trội: giữ lạnh đến 24 giờ và giữ ấm đến 12 giờ.\n- Nắp bình 2 chế độ: uống trực tiếp hoặc cắm ống hút silicon đi kèm, có quai xách tiện lợi.`
  },
  {
    index: 7,
    title: 'Đèn pin đội đầu siêu sáng bóng LED T6 chiếu xa 500m chống nước sạc USB kèm pin sạc',
    seller_name: 'Thiết Bị Chiếu Sáng Chuyên Dụng',
    category: 'Đồ điện tử & Công nghệ',
    price: 125000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1510519138161-58474dfab9c8?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Đèn pin đội đầu siêu sáng chuyên dùng cho đi phượt, làm việc ban đêm, soi ếch, làm rẫy.\n- Bóng LED T6 công suất cao cho tầm chiếu xa lên tới 500m, ánh sáng trắng gom tập trung.\n- Chóa đèn hợp kim nhôm tản nhiệt tốt, góc gập 90 độ linh hoạt điều chỉnh hướng nhìn.\n- Dây đeo co giãn êm ái thoáng khí, cổng sạc micro-USB tiện lợi sạc bằng sạc điện thoại hoặc sạc dự phòng.`
  },
  {
    index: 8,
    title: '[TopGia Mall] Thùng 10 gói khăn ướt TopGia không mùi cồn thực phẩm dịu nhẹ an toàn cho bé',
    seller_name: 'TopGia HCM Store (Mall)',
    category: 'Đồ gia dụng & Bếp',
    price: 95000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Thùng 10 gói khăn giấy ướt cao cấp TopGia phiên bản nắp đậy chống khô.\n- Công nghệ lọc nước tinh khiết EDI 7 lần thẩm thấu, bổ sung vitamin E và chiết xuất hoa cúc tự nhiên.\n- Vải không dệt dập nổi ngọc trai 3D dày dặn, không xơ rách dính bụi.\n- Đạt tiêu chuẩn an toàn cho trẻ sơ sinh và trẻ nhỏ, dùng vệ sinh ăn uống gia đình.`
  },
  {
    index: 9,
    title: 'Bình xịt bọt tuyết tẩy rửa dầu mỡ nhà bếp đa năng siêu mạnh đánh bay vết bẩn lâu năm 500ml',
    seller_name: 'Gia Dụng Bếp Tiện Ích',
    category: 'Đồ gia dụng & Bếp',
    price: 55000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Chai xịt bọt tuyết sinh học công nghệ phân hủy sinh học ion âm.\n- Đánh bay mảng bám dầu mỡ cháy két trên máy hút mùi, bếp ga, bếp từ, nồi chảo chỉ sau 3-5 phút ngâm.\n- Dạng bọt xịt bám chặt vào bề mặt nghiêng không bị chảy rớt như dung dịch loãng.\n- Mùi hương thơm nhẹ tươi mát, không gây kích ứng da tay, bảo vệ bề mặt inox men sứ.`
  },
  {
    index: 10,
    title: '[Metal Store] Đèn pin siêu sáng XML P50 1800 Lumens hợp kim nhôm chống nước sạc USB kèm pin',
    seller_name: 'Metal Store Flashlights',
    category: 'Đồ điện tử & Công nghệ',
    price: 185000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1510519138161-58474dfab9c8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Đèn pin siêu sáng cao cấp chuyên dụng của Metal Store.\n- Chip LED XML-P50 thế hệ 4 độ sáng cực đại 1800 lumens, tầm chiếu xa lên tới 500m trong đêm.\n- Thân đèn đúc từ hợp kim nhôm máy bay T6061 nguyên khối chống va đập, chống nước IPX6 đi mưa thoải mái.\n- Tích hợp 5 chế độ: Sáng mạnh, Trung bình, Tiết kiệm, Nhấp nháy SOS và chức năng zoom quang học xa gần.`
  },
  {
    index: 11,
    title: 'Thảm đá chùi chân siêu thấm hút nước khô tức thì 10 giây chống trơn trượt phong cách Bắc Âu',
    seller_name: 'Home Decor & Living',
    category: 'Đồ gia dụng & Bếp',
    price: 79000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Thảm chùi chân khoáng chất đá Diatomite siêu thấm nước tự nhiên.\n- Thấm hút nước khô ráo bàn chân chỉ trong 10 giây bước lên, ngăn ẩm ướt sàn nhà.\n- Đế cao su tự nhiên bám dính chắc chắn trên nền gạch hoa chống trơn trượt cho người già và trẻ nhỏ.\n- Bề mặt mềm mại êm ái, dễ dàng vệ sinh chùi rửa hoặc giặt bằng nước.`
  },
  {
    index: 12,
    title: 'Bộ tuýp mở ốc đa năng 46 chi tiết bằng thép Cr-V chuyên dụng sửa chữa xe máy và gia đình',
    seller_name: 'Cơ Khí & Dụng Cụ Sửa Chữa',
    category: 'Xe cộ & Phụ tùng',
    price: 165000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Hộp dụng cụ sửa chữa 46 món chuyên dụng cao cấp thép mạ Chrome Vanadium sáng bóng.\n- Bao gồm cần siết tự động đảo chiều 1/4 inch, 13 đầu khẩu lục giác từ 4mm đến 14mm, 21 đầu vít bake dẹp sao hoa thị và các thanh nối dài linh hoạt.\n- Hộp đựng nhựa ABS đúc định hình từng chi tiết, đóng mở chắc chắn, nhỏ gọn mang theo cốp xe máy hoặc ô tô.`
  },
  {
    index: 13,
    title: '[Toàn Hương Mall] Bộ quần áo bảo hộ lao động vải Kaki Nam Định cao cấp phối phản quang',
    seller_name: 'BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG',
    category: 'Thời trang & Giày dép',
    price: 185000,
    condition: 'Mới 100%',
    location: 'Ninh Bình & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Sản phẩm chính hãng sản xuất trực tiếp bởi xưởng BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG (Ninh Bình).\n- Chất liệu vải Kaki Nam Định 65/35 dày dặn, không bai xù, không phai màu, thấm hút mồ hôi tối đa khi làm việc nặng nhọc ngoài trời hoặc trong nhà xưởng.\n- Thiết kế cúc bấm cài chắc chắn, 2 túi ngực tiện dụng đựng bút thước điện thoại, may phối dải phản quang an toàn ban đêm.\n- Đủ size từ S đến 3XL cho cân nặng từ 45kg đến 90kg. Nhận đặt may in thêu logo doanh nghiệp theo yêu cầu.`
  },
  {
    index: 14,
    title: '[Toàn Hương Mall] Giày bảo hộ lao động mũi thép đế thép chống đinh chống dập ngón chịu lực 200J',
    seller_name: 'BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG',
    category: 'Thời trang & Giày dép',
    price: 220000,
    condition: 'Mới 100%',
    location: 'Ninh Bình & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Giày bảo hộ kỹ sư và công nhân công trình phân phối bởi BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG.\n- Mũi lót thép carbon chịu lực va đập tới 200 Joules chống dập ngón chân khi gạch đá vật nặng rơi rớt.\n- Đế giày cao su đúc nguyên khối chèn tấm lót thép chống đinh, sắt nhọn đâm xuyên, chống trơn trượt dầu mỡ tiêu chuẩn S3.\n- Thân giày da PU nhân tạo thoáng khí, lót giày eva êm ái giảm chấn gót chân khi đi lại cả ngày.`
  },
  {
    index: 15,
    title: '[Toàn Hương Mall] Mũ bảo hộ lao động công trình có núm vặn điều chỉnh kèm quai cài cằm êm ái',
    seller_name: 'BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG',
    category: 'Thời trang & Giày dép',
    price: 65000,
    condition: 'Mới 100%',
    location: 'Ninh Bình & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Nón bảo hộ lao động kỹ sư công trình tiêu chuẩn TCVN 6407:1998 của BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG.\n- Vỏ mũ đúc từ nhựa HDPE nguyên sinh độ bền va đập cao, chịu tải trọng lớn, cách điện tốt.\n- Lồng mũ 6 điểm giảm chấn có núm vặn phía sau gáy dễ dàng điều chỉnh ôm khít vòng đầu từ 52cm đến 64cm.\n- Quai cài cằm bằng sợi polyester co giãn có miếng đệm cằm êm ái giữ mũ vững vàng khi cúi hoặc làm việc trên cao.`
  },
  {
    index: 16,
    title: '[Toàn Hương Mall] Lốc 10 đôi găng tay bảo hộ sợi len phủ sơn cao su đỏ chống trơn trượt chống cắt',
    seller_name: 'BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG',
    category: 'Dụng cụ & Thiết bị',
    price: 75000,
    condition: 'Mới 100%',
    location: 'Ninh Bình & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Combo 10 đôi găng tay phủ cao su đỏ phân phối chính hãng bởi BẢO HỘ LAO ĐỘNG TOÀN HƯƠNG.\n- Dệt từ sợi len cotton kim 10 thoáng mát, co giãn ôm sát bàn tay không gây bí rít.\n- Lòng bàn tay và các đầu ngón tay phủ lớp cao su tự nhiên vân nhám chống trơn trượt tuyệt vời khi bốc vác, cầm nắm kim loại dầu mỡ, kính xây dựng.\n- Chống mài mòn, chống cắt nhẹ bảo vệ đôi tay người lao động an toàn tuyệt đối.`
  },
  {
    index: 17,
    title: 'Cáp sạc nhanh 3 trong 1 Type-C, Lightning, Micro-USB dây dù chống đứt bọc hợp kim 1.2m',
    seller_name: 'Phụ Kiện Số Chính Hãng',
    category: 'Đồ điện tử & Công nghệ',
    price: 49000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Cáp sạc đa năng 3 đầu thế hệ mới giải quyết mọi nhu cầu sạc thiết bị điện thoại.\n- Tích hợp 3 cổng: Type-C (hỗ trợ sạc nhanh), Lightning (iPhone/iPad) và Micro-USB.\n- Lõi đồng nguyên chất dẫn điện nhanh, ổn định dòng điện không gây nóng máy chai pin.\n- Vỏ ngoài bọc sợi dù bện đan chéo chịu lực kéo trên 50kg, đầu cắm bọc hợp kim nhôm chống oxy hóa.`
  },
  {
    index: 18,
    title: 'Máy hút bụi cầm tay mini không dây lực hút siêu mạnh 12000Pa pin sạc cho ô tô và phòng ngủ',
    seller_name: 'Smart Clean Living',
    category: 'Đồ gia dụng & Bếp',
    price: 219000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Máy hút bụi không dây mini công nghệ lốc xoáy Cyclone thế hệ mới.\n- Động cơ không chổi than công suất cao tạo lực hút chân không lên tới 12000Pa hút sạch bụi bẩn, vụn bánh, lông thú cưng và tàn thuốc.\n- Bộ lọc HEPA đa tầng lọc sạch 99.9% bụi mịn, có thể rửa sạch bằng nước và tái sử dụng.\n- Pin lithium 4000mAh hoạt động liên tục 25-30 phút, kèm 3 đầu hút chuyên dụng cho khe hẹp và bề mặt nỉ sofa.`
  },
  {
    index: 19,
    title: 'Ổ cắm điện đa năng thông minh chống giật 6 cổng cắm kèm 3 cổng sạc USB dây dài 2m',
    seller_name: 'Thiết Bị Điện Thông Minh',
    category: 'Đồ điện tử & Công nghệ',
    price: 99000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Ổ cắm điện đa năng cao cấp bảo vệ an toàn cho cả gia đình.\n- Vỏ nhựa PC chống cháy chịu nhiệt lên tới 750°C, chân cắm có nắp che an toàn trẻ em chống giật.\n- Tích hợp 6 ổ cắm chân cắm quốc tế cắm vừa mọi loại phích cắm 2 chấu và 3 chấu.\n- Thêm 3 cổng sạc USB thông minh tự nhận diện dòng điện, nút công tắc tổng có đèn báo tiện lợi.`
  },
  {
    index: 20,
    title: 'Cân tiểu ly điện tử nhà bếp độ chính xác cao từ 0.1g đến 5kg màn hình LED sắc nét',
    seller_name: 'Dụng Cụ Làm Bánh & Nhà Bếp',
    category: 'Đồ gia dụng & Bếp',
    price: 85000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Cân điện tử nhà bếp chuyên dụng cho gia đình, làm bánh, cân thực phẩm ăn kiêng, cân bột sữa.\n- Cảm biến lực 4 điểm siêu nhạy cho độ chính xác đến từng 0.1 gram, tải trọng tối đa 5kg.\n- Tính năng trừ bì Tare thông minh giúp cân chính xác nguyên liệu mà không cần tính trọng lượng khay đựng.\n- Màn hình LED kỹ thuật số có đèn nền dễ đọc, tự động ngắt điện sau 60 giây không sử dụng để tiết kiệm pin.`
  },
  {
    index: 21,
    title: '[ROBOT Mall] Tai nghe Bluetooth True Wireless ROBOT Earphone không dây pin trâu 25H âm bass cực đã',
    seller_name: 'ROBOT Official Store',
    category: 'Đồ điện tử & Công nghệ',
    price: 199000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc (Mall)',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    ],
    description: `100% Chính hãng ROBOT phân phối trên Shopee Mall, bảo hành 12 tháng đổi mới.\n- Chuẩn kết nối Bluetooth 5.3 hiện đại kết nối ổn định trong phạm vi 10m, độ trễ cực thấp xem phim chơi game mượt mà.\n- Driver dynamic 13mm cho âm bass mạnh mẽ, dải trung và cao trong trẻo.\n- Thời lượng pin tai nghe 6 giờ liên tục, dock sạc nâng tổng thời gian sử dụng lên đến 25 giờ, có mic đàm thoại khử ồn ENC.`
  },
  {
    index: 22,
    title: 'Máy đo huyết áp bắp tay điện tử tự động màn hình LCD lớn đọc giọng nói tiếng Việt chuẩn xác',
    seller_name: 'Thiết Bị Y Tế Gia Đình',
    category: 'Đồ điện tử & Công nghệ',
    price: 295000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Máy đo huyết áp và nhịp tim bắp tay điện tử thông minh cho người lớn tuổi.\n- Công nghệ đo dao động quang học tự động bơm xả êm ái, độ chính xác chuẩn quốc tế WHO.\n- Đọc kết quả bằng giọng nói tiếng Việt to rõ, màn hình LCD đèn nền lớn hiển thị huyết áp tâm thu, tâm trương và nhịp tim.\n- Bộ nhớ lưu trữ 99 kết quả đo của 2 người dùng giúp theo dõi sức khỏe dài hạn.`
  },
  {
    index: 23,
    title: 'Dây cáp sạc nhanh Type-C to Type-C 100W PD bọc dù chống gập gãy sạc Laptop và Điện thoại',
    seller_name: 'Cáp Sạc Công Nghệ Cao',
    category: 'Đồ điện tử & Công nghệ',
    price: 75000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Cáp sạc siêu nhanh công suất 100W Power Delivery chuẩn E-Marker thông minh.\n- Hỗ trợ sạc nhanh cho MacBook, Laptop Dell/HP/Asus, iPad Pro và các dòng điện thoại Samsung, Xiaomi, iPhone 15/16.\n- Tốc độ truyền tải dữ liệu 480Mbps truyền file 1GB chỉ trong 30 giây.\n- Vỏ bọc nylon bện mật độ cao trải qua thử nghiệm uốn cong hơn 20.000 lần không lo gãy gập đứt ngầm.`
  },
  {
    index: 24,
    title: 'Quạt tích điện mini để bàn chân kẹp xoay 720 độ pin sạc 10000mAh chạy êm ái 4 tốc độ gió',
    seller_name: 'Điện Gia Dụng Mùa Hè',
    category: 'Đồ gia dụng & Bếp',
    price: 145000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1618944847823-74a00889fb36?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Quạt kẹp tích điện đa năng để bàn làm việc, kẹp nôi em bé, mang đi cắm trại du lịch.\n- Động cơ không chổi than hoạt động êm ái không gây ồn ào ảnh hưởng giấc ngủ trẻ nhỏ.\n- Pin sạc dung lượng lớn 10000mAh cho thời gian sử dụng liên tục từ 8 đến 24 tiếng tùy cấp độ gió.\n- Lồng quạt xoay 360 độ ngang và 360 độ dọc làm mát mọi góc độ, chân kẹp lò xo cứng cáp bám chặt cạnh bàn.`
  },
  {
    index: 25,
    title: 'Bình xịt chống thấm dột công nghệ Nhật Bản đa năng vá nứt trần nhà tường gạch mái tôn 450ml',
    seller_name: 'Vật Liệu Xây Dựng Tiện Ích',
    category: 'Dụng cụ & Thiết bị',
    price: 69000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Chai xịt chống thấm bọt cao su polyme công nghệ đột phá Nhật Bản.\n- Bịt kín tức thì các vết nứt tường nứt trần, mối nối ống nước rò rỉ, đinh vít mái tôn bị dột nước.\n- Chịu được nhiệt độ cao nắng mưa khắc nghiệt ngoài trời, không bị giòn gãy hay chảy keo.\n- Độ bám dính siêu chắc trên bê tông, kim loại, nhựa PVC, gạch men.`
  },
  {
    index: 26,
    title: 'Bơm lốp ô tô xe máy điện tử tự ngắt không dây mini tích hợp đèn pin cứu hộ SOS',
    seller_name: 'Phụ Kiện Ô Tô Xe Máy',
    category: 'Xe cộ & Phụ tùng',
    price: 285000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Máy bơm lốp cầm tay thông minh không dây chạy pin sạc cao cấp.\n- Áp suất bơm tối đa 150 PSI, cài đặt trước áp suất lốp tiêu chuẩn và tự động ngắt khi đủ áp suất, chống nổ lốp.\n- Màn hình kỹ thuật số hiển thị áp suất lốp thời gian thực 4 đơn vị đo (PSI, BAR, KPA, Kg/cm²).\n- Tích hợp đèn LED chiếu sáng ban đêm và đèn nhấp nháy đỏ SOS khẩn cấp, bơm được cho ô tô 4-7 chỗ, xe máy, xe đạp và bóng đá.`
  },
  {
    index: 27,
    title: '[Coolmate Mall] Combo 3 Quần lót nam Trunk sợi tre tự nhiên Bamboo kháng khuẩn êm ái không đường may',
    seller_name: 'Coolmate Official Store',
    category: 'Thời trang & Giày dép',
    price: 189000,
    condition: 'Mới 100%',
    location: 'Hà Nội & TP. HCM (Shopee Mall)',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Sản phẩm best-seller chính hãng từ Coolmate Official Store trên Shopee Mall.\n- 95% sợi tre Bamboo tự nhiên kết hợp 5% Spandex co giãn 4 chiều mềm mịn như mây.\n- Khả năng kháng khuẩn khử mùi tự nhiên, thoáng khí gấp 3 lần cotton thông thường.\n- Đai lưng dệt bản mềm không hằn cấn da bụng, đường may phẳng phẳng không ma sát mang lại cảm giác thoải mái cả ngày dài.`
  },
  {
    index: 28,
    title: 'Máy xay tỏi ớt hoa quả mini cầm tay sạc điện 3 lưỡi dao thép inox 304 tiện lợi',
    seller_name: 'Đồ Dùng Bếp Thông Minh',
    category: 'Đồ gia dụng & Bếp',
    price: 89000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Máy xay tỏi ớt gia vị đa năng mini sạc USB tiện lợi.\n- Cối xay dung tích 250ml nhựa thực phẩm an toàn không chứa BPA độc hại.\n- 3 lưỡi dao xếp tầng bằng inox 304 sắc bén quay tốc độ cao xay nhuyễn tỏi, ớt, gừng, thịt băm, nấm chỉ trong 10 giây.\n- Tháo lắp cối và lưỡi dao rửa sạch trực tiếp dưới vòi nước, pin sạc 1 lần dùng cả tháng.`
  },
  {
    index: 29,
    title: 'Đèn bàn học LED chống cận thị bảo vệ mắt 3 chế độ sáng cảm ứng pin sạc tiện lợi',
    seller_name: 'Đèn Trang Trí & Chiếu Sáng',
    category: 'Đồ gia dụng & Bếp',
    price: 115000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Đèn LED để bàn học sinh và làm việc công nghệ lọc ánh sáng xanh bảo vệ thị lực.\n- Tích hợp 3 tông màu ánh sáng: Vàng ấm thư giãn, Trắng tự nhiên đọc sách và Trắng sáng làm việc tập trung.\n- Nút chạm cảm ứng một chạm điều chỉnh màu và nhấn giữ để tăng giảm độ sáng linh hoạt.\n- Cần đèn silicon dẻo xoay gập 360 độ tùy chỉnh góc chiếu, pin sạc dự phòng dùng khi cúp điện.`
  },
  {
    index: 30,
    title: 'Nồi lẩu điện mini đa năng 2 tầng kèm xửng hấp chống dính size 18cm nấu ăn nhanh cho 1-2 người',
    seller_name: 'Gia Dụng Bếp Sinh Viên',
    category: 'Đồ gia dụng & Bếp',
    price: 139000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Nồi nấu mini đa năng tiện ích 2 trong 1: vừa nấu lẩu nấu mì vừa hấp bánh bao rau củ.\n- Lòng nồi tráng lớp men gốm ceramic chống dính thức ăn cao cấp, chiên xào không lo cháy dính, dễ lau rửa.\n- Công suất 600W làm nóng nhanh đều, 2 mức chỉnh nhiệt lớn nhỏ phù hợp mọi món ăn.\n- Tay cầm dài cách nhiệt chống bỏng, kèm xửng hấp inox hoặc nhựa PP an toàn chịu nhiệt.`
  },
  {
    index: 31,
    title: 'Đồng hồ thông minh Smartwatch theo dõi sức khỏe nhịp tim huyết áp kết nối Bluetooth nghe gọi',
    seller_name: 'Công Nghệ Số SmartWear',
    category: 'Đồ điện tử & Công nghệ',
    price: 320000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Đồng hồ thông minh màn hình tràn viền HD 1.9 inch độ phân giải cao sắc nét.\n- Kết nối Bluetooth trực tiếp với iPhone và Android nhận cuộc gọi nghe nói hai chiều, nhận thông báo tin nhắn Zalo, Facebook, SMS.\n- Cảm biến sinh học đo nhịp tim liên tục, nồng độ oxy trong máu SpO2, theo dõi chất lượng giấc ngủ và đếm bước chân calo tiêu hao.\n- Kháng nước chuẩn IP67, thời lượng pin 5-7 ngày dùng thoải mái.`
  },
  {
    index: 32,
    title: 'Củ sạc nhanh GaN 35W 2 cổng Type-C và USB hỗ trợ sạc nhanh chuẩn PD QC 3.0',
    seller_name: 'Thiết Bị Sạc Nhanh GaN',
    category: 'Đồ điện tử & Công nghệ',
    price: 129000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Củ sạc công nghệ bán dẫn GaN (Gallium Nitride) thế hệ mới kích thước siêu nhỏ gọn.\n- Công suất sạc nhanh tối đa 35W sạc 60% pin iPhone chỉ trong 30 phút mà máy vẫn mát rượi.\n- 2 cổng sạc đồng thời: Type-C PD và USB Quick Charge 3.0 tiện lợi sạc cùng lúc 2 thiết bị.\n- Chip điều khiển thông minh tự cân đối dòng điện, bảo vệ quá dòng quá áp quá nhiệt chống cháy nổ.`
  },
  {
    index: 33,
    title: 'Giá đỡ điện thoại xe máy hợp kim nhôm CNC chống rung lắc xoay 360 độ gắn chân gương',
    seller_name: 'Phụ Kiện Xe Máy Phượt',
    category: 'Xe cộ & Phụ tùng',
    price: 85000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Giá kẹp điện thoại xe máy đúc hợp kim nhôm nguyên khối cho anh em chạy xe công nghệ và đi phượt.\n- Khóa siết vít ốc xoay cơ học chắc chắn kẹp cứng điện thoại không bao giờ rơi rớt kể cả khi đi vào đường gập ghềnh ổ gà.\n- Miếng lót silicon chống trầy xước viền máy và giảm rung chấn bảo vệ camera điện thoại.\n- Xoay 360 độ linh hoạt xem bản đồ Google Maps ngang hoặc dọc tiện lợi.`
  },
  {
    index: 34,
    title: 'Bộ lau nhà thông minh tự vắt xoay 360 độ kèm thùng giặt 2 ngăn và 2 bông lau vi sợi microfiber',
    seller_name: 'Gia Dụng Tiện Ích Thông Minh',
    category: 'Đồ gia dụng & Bếp',
    price: 175000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Cây lau nhà tự vắt thông minh thế hệ mới giải phóng sức lao động phụ nữ.\n- Thùng chứa nước chia 2 ngăn riêng biệt: 1 ngăn giặt sạch mớ và 1 ngăn vắt khô ráo chỉ với thao tác đẩy kéo nhẹ nhàng.\n- Bàn lau chữ nhật xoay 360 độ luồn lách dễ dàng vào gầm giường, gầm sofa, khe tủ hẹp.\n- Tặng kèm 2 miếng bông lau vi sợi microfiber thấm hút nước cực tốt, cuốn sạch tóc và bụi bẩn.`
  },
  {
    index: 35,
    title: 'Gối tựa lưng công thái học memory foam cao cấp chống đau mỏi cột sống văn phòng và lái xe ô tô',
    seller_name: 'Chăm Sóc Cột Sống & Sức Khỏe',
    category: 'Đồ gia dụng & Bếp',
    price: 159000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Gối đệm tựa lưng thiết kế đường cong công thái học chuẩn giải phẫu cột sống thắt lưng.\n- Lõi đệm cao su non memory foam đàn hồi chậm hấp thụ áp lực, nâng đỡ tối đa vùng thắt lưng L1-L5 chống thoái hóa gù lưng.\n- Vỏ bọc vải lưới 3D tổ ong thoáng khí không bí mồ hôi, có khóa kéo tháo rời giặt sạch dễ dàng.\n- Dây đai co giãn gắn chắc chắn vào ghế xoay văn phòng hoặc ghế ô tô.`
  },
  {
    index: 36,
    title: 'Máy tạo ẩm khuếch tán tinh dầu hình ngọn lửa phun sương siêu âm có đèn LED ngủ thư giãn',
    seller_name: 'Decor Thư Giãn Phòng Ngủ',
    category: 'Đồ gia dụng & Bếp',
    price: 189000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Máy xông tinh dầu tạo độ ẩm ngọn lửa hiệu ứng ánh sáng 3D huyền ảo lung linh.\n- Công nghệ sóng siêu âm phân tách nước và tinh dầu thành hàng triệu hạt sương siêu mịn bù ẩm cho phòng điều hòa khô da.\n- Tạo hương thơm thư giãn giảm căng thẳng mệt mỏi sau ngày dài làm việc, đuổi muỗi và khử mùi phòng ngủ.\n- Dung tích bình 200ml tự ngắt nguồn an toàn khi hết nước, độ ồn dưới 25dB siêu êm ái.`
  },
  {
    index: 37,
    title: 'Túi đeo chéo nam chống nước cao cấp nhiều ngăn tiện dụng thời trang phong cách Hàn Quốc',
    seller_name: 'Thời Trang Phụ Kiện Nam',
    category: 'Thời trang & Giày dép',
    price: 119000,
    condition: 'Mới 100%',
    location: 'Hà Nội & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Túi bao tử đeo chéo nam thể thao cá tính chống thấm nước Oxford cao cấp.\n- Kích thước vừa vặn đựng thoải mái iPad mini, điện thoại, ví tiền, chìa khóa, sạc dự phòng và tai nghe.\n- Khóa kéo kim loại trơn tru độ bền cao, dây đeo dệt sợi nylon chịu tải lớn điều chỉnh độ dài linh hoạt.\n- Có cổng luồn dây tai nghe và dây sạc điện thoại tiện lợi khi di chuyển ngoài đường.`
  },
  {
    index: 38,
    title: 'Bộ máy tỉa lông mũi và cạo râu đa năng 4 trong 1 sạc USB chống nước vệ sinh dễ dàng',
    seller_name: 'Chăm Sóc Cá Nhân Nam Giới',
    category: 'Thời trang & Giày dép',
    price: 95000,
    condition: 'Mới 100%',
    location: 'TP. Hồ Chí Minh & Toàn Quốc',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'
    ],
    description: `Bộ tông đơ tỉa lông mũi và cạo râu 4 đầu thay thế tiện dụng cho phái mạnh.\n- Lưỡi dao xoay 360 độ bằng thép không gỉ cắt tỉa lông mũi gọn gàng êm ái không kéo giật đau rát.\n- Kèm 4 đầu cạo đa năng: đầu tỉa lông mũi tai, đầu cạo râu mini, đầu tỉa lông mày và đầu tông đơ tóc mai tạo kiểu.\n- Sạc pin qua cổng USB tiện lợi, đầu dao có thể tháo rời rửa sạch bằng nước sau khi dùng.`
  }
];

// Map each of the 38 resolved links
const completeProducts = productCatalog.map((item, idx) => {
  const linkInfo = resolvedLinks[idx];
  const shortlink = linkInfo.shortlink;
  const isPinned = item.index === 1 || item.index === 4 || item.index === 5 || item.index === 13;

  return {
    id: `prod_shopee_${item.index}`,
    user_id: 'user_admin',
    seller_name: item.seller_name,
    seller_phone: '0961513578',
    seller_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: item.title,
    description: item.description,
    category: item.category,
    price: item.price,
    condition: item.condition,
    location: item.location,
    images: item.images,
    contact_phone: '0961513578',
    status: 'approved',
    shopee_affiliate_url: shortlink,
    shopee_button_label: 'Mua Ngay trên Shopee Mall',
    is_affiliate_active: true,
    is_shopee_direct: true,
    is_pinned: isPinned,
    pinned_until: isPinned ? '2026-11-23T00:00:00Z' : undefined,
    pin_package: isPinned ? '30_days' : undefined,
    pinned_at: isPinned ? '2026-10-23T00:00:00Z' : undefined,
    shopee_sub_url: '',
    shopee_sub_label: '',
    views_count: 240 + item.index * 17,
    affiliate_clicks_count: 52 + item.index * 6,
    created_at: new Date(Date.now() - (38 - item.index) * 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  };
});

// Update data/database.json
const dbFile = 'data/database.json';
let dbData = { products: [], users: [], conversations: [], supportMessages: [], zaloNotifications: [] };
if (fs.existsSync(dbFile)) {
  try {
    dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (e) {
    console.error('Error reading dbFile:', e);
  }
}
dbData.products = completeProducts;
fs.writeFileSync(dbFile, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Successfully saved 38 products to data/database.json!');

// Count per category
const counts = { all: completeProducts.length };
completeProducts.forEach(p => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Category counts:', counts);
