import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_USERS } from './src/data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBData {
  products: any[];
  users: any[];
  conversations: any[];
  supportMessages: any[];
  zaloNotifications: any[];
}

function initDB(): DBData {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DBData = JSON.parse(content);
      
      // Ensure admin user credentials are valid and consistent
      const adminIdx = parsed.users.findIndex((u: any) => u.role === 'admin' || u.id === 'user_admin');
      if (adminIdx !== -1) {
        parsed.users[adminIdx].phone = '0961513578';
        parsed.users[adminIdx].email = 'toanhuongnguyen201708@gmail.com';
        parsed.users[adminIdx].password = 'Toanhuong1';
        parsed.users[adminIdx].name = 'Admin';
        parsed.users[adminIdx].status = 'active';
      } else {
        parsed.users.unshift(INITIAL_USERS[0]);
      }
      return parsed;
    } catch (e) {
      console.error('Error reading database.json, initializing fresh store:', e);
    }
  }

  const initialData: DBData = {
    products: INITIAL_PRODUCTS,
    users: INITIAL_USERS,
    conversations: [],
    supportMessages: [],
    zaloNotifications: [],
  };

  saveDB(initialData);
  return initialData;
}

function readDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('readDB error:', err);
  }
  return initDB();
}

function saveDB(data: DBData): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('saveDB error:', err);
  }
}

// Initialize on server start
initDB();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // PRODUCTS API (Shared and Persistent)
  // ==========================================
  app.get('/api/products', (_req, res) => {
    const db = readDB();
    res.json(db.products || []);
  });

  app.post('/api/products', (req, res) => {
    const db = readDB();
    const newProduct = req.body;
    if (!newProduct || !newProduct.title) {
      return res.status(400).json({ error: 'Dữ liệu sản phẩm không hợp lệ' });
    }
    
    // Add to top of list
    db.products = [newProduct, ...(db.products || [])];
    saveDB(db);
    res.json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', (req, res) => {
    const db = readDB();
    const id = req.params.id;
    const updates = req.body;
    const index = db.products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    db.products[index] = {
      ...db.products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDB(db);
    res.json({ success: true, product: db.products[index] });
  });

  app.delete('/api/products/:id', (req, res) => {
    const db = readDB();
    const id = req.params.id;
    const beforeCount = db.products.length;
    db.products = db.products.filter((p: any) => p.id !== id);
    saveDB(db);
    res.json({ success: true, deleted: beforeCount !== db.products.length, id });
  });

  // ==========================================
  // LIVE SHOPEE METADATA EXTRACTOR API
  // ==========================================
  app.post('/api/extract-shopee', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL không hợp lệ' });
      }

      const cleanInput = url.trim();
      const db = readDB();
      const existing = (db.products || []).find((p: any) =>
        p.shopee_affiliate_url && (cleanInput.includes(p.shopee_affiliate_url) || p.shopee_affiliate_url.includes(cleanInput))
      );

      let liveTitle = '';
      let liveImage = '';
      let liveDesc = '';

      try {
        const fetchRes = await fetch(cleanInput, {
          headers: { 'User-Agent': 'Twitterbot/1.0' },
          redirect: 'follow',
        });
        const html = await fetchRes.text();
        const ogTitle = (html.match(/property=["']og:title["'] content=["'](.*?)["']/i) || [])[1];
        const ogImage = (html.match(/property=["']og:image["'] content=["'](.*?)["']/i) || [])[1];
        const ogDesc = (html.match(/property=["']og:description["'] content=["'](.*?)["']/i) || [])[1];

        if (ogTitle) liveTitle = ogTitle.replace(/\| Shopee.*$/, '').trim();
        if (ogImage) liveImage = ogImage.trim();
        if (ogDesc) liveDesc = ogDesc.trim();
      } catch (e: any) {
        console.warn('Live fetch error:', e.message);
      }

      if (existing) {
        return res.json({
          title: liveTitle || existing.title,
          description: existing.description,
          category: existing.category,
          price: existing.price,
          condition: existing.condition,
          location: existing.location,
          images: liveImage ? [liveImage, ...(existing.images || [])] : existing.images,
          seller_name: existing.seller_name,
          contact_phone: existing.contact_phone || '',
          shopee_affiliate_url: existing.shopee_affiliate_url,
          shopee_button_label: existing.shopee_button_label || 'Mua ngay',
        });
      }

      if (liveTitle && liveImage) {
        return res.json({
          title: liveTitle,
          description: liveDesc || `100% Sản phẩm chính hãng phân phối qua Shopee Mall.\n- Tên: ${liveTitle}\n- Tình trạng: Mới 100% nguyên hộp\n- Chính sách: Đổi trả 15 ngày miễn phí`,
          category: 'Đồ gia dụng & Bếp',
          price: 99000,
          condition: 'Mới 100%',
          location: 'Toàn Quốc (Giao Hỏa Tốc)',
          images: [liveImage],
          seller_name: 'Shopee Mall Chính Hãng',
          contact_phone: '0961513578',
          shopee_affiliate_url: cleanInput,
          shopee_button_label: 'Mua ngay',
        });
      }

      return res.status(404).json({ error: 'Không thể trích xuất thông tin từ link này' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Lỗi hệ thống' });
    }
  });

  // ==========================================
  // USERS & AUTH API
  // ==========================================
  app.get('/api/users', (_req, res) => {
    const db = readDB();
    // Return users list
    res.json(db.users || []);
  });

  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ tài khoản và mật khẩu.' });
    }

    const db = readDB();
    const cleanId = String(identifier).trim().toLowerCase();
    const found = db.users.find((u: any) => 
      u.phone.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId ||
      (cleanId === 'admin' && u.role === 'admin')
    );

    if (!found) {
      return res.status(401).json({ error: 'Không tìm thấy tài khoản với Số điện thoại hoặc Email này.' });
    }

    if (found.status === 'banned') {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa do vi phạm chính sách.' });
    }

    const expected = found.password || '123456';
    if (password !== expected) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác. Vui lòng thử lại.' });
    }

    res.json({ success: true, user: found });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu.' });
    }

    const db = readDB();
    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (db.users.some((u: any) => u.phone === cleanPhone)) {
      return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký tài khoản.' });
    }

    if (cleanEmail && db.users.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({ error: 'Email này đã được sử dụng.' });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: password,
      role: 'user',
      status: 'active',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + (db.users.length % 5)}?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB(db);
    res.json({ success: true, user: newUser });
  });

  app.post('/api/auth/change-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const db = readDB();
    const idx = db.users.findIndex((u: any) => u.id === userId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    const user = db.users[idx];
    const expected = user.password || (user.role === 'admin' ? 'Toanhuong1' : '123456');
    if (currentPassword !== expected) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không chính xác' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    db.users[idx].password = newPassword;
    saveDB(db);
    res.json({ success: true });
  });

  app.put('/api/users/:id/toggle-ban', (req, res) => {
    const db = readDB();
    const id = req.params.id;
    const target = db.users.find((u: any) => u.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản người dùng' });
    }
    if (target.role === 'admin' || target.id === 'user_admin') {
      return res.status(403).json({ error: 'Không thể khóa tài khoản Quản trị viên' });
    }

    target.status = target.status === 'active' ? 'banned' : 'active';
    saveDB(db);
    res.json({ success: true, user: target });
  });

  app.delete('/api/users/:id', (req, res) => {
    const db = readDB();
    const id = req.params.id;
    const target = db.users.find((u: any) => u.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản người dùng' });
    }
    if (target.role === 'admin' || target.id === 'user_admin') {
      return res.status(403).json({ error: 'Không thể xóa tài khoản Quản trị viên' });
    }

    db.users = db.users.filter((u: any) => u.id !== id);
    saveDB(db);
    res.json({ success: true });
  });

  app.post('/api/reset-data', (_req, res) => {
    const resetData: DBData = {
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      conversations: [],
      supportMessages: [],
      zaloNotifications: [],
    };
    saveDB(resetData);
    res.json({ success: true });
  });

  // ==========================================
  // VITE DEV SERVER / STATIC PRODUCTION SERVE
  // ==========================================
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chợ Việt 24h Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
