import { Card, Table, Typography, Row, Col, Statistic, Progress } from 'antd';
import { BarChartOutlined, PieChartOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatNumber, formatTons, formatMoney } from '../../utils/format';

const { Text, Title } = Typography;

export default function Reports() {
  const { state } = useAppContext();

  // 月度吞吐量趋势
  const throughputOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库', '净入库'], bottom: 0 },
    grid: { left: 60, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] },
    yAxis: { type: 'value', name: '吨' },
    series: [
      { name: '入库', type: 'bar', data: [4200, 3800, 5100, 4600, 5500, 6800, 5600], itemStyle: { color: '#52c41a' }, barGap: 0 },
      { name: '出库', type: 'bar', data: [3500, 4000, 4200, 4800, 5100, 5800, 2150], itemStyle: { color: '#ff7875' }, barGap: 0 },
      { name: '净入库', type: 'line', data: [700, -200, 900, -200, 400, 1000, 3450], itemStyle: { color: '#1677ff' }, lineStyle: { width: 3 } },
    ],
  };

  // 收入构成
  const revenueOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '45%'],
      label: { formatter: '{b}\n{d}%' },
      data: [
        { value: 64240, name: '仓储费', itemStyle: { color: '#1677ff' } },
        { value: 34000, name: '交割服务费', itemStyle: { color: '#52c41a' } },
        { value: 4100, name: '仓单注册费', itemStyle: { color: '#fa8c16' } },
        { value: 1700, name: '质押监管费', itemStyle: { color: '#722ed1' } },
        { value: 1200, name: '质检费', itemStyle: { color: '#13c2c2' } },
      ],
    }],
  };

  // 库存周转率
  const turnoverData = [
    { grade: 'T30S', inventory: 5000, monthlyOut: 1100, turnover: 2.64, days: 11.4 },
    { grade: 'S1003', inventory: 3800, monthlyOut: 300, turnover: 0.95, days: 31.7 },
    { grade: 'L5E89', inventory: 1550, monthlyOut: 150, turnover: 1.16, days: 25.8 },
    { grade: 'K8003', inventory: 500, monthlyOut: 100, turnover: 2.40, days: 12.5 },
    { grade: 'EPS30R', inventory: 1000, monthlyOut: 0, turnover: 0, days: Infinity },
    { grade: 'F401', inventory: 450, monthlyOut: 0, turnover: 0, days: Infinity },
    { grade: 'K7726H', inventory: 300, monthlyOut: 0, turnover: 0, days: Infinity },
  ];

  const turnoverColumns = [
    { title: '牌号', dataIndex: 'grade', width: 90, render: (v: string) => <Text strong>{v}</Text> },
    { title: '当前库存(吨)', dataIndex: 'inventory', width: 110, render: (v: number) => formatNumber(v) },
    { title: '月出库(吨)', dataIndex: 'monthlyOut', width: 100, render: (v: number) => formatNumber(v) },
    { title: '月周转次数', dataIndex: 'turnover', width: 100, render: (v: number) => v === 0 ? <Text type="secondary">—</Text> : <Text>{v.toFixed(2)}</Text> },
    { title: '平均存放天数', dataIndex: 'days', width: 110, render: (v: number) => v === Infinity ? <Text type="secondary">—</Text> : <Text style={{ color: v > 30 ? '#ff4d4f' : '#52c41a' }}>{v.toFixed(1)} 天</Text> },
    { title: '周转评价', dataIndex: 'turnover', width: 100, render: (v: number) => {
      if (v === 0) return <Text type="secondary">待出库</Text>;
      if (v > 2) return <Text style={{ color: '#52c41a' }}>快速</Text>;
      if (v > 1) return <Text style={{ color: '#1677ff' }}>正常</Text>;
      return <Text style={{ color: '#fa8c16' }}>偏慢</Text>;
    }},
  ];

  // 客户排名
  const customerData = [
    { key: '1', customer: '温州华塑集团', inbound: 2700, outbound: 1100, netIn: 1600, fee: 50600 },
    { key: '2', customer: '福建中景贸易', inbound: 3800, outbound: 300, netIn: 3500, fee: 48600 },
    { key: '3', customer: '苍南塑编一厂', inbound: 1200, outbound: 150, netIn: 1050, fee: 7200 },
    { key: '4', customer: '台州汽车配件', inbound: 600, outbound: 100, netIn: 500, fee: 13440 },
    { key: '5', customer: '齐鲁石化销售', inbound: 1000, outbound: 0, netIn: 1000, fee: 3700 },
  ];

  const customerColumns = [
    { title: '排名', render: (_: unknown, __: unknown, i: number) => <Text strong>{i + 1}</Text>, width: 60 },
    { title: '客户', dataIndex: 'customer', width: 150 },
    { title: '累计入库(吨)', dataIndex: 'inbound', width: 120, render: (v: number) => formatNumber(v) },
    { title: '累计出库(吨)', dataIndex: 'outbound', width: 120, render: (v: number) => formatNumber(v) },
    { title: '净库存(吨)', dataIndex: 'netIn', width: 100, render: (v: number) => formatNumber(v) },
    { title: '费用贡献(元)', dataIndex: 'fee', width: 140, render: (v: number) => formatMoney(v), sorter: (a: typeof customerData[0], b: typeof customerData[0]) => a.fee - b.fee },
  ];

  // 总统计
  const totalRevenue = customerData.reduce((s, c) => s + c.fee, 0);
  const totalInbound = customerData.reduce((s, c) => s + c.inbound, 0);
  const totalOutbound = customerData.reduce((s, c) => s + c.outbound, 0);

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>报表中心</Title>

      {/* KPI */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="累计入库" value={formatTons(totalInbound)} prefix={<RiseOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="累计出库" value={formatTons(totalOutbound)} prefix={<RiseOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="累计收入" value={formatMoney(totalRevenue)} prefix={<BarChartOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃客户" value={customerData.length} suffix="家" prefix={<TeamOutlined />} /></Card></Col>
      </Row>

      {/* 图表 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card title="月度吞吐量趋势">
          <ReactECharts option={throughputOption} style={{ height: 320 }} />
        </Card>
        <Card title="收入构成分析">
          <ReactECharts option={revenueOption} style={{ height: 320 }} />
        </Card>
      </div>

      {/* 库存周转率 */}
      <Card title="库存周转率分析" style={{ marginBottom: 16, borderRadius: 8 }}>
        <Table columns={turnoverColumns} dataSource={turnoverData} rowKey="grade"
          pagination={false} size="middle" />
      </Card>

      {/* 客户排名 */}
      <Card title="客户出入库排名" style={{ borderRadius: 8 }}>
        <Table columns={customerColumns} dataSource={customerData} rowKey="key"
          pagination={false} size="middle"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}><Text strong>合计</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><Text strong>{formatTons(totalInbound)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={2}><Text strong>{formatTons(totalOutbound)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={3}><Text strong>{formatTons(totalInbound - totalOutbound)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4}><Text strong style={{ color: '#1677ff' }}>{formatMoney(totalRevenue)}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
}
