import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Dropdown, theme, Spin } from 'antd';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAppContext } from '../contexts/AppContext';
import {
  DashboardOutlined, InboxOutlined, FileProtectOutlined,
  SwapOutlined, SafetyCertificateOutlined, AccountBookOutlined,
  BarChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  UserOutlined, LogoutOutlined, SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/inventory', icon: <InboxOutlined />, label: '库存管理' },
  { key: '/receipts', icon: <FileProtectOutlined />, label: '仓单管理' },
  { key: '/delivery', icon: <SwapOutlined />, label: '交割管理' },
  { key: '/quality', icon: <SafetyCertificateOutlined />, label: '质检管理' },
  { key: '/finance', icon: <AccountBookOutlined />, label: '财务管理' },
  { key: '/reports', icon: <BarChartOutlined />, label: '报表中心' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const selectedKey = '/' + location.pathname.split('/')[1];

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
      { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: '0 16px',
        }}>
          {collapsed ? (
            <Text strong style={{ fontSize: 18, color: token.colorPrimary }}>PP</Text>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: 15, color: token.colorPrimary }}>
                温州PP交割仓
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>智能管理平台</Text>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey === '/' ? '/' : selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: token.colorBgContainer,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          height: 64,
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text type="secondary">温州苍南·平阳 PP期货指定交割库</Text>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
                <Text>管理员</Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{
          margin: 16, padding: 24, background: token.colorBgContainer,
          borderRadius: 8, overflow: 'auto', maxHeight: 'calc(100vh - 96px)',
        }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}
