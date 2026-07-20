import { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Space, Tag, Typography, Descriptions, Timeline, Statistic, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, FileProtectOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../contexts/AppContext';
import { RECEIPT_FLOWS } from '../../data/receipts';
import { PP_GRADES } from '../../data/ppGrades';
import { formatNumber, formatMoney } from '../../utils/format';
import type { WarehouseReceipt } from '../../data/receipts';

const { Text, Title } = Typography;
const { Option } = Select;

export default function WarehouseReceipt() {
  const { state, addReceipt } = useAppContext();
  const [regModal, setRegModal] = useState(false);
  const [detailItem, setDetailItem] = useState<WarehouseReceipt | null>(null);
  const [searchText, setSearchText] = useState('');
  const [regForm] = Form.useForm();

  const filtered = state.receipts.filter(r =>
    !searchText || r.id.includes(searchText) || r.gradeCode.includes(searchText.toUpperCase()) ||
    r.registrant.includes(searchText) || r.status.includes(searchText)
  );

  const columns: ColumnsType<WarehouseReceipt> = [
    { title: '仓单编号', dataIndex: 'id', width: 160, ellipsis: true },
    { title: '牌号', dataIndex: 'gradeCode', width: 80, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '数量(吨)', dataIndex: 'quantity', width: 90, render: (v: number) => formatNumber(v) },
    { title: '注册人', dataIndex: 'registrant', width: 130, ellipsis: true },
    { title: '注册日期', dataIndex: 'registerDate', width: 100 },
    { title: '到期日', dataIndex: 'expireDate', width: 100 },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => <StatusTag status={s} /> },
    { title: '质权人', dataIndex: 'pledgee', width: 140, ellipsis: true, render: (v: string | null) => v || '—' },
    { title: '操作', width: 100, fixed: 'right', render: (_, r) => (
      <Button size="small" icon={<EyeOutlined />} onClick={() => setDetailItem(r)}>详情</Button>
    )},
  ];

  // 统计数据
  const activeReceipts = state.receipts.filter(r => r.status !== '已注销');
  const pledgedReceipts = state.receipts.filter(r => r.status === '已质押');
  const totalPledgeAmount = pledgedReceipts.reduce((s, r) => s + (r.pledgeAmount || 0), 0);
  const totalQuantity = activeReceipts.reduce((s, r) => s + r.quantity, 0);

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>仓单管理</Title>

      {/* 仓单统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="有效仓单" value={activeReceipts.length} suffix="张" prefix={<FileProtectOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="仓单总量" value={formatNumber(totalQuantity)} suffix="吨" /></Card></Col>
        <Col span={6}><Card><Statistic title="质押仓单" value={pledgedReceipts.length} suffix="张" /></Card></Col>
        <Col span={6}><Card><Statistic title="质押融资金额" value={formatMoney(totalPledgeAmount)} /></Card></Col>
      </Row>

      {/* 仓单列表 */}
      <Card title="仓单列表" extra={
        <Space>
          <Input.Search placeholder="搜索仓单号/牌号/注册人" allowClear style={{ width: 260 }}
            onSearch={setSearchText} onChange={e => !e.target.value && setSearchText('')} prefix={<SearchOutlined />} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setRegModal(true)}>注册仓单</Button>
        </Space>
      } style={{ borderRadius: 8 }}>
        <Table columns={columns} dataSource={filtered} rowKey="id"
          scroll={{ x: 1100 }} size="middle"
          pagination={{ pageSize: 10, showTotal: t => `共 ${t} 张仓单` }}
        />
      </Card>

      {/* 仓单注册弹窗 */}
      <Modal title="标准仓单注册" open={regModal} onCancel={() => setRegModal(false)}
        onOk={() => {
          regForm.validateFields().then(async vals => {
            await addReceipt({
              id: `DCE-WZ-${Date.now().toString().slice(-8)}`,
              type: '标准仓单', gradeCode: vals.gradeCode, batchNo: vals.batchNo,
              quantity: vals.quantity, registrant: vals.registrant,
              registerDate: new Date().toISOString().slice(0, 10),
              expireDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
              remark: vals.remark || '',
            });
            setRegModal(false); regForm.resetFields();
          });
        }} width={560} okText="确认注册"
      >
        <Form form={regForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="gradeCode" label="PP牌号" rules={[{ required: true }]}>
            <Select placeholder="选择牌号" showSearch>
              {PP_GRADES.filter(g => g.isDelivery).map(g => <Option key={g.code} value={g.code}>{g.code} {g.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="batchNo" label="关联批次号" rules={[{ required: true }]}>
            <Input placeholder="输入库存批次号" />
          </Form.Item>
          <Form.Item name="quantity" label="注册数量(吨)" rules={[{ required: true }]}>
            <InputNumber min={1} max={10000} style={{ width: 240 }} />
          </Form.Item>
          <Form.Item name="registrant" label="注册人(企业)" rules={[{ required: true }]}>
            <Input placeholder="注册企业名称" />
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* 仓单详情弹窗 */}
      <Modal title="仓单详情" open={!!detailItem} onCancel={() => setDetailItem(null)} footer={null} width={700}>
        {detailItem && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="仓单编号">{detailItem.id}</Descriptions.Item>
              <Descriptions.Item label="仓单类型">{detailItem.type}</Descriptions.Item>
              <Descriptions.Item label="PP牌号"><Tag color="blue">{detailItem.gradeCode}</Tag></Descriptions.Item>
              <Descriptions.Item label="数量">{detailItem.quantity} 吨</Descriptions.Item>
              <Descriptions.Item label="注册人">{detailItem.registrant}</Descriptions.Item>
              <Descriptions.Item label="注册日期">{detailItem.registerDate}</Descriptions.Item>
              <Descriptions.Item label="到期日">{detailItem.expireDate}</Descriptions.Item>
              <Descriptions.Item label="状态"><StatusTag status={detailItem.status} /></Descriptions.Item>
              {detailItem.pledgee && <Descriptions.Item label="质权人">{detailItem.pledgee}</Descriptions.Item>}
              {detailItem.pledgeAmount && <Descriptions.Item label="质押金额">{formatMoney(detailItem.pledgeAmount)}</Descriptions.Item>}
              {detailItem.pledgeRate && <Descriptions.Item label="质押率">{(detailItem.pledgeRate * 100).toFixed(0)}%</Descriptions.Item>}
              {detailItem.deliveryContract && <Descriptions.Item label="交割合约">{detailItem.deliveryContract}</Descriptions.Item>}
              {detailItem.counterParty && <Descriptions.Item label="对手方">{detailItem.counterParty}</Descriptions.Item>}
              <Descriptions.Item label="备注">{detailItem.remark || '—'}</Descriptions.Item>
            </Descriptions>

            <Text strong style={{ display: 'block', marginBottom: 8 }}>流转记录</Text>
            <Timeline items={
              RECEIPT_FLOWS.filter(f => f.receiptId === detailItem.id).map(f => ({
                color: f.action === '审核通过' ? 'green' : f.action === '质押登记' ? 'blue' : f.action === '注销' ? 'gray' : 'blue',
                children: (
                  <div>
                    <Text strong>{f.action}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{f.time}</Text>
                    <br />
                    <Text>{f.detail}</Text>
                    <br />
                    <Text type="secondary">操作人：{f.operator}</Text>
                  </div>
                ),
              }))
            } />
          </div>
        )}
      </Modal>
    </div>
  );
}
