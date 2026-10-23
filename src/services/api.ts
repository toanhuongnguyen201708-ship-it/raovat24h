import { Product, User } from '../types';

export async function fetchServerProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch products from server:', err);
    return null;
  }
}

export async function fetchServerUsers(): Promise<User[] | null> {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch users from server:', err);
    return null;
  }
}

export async function apiCreateProduct(product: Product): Promise<boolean> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.ok;
  } catch (err) {
    console.error('apiCreateProduct error:', err);
    return false;
  }
}

export async function apiUpdateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.ok;
  } catch (err) {
    console.error('apiUpdateProduct error:', err);
    return false;
  }
}

export async function apiDeleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('apiDeleteProduct error:', err);
    return false;
  }
}

export async function apiLogin(identifier: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Đăng nhập không thành công' };
    }
    return { success: true, user: data.user };
  } catch (err) {
    console.error('apiLogin error:', err);
    return { success: false, error: 'Không thể kết nối máy chủ' };
  }
}

export async function apiRegister(userData: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Đăng ký không thành công' };
    }
    return { success: true, user: data.user };
  } catch (err) {
    console.error('apiRegister error:', err);
    return { success: false, error: 'Không thể kết nối máy chủ' };
  }
}

export async function apiChangePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Đổi mật khẩu thất bại' };
    }
    return { success: true };
  } catch (err) {
    console.error('apiChangePassword error:', err);
    return { success: false, error: 'Không thể kết nối máy chủ' };
  }
}

export async function apiToggleUserBan(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`/api/users/${userId}/toggle-ban`, {
      method: 'PUT',
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data.user;
  } catch (err) {
    console.error('apiToggleUserBan error:', err);
    return null;
  }
}

export async function apiDeleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    return { success: true };
  } catch (err) {
    console.error('apiDeleteUser error:', err);
    return { success: false, error: 'Không thể kết nối máy chủ' };
  }
}

export async function apiResetData(): Promise<boolean> {
  try {
    const res = await fetch('/api/reset-data', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.error('apiResetData error:', err);
    return false;
  }
}
