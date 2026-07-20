// 交割管理模拟数据
export type DeliveryStatus = '待配对' | '已配对' | '质检中' | '货权转移中' | '已完成' | '已取消';

export interface DeliveryRecord {
  id: string;
  contract: string;          // 合约代码
  deliveryMonth: string;     // 交割月份
  gradeCode: string;
  quantity: number;           // 吨
  seller: string;
  buyer: string;
  receiptId: string;
  status: DeliveryStatus;
  pairDate: string | null;
  inspectionDate: string | null;
  inspectionResult: string | null;
  titleTransferDate: string | null;
  completeDate: string | null;
  deliveryFee: number;        // 交割服务费 元
  remark: string;
}

export const DELIVERY_RECORDS: DeliveryRecord[] = [
  {
    id: 'DLV2026001', contract: 'PP2607', deliveryMonth: '2026年7月',
    gradeCode: 'T30S', quantity: 800,
    seller: '温州华塑集团', buyer: '杭州临港物流有限公司',
    receiptId: 'DCE-WZ-20260038',
    status: '已完成', pairDate: '2026-06-10', inspectionDate: '2026-06-12',
    inspectionResult: '合格', titleTransferDate: '2026-06-15', completeDate: '2026-06-16',
    deliveryFee: 16000, remark: 'PP2607合约到期交割',
  },
  {
    id: 'DLV2026002', contract: 'PP2609', deliveryMonth: '2026年9月',
    gradeCode: 'K8003', quantity: 600,
    seller: '台州汽车配件有限公司', buyer: '浙江明日控股集团',
    receiptId: 'DCE-WZ-20260045',
    status: '已配对', pairDate: '2026-07-12', inspectionDate: null,
    inspectionResult: null, titleTransferDate: null, completeDate: null,
    deliveryFee: 12000, remark: '提前配对，待质检',
  },
  {
    id: 'DLV2026003', contract: 'PP2609', deliveryMonth: '2026年9月',
    gradeCode: 'T30S', quantity: 500,
    seller: '温州华塑集团', buyer: '中储发展上海浦东分公司',
    receiptId: 'DCE-WZ-20260042',
    status: '待配对', pairDate: null, inspectionDate: null,
    inspectionResult: null, titleTransferDate: null, completeDate: null,
    deliveryFee: 0, remark: '等待买方确认配对',
  },
  {
    id: 'DLV2026004', contract: 'PP2608', deliveryMonth: '2026年8月',
    gradeCode: 'S1003', quantity: 1000,
    seller: '福建中景贸易', buyer: '金田集团（龙港）',
    receiptId: 'DCE-WZ-20260044',
    status: '质检中', pairDate: '2026-07-08', inspectionDate: '2026-07-11',
    inspectionResult: null, titleTransferDate: null, completeDate: null,
    deliveryFee: 20000, remark: 'SGS宁波正在质检',
  },
  {
    id: 'DLV2026005', contract: 'PP2608', deliveryMonth: '2026年8月',
    gradeCode: 'EPS30R', quantity: 1000,
    seller: '齐鲁石化销售公司', buyer: '宁波保税区高新铁柜有限公司',
    receiptId: 'DCE-WZ-20260046',
    status: '待配对', pairDate: null, inspectionDate: null,
    inspectionResult: null, titleTransferDate: null, completeDate: null,
    deliveryFee: 0, remark: '新注册仓单，等待配对',
  },
  {
    id: 'DLV2026006', contract: 'PP2607', deliveryMonth: '2026年7月',
    gradeCode: 'L5E89', quantity: 300,
    seller: '苍南塑编一厂', buyer: '上海远盛仓储有限公司',
    receiptId: 'DCE-WZ-20260043',
    status: '已完成', pairDate: '2026-06-20', inspectionDate: '2026-06-22',
    inspectionResult: '合格', titleTransferDate: '2026-06-28', completeDate: '2026-06-29',
    deliveryFee: 6000, remark: 'PP2607合约部分交割（质押仓单解押后交割）',
  },
];

// 交割费用标准
export const DELIVERY_FEE_STANDARD = {
  storageFee: 0.8,           // 仓储费 元/吨/天
  receiptRegFee: 0.5,        // 仓单注册费 元/吨
  deliveryServiceFee: 20,    // 交割服务费 元/吨
  inspectionFee: 1200,       // 质检费 元/批次
  pledgeSupervisionFee: 0.05,// 质押监管费率 %/月
};
