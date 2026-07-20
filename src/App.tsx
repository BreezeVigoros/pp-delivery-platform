import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import WarehouseReceipt from './pages/WarehouseReceipt';
import Delivery from './pages/Delivery';
import QualityInspection from './pages/QualityInspection';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { AppProvider } from './contexts/AppContext';
import './index.css';

// 读取认证状态
function getAuthStatus(): 'logged-in' | 'checking' {
  return localStorage.getItem('token') ? 'logged-in' : 'checking';
}

export default function App() {
  const authStatus = getAuthStatus();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <AppProvider>
            <Routes>
              {/* 登录页 */}
              <Route path="/login" element={<Login />} />

              {/* 受保护的主布局 */}
              <Route
                path="/"
                element={authStatus === 'logged-in' ? <MainLayout /> : <Navigate to="/login" replace />}
              >
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="receipts" element={<WarehouseReceipt />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="quality" element={<QualityInspection />} />
                <Route path="finance" element={<Finance />} />
                <Route path="reports" element={<Reports />} />
              </Route>

              {/* 未登录时重定向 */}
              <Route path="*" element={<Navigate to={authStatus === 'checking' ? '/login' : '/'} replace />} />
            </Routes>
          </AppProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
