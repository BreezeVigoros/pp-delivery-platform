import { useState } from 'react';
import { Card, Table, Tag, Typography, Statistic, Row, Col, Tabs, Descriptions } from 'antd';
import { DollarOutlined, AccountBookOutlined, BankOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppContext } from '../../contexts/AppContext';
import { DELIVERY_FEE_STANDARD } from '../../data/deliveries';
import { formatMoney } from '../../utils/format';

interface FinanceRecord {
  id: string; date: string; type: string; customer: string; description: string; amount: number; status: string;
}

const { Text, Title } = Typography;

export default function Finance() {
  const { state } = useAppContext();
  const { finance } = state;
  const [activeTab, setActiveTab] = useState('records');

  const totalRevenue = finance.filter((r: any) => r.status === '已收').reduce((s: number, r: any) => s + r.amount, 0);
  const totalReceivable = finance.filter((r: any) => r.status === '应收').reduce((s: number, r: any) => s + r.amount, 0);
  const totalPending = finance.filter((r: any) => r.status === '待结算').reduce((s: number, r: any) => s + r.amount, 0);

  const columns: ColumnsType<FinanceRecord> = [
    { title: '编号', dataIndex: 'id', width: 90 },
    { title: '日期', dataIndex: 'date', width: 100 },
    { title: '费用类型', dataIndex: 'type', width: 110, render: (v: string) => <Tag color={v === '仓储费' ? 'blue' : v === '交割服务费' ? 'purple' : v === '仓单注册费' ? 'green' : v === '质押监管费' ? 'orange' : 'default'}>{v}</Tag> },
    { title: '客户', dataIndex: 'customer', width: 140, ellipsis: true },
    { title: '说明', dataIndex: 'description', width: 220, ellipsis: true },
    { title: '金额(元)', dataIndex: 'amount', width: 120, render: (v: number) => <Text strong>{formatMoney(v)}</Text>, sorter: (a: FinanceRecord, b: FinanceRecord) => a.amount - b.amount },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => <Tag color={s === '已收' ? 'green' : s === '应收' ? 'orange' : 'blue'}>{s}</Tag> },
  ];

  const settlementColumns = [
    { title: '客户', dataIndex: 'customer' },
    { title: '仓储费(元)', dataIndex: 'storage', render: (v: number) => formatMoney(v) },
    { title: '注册费(元)', dataIndex: 'regFee', render: (v: number) => formatMoney(v) },
    { title: '交割费(元)', dataIndex: 'deliveryFee', render: (v: number) => formatMoney(v) },
    { title: '质押监管费(元)', dataIndex: 'pledgeFee', render: (v: number) => formatMoney(v) },
    { title: '合计(元)', dataIndex: 'total', render: (v: number) => <Text strong>{formatMoney(v)}</Text> },
  ];

  const settlementData = [
    { key: '1', customer: '温州华塑集团', storage: 32400, regFee: 1100, deliveryFee: 16000, pledgeFee: 1100, total: 50600 },
    { key: '2', customer: '福建中景贸易', storage: 27200, regFee: 1400, deliveryFee: 20000, pledgeFee: 0, total: 48600 },
    { key: '3', customer: '苍南塑编一厂', storage: 0, regFee: 600, deliveryFee: 6000, pledgeFee: 600, total: 7200 },
    { key: '4', customer: '台州汽车配件', storage: 1440, regFee: 0, deliveryFee: 12000, pledgeFee: 0, total: 13440 },
    { key: '5', customer: '齐鲁石化销售', storage: 3200, regFee: 500, deliveryFee: 0, pledgeFee: 0, total: 3700 },
  ];

  const tabItems = [
    {
      key: 'records', label: '收支记录',
      children: <Table columns={columns} dataSource={finance} rowKey="id" scroll={{ x: 1000 }} size="middle"
        pagination={{ pageSize: 12, showTotal: t => `共 ${t} 条` }} />,
    },
    {
      key: 'settlement', label: '客户结算',
      children: <Table columns={settlementColumns} dataSource={settlementData} rowKey="key" size="middle"
        pagination={false} summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><Text strong>合计</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><Text strong>{formatMoney(settlementData.reduce((s, d) => s + d.storage, 0))}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={2}><Text strong>{formatMoney(settlementData.reduce((s, d) => s + d.regFee, 0))}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={3}><Text strong>{formatMoney(settlementData.reduce((s, d) => s + d.deliveryFee, 0))}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={4}><Text strong>{formatMoney(settlementData.reduce((s, d) => s + d.pledgeFee, 0))}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={5}><Text strong style={{ color: '#1677ff' }}>{formatMoney(settlementData.reduce((s, d) => s + d.total, 0))}</Text></Table.Summary.Cell>
          </Table.Summary.Row>
        )} />,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>财务管理</Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="已收金额" value={formatMoney(totalRevenue)} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="应收账款" value={formatMoney(totalReceivable)} prefix={<AccountBookOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="待结算" value={formatMoney(totalPending)} prefix={<BankOutlined />} valueStyle={{ color: '#1677ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="收入合计" value={formatMoney(totalRevenue + totalReceivable + totalPending)} prefix={<FileTextOutlined />} /></Card></Col>
      </Row>

      <Card style={{ borderRadius: 8 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 费用标准 */}
      <Card title="收费标准" style={{ borderRadius: 8, marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={6}><Text type="secondary">仓储费</Text><br /><Text strong style={{ fontSize: 18 }}>{DELIVERY_FEE_STANDARD.storageFee} 元/吨/天</Text></Col>
          <Col span={6}><Text type="secondary">仓单注册费</Text><br /><Text strong style={{ fontSize: 18 }}>{DELIVERY_FEE_STANDARD.receiptRegFee} 元/吨</Text></Col>
          <Col span={6}><Text type="secondary">交割服务费</Text><br /><Text strong style={{ fontSize: 18 }}>{DELIVERY_FEE_STANDARD.deliveryServiceFee} 元/吨</Text></Col>
          <Col span={6}><Text type="secondary">质押监管费</Text><br /><Text strong style={{ fontSize: 18 }}>{DELIVERY_FEE_STANDARD.pledgeSupervisionFee}%/月</Text></Col>
        </Row>
      </Card>
    </div>
  );
}
