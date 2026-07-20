import { useState } from 'react';
import { Card, Table, Tag, Typography, Descriptions, Space, Button, Modal, Form, Select, Input, Row, Col, Spin } from 'antd';
import { UploadOutlined, ExperimentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StatusTag from '../../components/StatusTag';
import { useAppContext } from '../../contexts/AppContext';
import { DELIVERY_STANDARDS, INSPECTION_AGENCIES, PP_GRADES } from '../../data/ppGrades';

const { Text, Title } = Typography;
const { Option } = Select;

export default function QualityInspection() {
  const { state } = useAppContext();
  const { quality, loading } = state;
  const [detailItem, setDetailItem] = useState<any>(null);
  const [entrustModal, setEntrustModal] = useState(false);
  const [entrustForm] = Form.useForm();

  const columns: ColumnsType<any> = [
    { title: '委托编号', dataIndex: 'id', width: 90 },
    { title: '牌号', dataIndex: 'gradeCode', width: 80, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '批次号', dataIndex: 'batchNo', width: 150, ellipsis: true },
    { title: '数量(吨)', dataIndex: 'quantity', width: 80 },
    { title: '质检机构', dataIndex: 'agency', width: 90 },
    { title: '日期', dataIndex: 'date', width: 100 },
    { title: 'MFR', dataIndex: 'mfr', width: 60 },
    { title: '结果', dataIndex: 'result', width: 80, render: (s: string) => <StatusTag status={s} /> },
    { title: '报告编号', dataIndex: 'reportNo', width: 160, ellipsis: true },
    { title: '操作', width: 80, render: (_: any, r: any) => (
      <Button size="small" type="link" onClick={() => setDetailItem(r)}>详情</Button>
    )},
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>质检管理</Title>

      <Card title="PP期货交割质检标准（大商所）" style={{ borderRadius: 8, marginBottom: 16 }}>
        <Row gutter={16}>
          {Object.entries(DELIVERY_STANDARDS).map(([key, std]) => (
            <Col span={4} key={key}>
              <Card size="small" hoverable>
                <Text strong>{std.name}</Text><br />
                <Text type="secondary" style={{ fontSize: 12 }}>{std.method}</Text><br />
                <Text style={{ fontSize: 16, color: '#1677ff', fontWeight: 600 }}>{std.standard}</Text>
                <Text type="secondary"> {std.unit}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="质检记录" extra={
        <Button type="primary" icon={<ExperimentOutlined />} onClick={() => setEntrustModal(true)}>新建委托</Button>
      } style={{ borderRadius: 8, marginBottom: 16 }}>
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={quality} rowKey="id"
            scroll={{ x: 1000 }} size="middle"
            pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }}
          />
        </Spin>
      </Card>

      <Card title="第三方质检机构" style={{ borderRadius: 8 }}>
        <Row gutter={16}>
          {INSPECTION_AGENCIES.map(agency => (
            <Col span={8} key={agency.id}>
              <Card size="small" hoverable>
                <Text strong>{agency.name}</Text><br />
                <Text type="secondary">{agency.location}</Text><br />
                <Text>电话：{agency.contact}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal title="质检详情" open={!!detailItem} onCancel={() => setDetailItem(null)} footer={null} width={600}>
        {detailItem && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="委托编号">{detailItem.id}</Descriptions.Item>
            <Descriptions.Item label="质检结果"><StatusTag status={detailItem.result} /></Descriptions.Item>
            <Descriptions.Item label="PP牌号">{detailItem.gradeCode}</Descriptions.Item>
            <Descriptions.Item label="批次号">{detailItem.batchNo}</Descriptions.Item>
            <Descriptions.Item label="数量">{detailItem.quantity} 吨</Descriptions.Item>
            <Descriptions.Item label="质检机构">{detailItem.agency}</Descriptions.Item>
            <Descriptions.Item label="质检员">{detailItem.inspector}</Descriptions.Item>
            <Descriptions.Item label="日期">{detailItem.date}</Descriptions.Item>
            <Descriptions.Item label="MFR实测">{detailItem.mfr} g/10min（标准2.0-4.0）</Descriptions.Item>
            <Descriptions.Item label="拉伸强度">{detailItem.tensile} MPa（标准≥30）</Descriptions.Item>
            <Descriptions.Item label="冲击强度">{detailItem.impact} kJ/m²（标准≥2.0）</Descriptions.Item>
            <Descriptions.Item label="灰分">{detailItem.ash}%（标准≤0.04）</Descriptions.Item>
            <Descriptions.Item label="报告编号">{detailItem.reportNo}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal title="新建质检委托" open={entrustModal} onCancel={() => setEntrustModal(false)}
        onOk={() => { setEntrustModal(false); entrustForm.resetFields(); }} width={500} okText="提交委托">
        <Form form={entrustForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="gradeCode" label="PP牌号" rules={[{ required: true }]}>
            <Select placeholder="选择牌号" showSearch>
              {PP_GRADES.map(g => <Option key={g.code} value={g.code}>{g.code}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="batchNo" label="批次号" rules={[{ required: true }]}>
            <Input placeholder="输入批次号" />
          </Form.Item>
          <Form.Item name="agency" label="质检机构" rules={[{ required: true }]}>
            <Select placeholder="选择机构">
              {INSPECTION_AGENCIES.map(a => <Option key={a.id} value={a.name}>{a.name}（{a.location}）</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="items" label="检验项目">
            <Select mode="multiple" defaultValue={['mfr', 'tensile', 'impact', 'ash']}>
              {Object.entries(DELIVERY_STANDARDS).map(([k, v]) => <Option key={k} value={k}>{v.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
