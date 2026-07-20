import { useState } from 'react';
import { Card, Table, Tag, Typography, Steps, Descriptions, Space, Statistic, Row, Col, Timeline } from 'antd';
import { SwapOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../contexts/AppContext';
import { DELIVERY_FEE_STANDARD } from '../../data/deliveries';
import { formatNumber, formatMoney } from '../../utils/format';
import type { DeliveryRecord } from '../../data/deliveries';

const { Text, Title } = Typography;

export default function Delivery() {
  const { state } = useAppContext();

  const columns: ColumnsType<DeliveryRecord> = [
    { title: '交割编号', dataIndex: 'id', width: 110 },
    { title: '合约', dataIndex: 'contract', width: 80, render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: '牌号', dataIndex: 'gradeCode', width: 80, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '数量(吨)', dataIndex: 'quantity', width: 90, render: (v: number) => formatNumber(v) },
    { title: '卖方', dataIndex: 'seller', width: 140, ellipsis: true },
    { title: '买方', dataIndex: 'buyer', width: 140, ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 100, render: (s: string) => <StatusTag status={s} /> },
    { title: '仓单号', dataIndex: 'receiptId', width: 150, ellipsis: true },
    { title: '交割费(元)', dataIndex: 'deliveryFee', width: 100, render: (v: number) => formatMoney(v) },
    { title: '完成日期', dataIndex: 'completeDate', width: 100, render: (v: string | null) => v || '—' },
  ];

  const completed = state.deliveries.filter(d => d.status === '已完成').length;
  const totalQuantity = state.deliveries.reduce((s, d) => s + d.quantity, 0);
  const totalFee = state.deliveries.reduce((s, d) => s + d.deliveryFee, 0);

  const getStepCurrent = (status: string) => {
    const map: Record<string, number> = { '待配对': 0, '已配对': 1, '质检中': 1, '货权转移中': 2, '已完成': 3 };
    return map[status] ?? 0;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>交割管理</Title>

      {/* 统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="交割总数" value={state.deliveries.length} suffix="笔" prefix={<SwapOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={completed} suffix="笔" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="交割总量" value={formatNumber(totalQuantity)} suffix="吨" /></Card></Col>
        <Col span={6}><Card><Statistic title="交割费用合计" value={formatMoney(totalFee)} /></Card></Col>
      </Row>

      {/* 交割列表 */}
      <Card title="交割记录" style={{ borderRadius: 8, marginBottom: 16 }}>
        <Table columns={columns} dataSource={state.deliveries} rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '0 40px' }}>
                <Steps current={getStepCurrent(record.status)} size="small" items={[
                  { title: '配对', description: record.pairDate || '待配对' },
                  { title: '质检', description: record.inspectionResult || (record.inspectionDate ? '质检中' : '待质检') },
                  { title: '货权转移', description: record.titleTransferDate || '待转移' },
                  { title: '完成', description: record.completeDate || '待完成' },
                ]} />
                {record.remark && <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>备注：{record.remark}</Text>}
              </div>
            ),
            rowExpandable: () => true,
          }}
          scroll={{ x: 1100 }} size="middle"
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条记录` }}
        />
      </Card>

      {/* 费用标准 */}
      <Card title="交割费用标准" style={{ borderRadius: 8 }}>
        <Row gutter={24}>
          <Col span={6}><Statistic title="仓储费" value={DELIVERY_FEE_STANDARD.storageFee} suffix="元/吨/天" /></Col>
          <Col span={6}><Statistic title="仓单注册费" value={DELIVERY_FEE_STANDARD.receiptRegFee} suffix="元/吨" /></Col>
          <Col span={6}><Statistic title="交割服务费" value={DELIVERY_FEE_STANDARD.deliveryServiceFee} suffix="元/吨" /></Col>
          <Col span={6}><Statistic title="质检费" value={DELIVERY_FEE_STANDARD.inspectionFee} suffix="元/批次" /></Col>
        </Row>
      </Card>
    </div>
  );
}
