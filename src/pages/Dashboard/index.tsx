import { Row, Col, Card, Table, Tag, List, Alert, Typography, Spin } from 'antd';
import {
  InboxOutlined, FileProtectOutlined, SwapOutlined,
  SafetyCertificateOutlined, ArrowUpOutlined, ArrowDownOutlined,
  WarningOutlined, BellOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import KpiCard from '../../components/KpiCard';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../contexts/AppContext';
import { formatNumber, formatTons } from '../../utils/format';

const { Text, Title } = Typography;

export default function Dashboard() {
  const { state } = useAppContext();
  const { inventory, receipts, deliveries, stats, loading } = state;
  const s = stats || {};

  // 库存趋势图配置
  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库', '库存'], bottom: 0 },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: ['6/15', '6/18', '6/21', '6/24', '6/27', '6/30', '7/3', '7/6', '7/9', '7/12'] },
    yAxis: { type: 'value', name: '吨' },
    series: [
      { name: '入库', type: 'bar', data: [1500, 1200, 2000, 0, 800, 1000, 2650, 300, 1800, 500], itemStyle: { color: '#52c41a' } },
      { name: '出库', type: 'bar', data: [0, 0, 200, 0, 150, 0, 500, 300, 100, 400], itemStyle: { color: '#ff4d4f' } },
      { name: '库存', type: 'line', data: [1500, 2700, 4500, 4500, 5150, 6150, 8300, 8300, 10000, 10100], smooth: true, itemStyle: { color: '#1677ff' }, lineStyle: { width: 3 } },
    ],
  };

  // 仓单状态分布
  const receiptPieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '45%'],
      label: { formatter: '{b}\n{d}%' },
      data: [
        { value: receipts.filter(r => r.status === '已注册').length, name: '已注册', itemStyle: { color: '#52c41a' } },
        { value: receipts.filter(r => r.status === '已质押').length, name: '已质押', itemStyle: { color: '#1677ff' } },
        { value: receipts.filter(r => r.status === '交割中').length, name: '交割中', itemStyle: { color: '#fa8c16' } },
        { value: receipts.filter(r => r.status === '已注销').length, name: '已注销', itemStyle: { color: '#d9d9d9' } },
      ].filter(d => d.value > 0),
    }],
  };

  // 待办事项
  const todos = [
    { type: 'warning', text: '批次20260701-F401-01待完成质检（S1003，450吨）', time: '2026-07-01' },
    { type: 'warning', text: '批次20260705-L5E89-02待完成质检（L5E89，350吨）', time: '2026-07-05' },
    { type: 'info', text: '库存INV20260704待注册仓单（T30S，800吨）', time: '2026-06-22' },
    { type: 'info', text: '库存INV20260709待注册仓单（L5E89，350吨）', time: '2026-07-05' },
    { type: 'info', text: '库存INV20260712待注册仓单（T30S，500吨）', time: '2026-07-10' },
    { type: 'danger', text: '仓单DCE-WZ-20260043质押中，关注融资到期', time: '2026-07-02' },
  ];

  // 最近出入库
  const recentColumns = [
    { title: '类型', dataIndex: 'type', width: 60, render: (t: string) => <Tag color={t === '入库' ? 'green' : 'red'}>{t}</Tag> },
    { title: '牌号', dataIndex: 'gradeCode', width: 80 },
    { title: '数量(吨)', dataIndex: 'quantity', width: 80, render: (v: number) => formatNumber(v) },
    { title: '车号/客户', dataIndex: 'info', ellipsis: true },
    { title: '日期', dataIndex: 'date', width: 90 },
  ];

  const recentData = [
    ...inventory.slice(-5).map((r: any) => ({ key: r.id, type: '入库', gradeCode: r.gradeCode, quantity: r.quantity, info: r.producer, date: r.inboundDate })),
    ...inventory.slice(0, 3).map((r: any) => ({ key: r.id + 'out', type: '出库', gradeCode: r.gradeCode, quantity: Math.floor(r.quantity * 0.1), info: '塑编企业', date: '2026-07-12' })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  if (loading && inventory.length === 0) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="加载中..." /></div>;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>工作台</Title>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard title="库存总量" value={formatTons(s.totalInventory || 0)}
          prefix={<InboxOutlined />}
          extra={<Text type="secondary">库容利用率 <Text strong style={{ color: parseFloat(s.capacityRate) > 80 ? '#ff4d4f' : '#52c41a' }}>{s.capacityRate || '0'}%</Text></Text>}
        />
        <KpiCard title="仓单注册量" value={s.activeReceipts || 0}
          prefix={<FileProtectOutlined />} suffix="张"
          extra={<Text type="secondary">待注册 <Text strong>{s.pendingReceipts || 0}</Text> 张</Text>}
        />
        <KpiCard title="本月交割量" value={formatTons(s.deliveryTotal || 0)}
          prefix={<SwapOutlined />}
          extra={<Text type="secondary">已完成 <Text strong>{s.completedDeliveries || 0}</Text> 笔</Text>}
        />
        <KpiCard title="质检合格率" value={s.qcRate || '0'}
          prefix={<SafetyCertificateOutlined />} suffix="%"
          valueStyle={{ color: '#52c41a' }}
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <Card title="库存趋势（近30天）" style={{ borderRadius: 8 }}>
          <ReactECharts option={trendOption} style={{ height: 320 }} />
        </Card>
        <Card title="仓单状态分布" style={{ borderRadius: 8 }}>
          <ReactECharts option={receiptPieOption} style={{ height: 320 }} />
        </Card>
      </div>

      {/* Bottom */}
      <div className="bottom-grid">
        {/* 待办事项 */}
        <Card title={<span><BellOutlined /> 待办事项</span>} style={{ borderRadius: 8 }}>
          <List size="small" dataSource={todos} renderItem={item => (
            <List.Item>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                {item.type === 'warning' ? <WarningOutlined style={{ color: '#fa8c16' }} /> :
                 item.type === 'danger' ? <WarningOutlined style={{ color: '#ff4d4f' }} /> :
                 <CheckCircleOutlined style={{ color: '#1677ff' }} />}
                <Text style={{ flex: 1 }}>{item.text}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
              </div>
            </List.Item>
          )} />
        </Card>

        {/* 最近出入库 */}
        <Card title="最近出入库记录" style={{ borderRadius: 8 }}>
          <Table columns={recentColumns} dataSource={recentData}
            pagination={false} size="small" scroll={{ y: 260 }}
          />
        </Card>
      </div>

      {/* 预警信息 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Alert message="库容预警：B区已满仓（100%），建议启动C区库容储备。证书到期提醒：地磅检定证书将于2026-08-15到期，请安排年检。" type="warning" showIcon />
        </Col>
      </Row>
    </div>
  );
}
