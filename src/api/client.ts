// API 客户端 —— 统一封装fetch请求
const API_BASE = '/api';

let authToken = localStorage.getItem('token') || '';

export function setToken(token: string) {
  authToken = token;
  localStorage.setItem('token', token);
}

export function getToken(): string {
  return authToken;
}

export function clearToken() {
  authToken = '';
  localStorage.removeItem('token');
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new Error('未登录');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// --- 认证 ---
export function login(username: string, password: string) {
  return request<{ token: string; user: { id: number; username: string; role: string } }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// --- 库存 ---
export function getInventory() {
  return request<any[]>('/inventory');
}

export function addInventory(data: any) {
  return request<any>('/inventory', { method: 'POST', body: JSON.stringify(data) });
}

export function outboundInventory(id: string, quantity: number) {
  return request<any>(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
}

// --- 仓单 ---
export function getReceipts() {
  return request<any[]>('/receipts');
}

export function addReceipt(data: any) {
  return request<any>('/receipts', { method: 'POST', body: JSON.stringify(data) });
}

// --- 交割 ---
export function getDeliveries() {
  return request<any[]>('/deliveries');
}

// --- 质检 ---
export function getQuality() {
  return request<any[]>('/quality');
}

// --- 财务 ---
export function getFinance() {
  return request<any[]>('/finance');
}

// --- 报表 ---
export function getStats() {
  return request<any>('/reports/stats');
}
