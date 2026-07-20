// 仓单管理模拟数据
export type ReceiptStatus = '已注册' | '已质押' | '交割中' | '已注销';
export type ReceiptType = '标准仓单' | '非标准仓单';

export interface WarehouseReceipt {
  id: string;                // 仓单编号
  type: ReceiptType;
  gradeCode: string;
  batchNo: string;
  quantity: number;           // 吨
  registrant: string;         // 注册人
  registerDate: string;
  status: ReceiptStatus;
  pledgee: string | null;     // 质权人
  pledgeDate: string | null;
  pledgeAmount: number | null;// 质押金额 万元
  pledgeRate: number | null;  // 质押率
  expireDate: string;         // 仓单到期日
  deliveryDate: string | null;// 交割日期
  deliveryContract: string | null; // 交割合约
  counterParty: string | null;     // 交易对手方
  cancelDate: string | null;
  remark: string;
}

export const WAREHOUSE_RECEIPTS: WarehouseReceipt[] = [
  {
    id: 'DCE-WZ-20260042', type: '标准仓单', gradeCode: 'T30S',
    batchNo: '20260615-T30S-01', quantity: 1500,
    registrant: '温州华塑集团', registerDate: '2026-06-18',
    status: '已注册', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-06-17', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '镇海炼化货源',
  },
  {
    id: 'DCE-WZ-20260043', type: '标准仓单', gradeCode: 'L5E89',
    batchNo: '20260618-L5E89-01', quantity: 1200,
    registrant: '苍南塑编一厂', registerDate: '2026-06-21',
    status: '已质押', pledgee: '中国工商银行温州分行', pledgeDate: '2026-07-02',
    pledgeAmount: 912, pledgeRate: 0.75,
    expireDate: '2027-06-20', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '质押融资-流动资金贷款',
  },
  {
    id: 'DCE-WZ-20260044', type: '标准仓单', gradeCode: 'S1003',
    batchNo: '20260620-S1003-01', quantity: 2000,
    registrant: '福建中景贸易', registerDate: '2026-06-23',
    status: '已注册', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-06-22', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '福建北上货源',
  },
  {
    id: 'DCE-WZ-20260045', type: '标准仓单', gradeCode: 'K8003',
    batchNo: '20260625-K8003-01', quantity: 600,
    registrant: '台州汽车配件有限公司', registerDate: '2026-06-28',
    status: '交割中', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-06-27', deliveryDate: '2026-07-12',
    deliveryContract: 'PP2609', counterParty: '浙江明日控股集团',
    cancelDate: null, remark: '合约PP2609配对交割',
  },
  {
    id: 'DCE-WZ-20260046', type: '标准仓单', gradeCode: 'EPS30R',
    batchNo: '20260628-EPS30R-01', quantity: 1000,
    registrant: '齐鲁石化销售公司', registerDate: '2026-07-01',
    status: '已注册', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-06-30', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '' },
  {
    id: 'DCE-WZ-20260047', type: '标准仓单', gradeCode: 'T30S',
    batchNo: '20260703-T30S-03', quantity: 2200,
    registrant: '温州华塑集团', registerDate: '2026-07-06',
    status: '已质押', pledgee: '中国银行温州分行', pledgeDate: '2026-07-10',
    pledgeAmount: 1672, pledgeRate: 0.80,
    expireDate: '2027-07-05', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '质押融资-采购原材料' },
  {
    id: 'DCE-WZ-20260048', type: '标准仓单', gradeCode: 'S1003',
    batchNo: '20260708-S1003-02', quantity: 1800,
    registrant: '福建中景贸易', registerDate: '2026-07-11',
    status: '已注册', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-07-10', deliveryDate: null, deliveryContract: null, counterParty: null,
    cancelDate: null, remark: '福建北上货源' },
  {
    id: 'DCE-WZ-20260038', type: '标准仓单', gradeCode: 'T30S',
    batchNo: '20260520-T30S-01', quantity: 800,
    registrant: '温州华塑集团', registerDate: '2026-05-23',
    status: '已注销', pledgee: null, pledgeDate: null, pledgeAmount: null, pledgeRate: null,
    expireDate: '2027-05-22', deliveryDate: '2026-06-15',
    deliveryContract: 'PP2607', counterParty: '杭州临港物流',
    cancelDate: '2026-06-16', remark: '交割完成已注销' },
];

// 仓单流转记录
export interface ReceiptFlow {
  id: string; receiptId: string; action: string;
  operator: string; time: string; detail: string;
}

export const RECEIPT_FLOWS: ReceiptFlow[] = [
  { id: 'FL001', receiptId: 'DCE-WZ-20260042', action: '注册', operator: '王建国', time: '2026-06-18 10:30', detail: '提交仓单注册申请，关联库存INV20260701（T30S/1500吨）' },
  { id: 'FL002', receiptId: 'DCE-WZ-20260042', action: '审核通过', operator: '李主管', time: '2026-06-18 14:20', detail: '质检合格，仓单信息审核通过，标准仓单生效' },
  { id: 'FL003', receiptId: 'DCE-WZ-20260043', action: '注册', operator: '陈志明', time: '2026-06-21 09:15', detail: '提交仓单注册申请，关联库存INV20260702（L5E89/1200吨）' },
  { id: 'FL004', receiptId: 'DCE-WZ-20260043', action: '审核通过', operator: '李主管', time: '2026-06-21 11:00', detail: '质检合格，仓单信息审核通过' },
  { id: 'FL005', receiptId: 'DCE-WZ-20260043', action: '质押登记', operator: '陈志明', time: '2026-07-02 10:00', detail: '向工商银行温州分行质押，质押率75%，融资金额912万元' },
  { id: 'FL006', receiptId: 'DCE-WZ-20260044', action: '注册', operator: '赵海峰', time: '2026-06-23 15:30', detail: '提交仓单注册申请，关联库存INV20260703（S1003/2000吨）' },
  { id: 'FL007', receiptId: 'DCE-WZ-20260045', action: '交割配对', operator: '系统', time: '2026-07-12 09:00', detail: 'PP2609合约交割配对成功，配对量600吨，对手方浙江明日控股集团' },
  { id: 'FL008', receiptId: 'DCE-WZ-20260047', action: '质押登记', operator: '王建国', time: '2026-07-10 14:45', detail: '向中国银行温州分行质押，质押率80%，融资金额1672万元' },
  { id: 'FL009', receiptId: 'DCE-WZ-20260038', action: '注销', operator: '王建国', time: '2026-06-16 16:00', detail: 'PP2607合约交割完成，仓单注销' },
];
