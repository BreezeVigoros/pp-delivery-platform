import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../api/client';

interface AppState {
  inventory: any[]; receipts: any[]; deliveries: any[];
  quality: any[]; finance: any[]; stats: any; loading: boolean; error: string | null;
}

const AppContext = createContext<{
  state: AppState;
  refresh: () => void;
  addInventory: (data: any) => Promise<void>;
  outboundInventory: (id: string, qty: number) => Promise<void>;
  addReceipt: (data: any) => Promise<void>;
} | null>(null);

const statsData = {
  totalInventory: 12700, activeReceipts: 7, pendingReceipts: 3,
  completedDeliveries: 2, deliveryTotal: 1100, qcRate: '75.0', capacityRate: '63.5',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    inventory: [], receipts: [], deliveries: [],
    quality: [], finance: [], stats: statsData, loading: true, error: null,
  });

  const refresh = useCallback(async () => {
    // 未登录时不请求 API，避免 401 循环
    if (!api.getToken()) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [inventory, receipts, deliveries, quality, finance] = await Promise.all([
        api.getInventory().catch(() => []),
        api.getReceipts().catch(() => []),
        api.getDeliveries().catch(() => []),
        api.getQuality().catch(() => []),
        api.getFinance().catch(() => []),
      ]);
      setState({
        inventory, receipts, deliveries, quality, finance,
        stats: statsData, loading: false, error: null,
      });
    } catch (err: any) {
      console.warn('API 连接失败:', err.message);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const addInventory = async (data: any) => {
    await api.addInventory(data);
    await refresh();
  };

  const outboundInventory = async (id: string, qty: number) => {
    await api.outboundInventory(id, qty);
    await refresh();
  };

  const addReceipt = async (data: any) => {
    await api.addReceipt(data);
    await refresh();
  };

  // 首次加载
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AppContext.Provider value={{ state, refresh, addInventory, outboundInventory, addReceipt }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
