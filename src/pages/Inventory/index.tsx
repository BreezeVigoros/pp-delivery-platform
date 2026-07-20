import { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Space, Tabs, Tag, Typography, Tooltip, Descriptions, Progress } from 'antd';
import { PlusOutlined, MinusOutlined, SearchOutlined, DownloadOutlined, CheckCircleOutlined, AreaChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../contexts/AppContext';
import { WAREHOUSE_LOCATIONS } from '../../data/inventory';
import { PP_GRADES } from '../../data/ppGrades';
import { formatNumber, formatTons } from '../../utils/format';
import type { InventoryItem } from '../../data/inventory';

const { Text } = Typography;
const { Option } = Select;

export default function Inventory() {
  const { state, addInventory, outboundInventory } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [inModal, setInModal] = useState(false);
  const [outModal, setOutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchText, setSearchText] = useState('');
  const [inForm] = Form.useForm();
  const [outForm] = Form.useForm();

  const filtered = useMemo(() => {
    if (!searchText) return state.inventory;
    return state.inventory.filter(i =>
      i.gradeCode.includes(searchText.toUpperCase()) ||
      i.batchNo.includes(searchText) ||
      i.producer.includes(searchText) ||
      i.location.includes(searchText)
    );
  }, [state.inventory, searchText]);

  const columns: ColumnsType<InventoryItem> = [
    { title: '货位', dataIndex: 'location', width: 90, sorter: (a, b) => a.location.localeCompare(b.location) },
    { title: '牌号', dataIndex: 'gradeCode', width: 90, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '批次号', dataIndex: 'batchNo', width: 150, ellipsis: true },
    { title: '数量(吨)', dataIndex: 'quantity', width: 90, sorter: (a, b) => a.quantity - b.quantity, render: (v: number) => formatNumber(v) },
    { title: '包装', dataIndex: 'packageType', width: 90 },
    { title: '生产商', dataIndex: 'producer', width: 140, ellipsis: true },
    { title: '入库日期', dataIndex: 'inboundDate', width: 100, sorter: (a, b) => a.inboundDate.localeCompare(b.inboundDate) },
    { title: '质检状态', dataIndex: 'qualityStatus', width: 90, render: (s: string) => <StatusTag status={s} /> },
    { title: '关联仓单', dataIndex: 'receiptNo', width: 140, ellipsis: true, render: (v: string | null) => v || <Text type="secondary">未注册</Text> },
    { title: '操作', width: 120, fixed: 'right', render: (_, record) => (
      <Space>
        <Button size="small" onClick={() => { setSelectedItem(record); setOutModal(true); outForm.setFieldsValue({ quantity: 0, gradeCode: record.gradeCode, batchNo: record.batchNo }); }}>出库</Button>
        <Button size="small" type="text" onClick={() => setSelectedItem(record)}>详情</Button>
      </Space>
    )},
  ];

  const handleInbound = () => {
    inForm.validateFields().then(async vals => {
      await addInventory({
        id: `INV${Date.now()}`,
        gradeCode: vals.gradeCode, batchNo: vals.batchNo, quantity: vals.quantity,
        packageType: vals.packageType, packages: vals.packageType === '25kg袋装' ? vals.quantity * 40 : Math.ceil(vals.quantity / 0.7),
        location: vals.location, warehouseArea: vals.location.split('-')[0] + '区',
        inboundDate: new Date().toISOString().slice(0, 10), producer: vals.producer,
        mfr: vals.mfr, qualityStatus: '待检验', receiptNo: null,
        inspector: vals.inspector, remark: vals.remark || '',
      });
      setInModal(false); inForm.resetFields();
    });
  };

  const handleOutbound = () => {
    outForm.validateFields().then(async vals => {
      if (selectedItem && vals.quantity > 0 && vals.quantity <= selectedItem.quantity) {
        await outboundInventory(selectedItem.id, vals.quantity);
        setOutModal(false); setSelectedItem(null); outForm.resetFields();
      }
    });
  };

  // 库容统计
  const totalCap = WAREHOUSE_LOCATIONS.reduce((s, l) => s + l.capacity, 0);
  const totalUsed = WAREHOUSE_LOCATIONS.reduce((s, l) => s + l.used, 0);

  const tabItems = [
    {
      key: 'overview',
      label: '库存总览',
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Input.Search placeholder="搜索牌号/批次/产地/货位" allowClear style={{ width: 260 }}
              onSearch={setSearchText} onChange={e => !e.target.value && setSearchText('')} prefix={<SearchOutlined />} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setInModal(true)}>入库登记</Button>
            <Button icon={<DownloadOutlined />}>导出库存</Button>
          </Space>
          <Table columns={columns} dataSource={filtered} rowKey="id"
            scroll={{ x: 1200 }} size="middle"
            pagination={{ pageSize: 15, showSizeChanger: true, showTotal: t => `共 ${t} 条` }}
          />
        </div>
      ),
    },
    {
      key: 'map',
      label: '货位可视化',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text>总库容：<Text strong>{formatTons(totalCap)}</Text></Text>
            <Text style={{ marginLeft: 24 }}>已用：<Text strong>{formatTons(totalUsed)}</Text></Text>
            <Text style={{ marginLeft: 24 }}>利用率：<Text strong style={{ color: totalUsed / totalCap > 0.8 ? '#ff4d4f' : '#52c41a' }}>{(totalUsed / totalCap * 100).toFixed(1)}%</Text></Text>
          </div>
          <div className="warehouse-map">
            {WAREHOUSE_LOCATIONS.map(loc => (
              <Tooltip key={loc.code} title={`${loc.code} | 容量${loc.capacity}吨 | 已用${loc.used}吨 | ${loc.status}`}>
                <div className="warehouse-area" style={{
                  background: loc.status === '满仓' ? '#fff2f0' : loc.status === '部分占用' ? '#e6f7ff' : '#f6ffed',
                  borderColor: loc.status === '满仓' ? '#ff4d4f' : loc.status === '部分占用' ? '#1677ff' : '#52c41a',
                }}>
                  <Text strong style={{ fontSize: 16 }}>{loc.code}</Text>
                  <br />
                  <Progress percent={Math.round(loc.used / loc.capacity * 100)} size="small"
                    strokeColor={loc.status === '满仓' ? '#ff4d4f' : loc.status === '部分占用' ? '#1677ff' : '#52c41a'} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{loc.used}/{loc.capacity} 吨</Text>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'check',
      label: '盘点记录',
      children: (
        <Table dataSource={[
          { key: '1', date: '2026-06-30', checker: '王建国', result: '账实相符', diff: 0, remark: '月末盘点' },
          { key: '2', date: '2026-05-31', checker: '王建国', result: '账实相符', diff: 0, remark: '月末盘点' },
          { key: '3', date: '2026-04-30', checker: '陈志明', result: '盘盈', diff: 2.5, remark: 'T30S溢余2.5吨，已调账' },
        ]} columns={[
          { title: '日期', dataIndex: 'date', width: 120 },
          { title: '盘点人', dataIndex: 'checker', width: 100 },
          { title: '结果', dataIndex: 'result', width: 100, render: (v: string) => <Tag color={v === '账实相符' ? 'green' : 'orange'}>{v}</Tag> },
          { title: '差异(吨)', dataIndex: 'diff', width: 100 },
          { title: '备注', dataIndex: 'remark' },
        ]} pagination={false} size="middle" />
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>库存管理</Typography.Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 入库登记弹窗 */}
      <Modal title="入库登记" open={inModal} onCancel={() => setInModal(false)} onOk={handleInbound} width={600} okText="确认入库">
        <Form form={inForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="gradeCode" label="PP牌号" rules={[{ required: true }]}>
            <Select placeholder="选择牌号" showSearch>
              {PP_GRADES.map(g => <Option key={g.code} value={g.code}>{g.code} {g.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="batchNo" label="批次号" rules={[{ required: true }]}>
            <Input placeholder="如 20260715-T30S-01" />
          </Form.Item>
          <Space size="large">
            <Form.Item name="quantity" label="入库数量(吨)" rules={[{ required: true }]}>
              <InputNumber min={1} max={5000} style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="packageType" label="包装类型" rules={[{ required: true }]}>
              <Select style={{ width: 140 }}>
                <Option value="25kg袋装">25kg袋装</Option>
                <Option value="700kg吨袋">700kg吨袋</Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="location" label="分配货位" rules={[{ required: true }]}>
            <Select placeholder="选择货位">
              {WAREHOUSE_LOCATIONS.filter(l => l.status !== '满仓').map(l => <Option key={l.code} value={`${l.code}-01`}>{l.code} (可用{l.capacity - l.used}吨)</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="producer" label="生产商" rules={[{ required: true }]}>
            <Select placeholder="选择生产商" showSearch>
              {[...new Set(PP_GRADES.map(g => g.producer))].map(p => <Option key={p} value={p}>{p}</Option>)}
            </Select>
          </Form.Item>
          <Space size="large">
            <Form.Item name="mfr" label="MFR实测值" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} step={0.1} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item name="inspector" label="质检机构" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}>
                <Option value="SGS宁波">SGS宁波</Option>
                <Option value="CCIC温州">CCIC温州</Option>
                <Option value="华测检测">华测检测</Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* 出库确认弹窗 */}
      <Modal title="出库核放" open={outModal} onCancel={() => { setOutModal(false); setSelectedItem(null); }} onOk={handleOutbound} okText="确认出库">
        {selectedItem && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="牌号">{selectedItem.gradeCode}</Descriptions.Item>
              <Descriptions.Item label="批次">{selectedItem.batchNo}</Descriptions.Item>
              <Descriptions.Item label="货位">{selectedItem.location}</Descriptions.Item>
              <Descriptions.Item label="可用库存">{selectedItem.quantity} 吨</Descriptions.Item>
            </Descriptions>
            <Form form={outForm} layout="vertical" style={{ marginTop: 16 }}>
              <Form.Item name="quantity" label="出库数量(吨)" rules={[{ required: true }]}>
                <InputNumber min={1} max={selectedItem.quantity} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="destination" label="目的地"><Input placeholder="如：平阳萧江" /></Form.Item>
              <Form.Item name="customer" label="客户"><Input placeholder="客户名称" /></Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* 详情弹窗 */}
      <Modal title="库存详情" open={!!selectedItem && !outModal} onCancel={() => setSelectedItem(null)} footer={null} width={500}>
        {selectedItem && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="库存编号">{selectedItem.id}</Descriptions.Item>
            <Descriptions.Item label="PP牌号">{selectedItem.gradeCode}</Descriptions.Item>
            <Descriptions.Item label="批次号">{selectedItem.batchNo}</Descriptions.Item>
            <Descriptions.Item label="库存数量">{selectedItem.quantity} 吨（{selectedItem.packages} 袋）</Descriptions.Item>
            <Descriptions.Item label="包装类型">{selectedItem.packageType}</Descriptions.Item>
            <Descriptions.Item label="货位">{selectedItem.location}（{selectedItem.warehouseArea}）</Descriptions.Item>
            <Descriptions.Item label="入库日期">{selectedItem.inboundDate}</Descriptions.Item>
            <Descriptions.Item label="生产商">{selectedItem.producer}</Descriptions.Item>
            <Descriptions.Item label="MFR实测">{selectedItem.mfr} g/10min</Descriptions.Item>
            <Descriptions.Item label="质检状态"><StatusTag status={selectedItem.qualityStatus} /></Descriptions.Item>
            <Descriptions.Item label="关联仓单">{selectedItem.receiptNo || '未注册'}</Descriptions.Item>
            <Descriptions.Item label="质检机构">{selectedItem.inspector}</Descriptions.Item>
            <Descriptions.Item label="备注">{selectedItem.remark || '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
