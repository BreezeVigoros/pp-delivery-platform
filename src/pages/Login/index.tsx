import { useState } from 'react';
import { Card, Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import * as api from '../../api/client';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.login(values.username, values.password);
      api.setToken(res.token);
      message.success('登录成功');
      window.location.href = '/';
    } catch (err: any) {
      message.error(err.message || '登录失败，请检查用户名和密码');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    }}>
      <Card style={{ width: 420, borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>PP期货交割仓管理平台</Title>
          <Text type="secondary">温州苍南·平阳 指定交割库</Text>
        </div>

        <Form onFinish={handleLogin} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>默认账号: admin / admin123</Text>
        </div>
      </Card>
    </div>
  );
}
