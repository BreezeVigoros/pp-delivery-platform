import { Tag } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, SyncOutlined,
  CloseCircleOutlined, MinusCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label?: string }> = {
  '已注册': { color: 'green', icon: <CheckCircleOutlined /> },
  '合格': { color: 'green', icon: <CheckCircleOutlined /> },
  '已完成': { color: 'green', icon: <CheckCircleOutlined /> },
  '已质押': { color: 'blue', icon: <CheckCircleOutlined /> },
  '交割中': { color: 'blue', icon: <SyncOutlined spin /> },
  '货权转移中': { color: 'blue', icon: <SyncOutlined spin /> },
  '质检中': { color: 'orange', icon: <SyncOutlined spin /> },
  '待检验': { color: 'orange', icon: <ClockCircleOutlined /> },
  '待审核': { color: 'orange', icon: <ClockCircleOutlined /> },
  '待配对': { color: 'default', icon: <ClockCircleOutlined /> },
  '已配对': { color: 'purple', icon: <CheckCircleOutlined /> },
  '异常': { color: 'red', icon: <ExclamationCircleOutlined /> },
  '不合格': { color: 'red', icon: <CloseCircleOutlined /> },
  '已注销': { color: 'default', icon: <MinusCircleOutlined /> },
  '已取消': { color: 'default', icon: <CloseCircleOutlined /> },
  '空闲': { color: 'default', icon: <CheckCircleOutlined /> },
  '部分占用': { color: 'blue', icon: <ClockCircleOutlined /> },
  '满仓': { color: 'red', icon: <ExclamationCircleOutlined /> },
  // English fallbacks from API
  'qualified': { color: 'green', icon: <CheckCircleOutlined />, label: '合格' },
  'pending': { color: 'orange', icon: <ClockCircleOutlined />, label: '待检验' },
  'registered': { color: 'green', icon: <CheckCircleOutlined />, label: '已注册' },
  'pledged': { color: 'blue', icon: <CheckCircleOutlined />, label: '已质押' },
  'delivering': { color: 'blue', icon: <SyncOutlined spin />, label: '交割中' },
  'cancelled': { color: 'default', icon: <MinusCircleOutlined />, label: '已注销' },
  'paired': { color: 'purple', icon: <CheckCircleOutlined />, label: '已配对' },
  'inspecting': { color: 'orange', icon: <SyncOutlined spin />, label: '质检中' },
  'completed': { color: 'green', icon: <CheckCircleOutlined />, label: '已完成' },
  'received': { color: 'green', icon: <CheckCircleOutlined />, label: '已收' },
  'receivable': { color: 'orange', icon: <ClockCircleOutlined />, label: '应收' },
};

export default function StatusTag({ status }: { status: string }) {
  const cfg = statusConfig[status] || { color: 'default', icon: null };
  return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label || status}</Tag>;
}
