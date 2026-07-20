// 库存模拟数据 —— 基于温州苍南/平阳PP期货交割库真实场景
import type { PPGradeInfo } from './ppGrades';

export interface InventoryItem {
  id: string;
  gradeCode: string;
  batchNo: string;
  quantity: number;        // 吨
  packageType: '25kg袋装' | '700kg吨袋';
  packages: number;        // 袋数
  location: string;        // 货位编号
  warehouseArea: 'A区' | 'B区' | 'C区' | 'D区';
  inboundDate: string;
  producer: string;
  mfr: number;             // 熔融指数实测值
  qualityStatus: '合格' | '待检验' | '不合格';
  receiptNo: string | null;// 关联仓单号
  inspector: string;
  remark: string;
}

// 货位数据
export interface WarehouseLocation {
  code: string;
  area: string;
  capacity: number;  // 吨
  used: number;      // 吨
  status: '空闲' | '部分占用' | '满仓';
}

// 生成真实感库存数据
export const INVENTORY: InventoryItem[] = [
  { id: 'INV20260701', gradeCode: 'T30S', batchNo: '20260615-T30S-01', quantity: 1500, packageType: '25kg袋装', packages: 60000, location: 'A-01-01', warehouseArea: 'A区', inboundDate: '2026-06-15', producer: '中石化镇海炼化', mfr: 3.1, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260042', inspector: 'SGS宁波', remark: '' },
  { id: 'INV20260702', gradeCode: 'L5E89', batchNo: '20260618-L5E89-01', quantity: 1200, packageType: '25kg袋装', packages: 48000, location: 'A-01-02', warehouseArea: 'A区', inboundDate: '2026-06-18', producer: '中石油兰州石化', mfr: 3.3, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260043', inspector: 'CCIC温州', remark: '' },
  { id: 'INV20260703', gradeCode: 'S1003', batchNo: '20260620-S1003-01', quantity: 2000, packageType: '700kg吨袋', packages: 2857, location: 'B-02-01', warehouseArea: 'B区', inboundDate: '2026-06-20', producer: '中景石化（福清）', mfr: 3.0, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260044', inspector: '华测检测', remark: '福建北上货源' },
  { id: 'INV20260704', gradeCode: 'T30S', batchNo: '20260622-T30S-02', quantity: 800, packageType: '25kg袋装', packages: 32000, location: 'A-01-03', warehouseArea: 'A区', inboundDate: '2026-06-22', producer: '中石化镇海炼化', mfr: 2.9, qualityStatus: '合格', receiptNo: null, inspector: 'SGS宁波', remark: '待注册仓单' },
  { id: 'INV20260705', gradeCode: 'K8003', batchNo: '20260625-K8003-01', quantity: 600, packageType: '25kg袋装', packages: 24000, location: 'C-03-01', warehouseArea: 'C区', inboundDate: '2026-06-25', producer: '中石化扬子石化', mfr: 2.4, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260045', inspector: 'SGS宁波', remark: '宁波南下货源' },
  { id: 'INV20260706', gradeCode: 'EPS30R', batchNo: '20260628-EPS30R-01', quantity: 1000, packageType: '700kg吨袋', packages: 1428, location: 'C-03-02', warehouseArea: 'C区', inboundDate: '2026-06-28', producer: '中石化齐鲁石化', mfr: 1.8, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260046', inspector: 'CCIC温州', remark: '' },
  { id: 'INV20260707', gradeCode: 'F401', batchNo: '20260701-F401-01', quantity: 450, packageType: '25kg袋装', packages: 18000, location: 'D-04-01', warehouseArea: 'D区', inboundDate: '2026-07-01', producer: '中化石化（泉州）', mfr: 2.6, qualityStatus: '待检验', receiptNo: null, inspector: '华测检测', remark: '新到货待检' },
  { id: 'INV20260708', gradeCode: 'T30S', batchNo: '20260703-T30S-03', quantity: 2200, packageType: '25kg袋装', packages: 88000, location: 'B-02-02', warehouseArea: 'B区', inboundDate: '2026-07-03', producer: '中石化镇海炼化', mfr: 3.2, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260047', inspector: 'SGS宁波', remark: '下游塑编企业寄存' },
  { id: 'INV20260709', gradeCode: 'L5E89', batchNo: '20260705-L5E89-02', quantity: 350, packageType: '25kg袋装', packages: 14000, location: 'A-02-01', warehouseArea: 'A区', inboundDate: '2026-07-05', producer: '中石油兰州石化', mfr: 3.5, qualityStatus: '待检验', receiptNo: null, inspector: 'CCIC温州', remark: '' },
  { id: 'INV20260710', gradeCode: 'K7726H', batchNo: '20260706-K7726H-01', quantity: 300, packageType: '700kg吨袋', packages: 428, location: 'D-04-02', warehouseArea: 'D区', inboundDate: '2026-07-06', producer: '中石化燕山石化', mfr: 27.5, qualityStatus: '合格', receiptNo: null, inspector: '华测检测', remark: '台州汽车件客户' },
  { id: 'INV20260711', gradeCode: 'S1003', batchNo: '20260708-S1003-02', quantity: 1800, packageType: '25kg袋装', packages: 72000, location: 'B-02-03', warehouseArea: 'B区', inboundDate: '2026-07-08', producer: '中景石化（福清）', mfr: 2.8, qualityStatus: '合格', receiptNo: 'DCE-WZ-20260048', inspector: '华测检测', remark: '福建北上货源' },
  { id: 'INV20260712', gradeCode: 'T30S', batchNo: '20260710-T30S-04', quantity: 500, packageType: '25kg袋装', packages: 20000, location: 'A-02-02', warehouseArea: 'A区', inboundDate: '2026-07-10', producer: '中石化镇海炼化', mfr: 3.0, qualityStatus: '合格', receiptNo: null, inspector: 'SGS宁波', remark: '嘉兴汽运到货' },
];

// 生成货位数据
export const WAREHOUSE_LOCATIONS: WarehouseLocation[] = [
  { code: 'A-01', area: 'A区', capacity: 5000, used: 3500, status: '部分占用' },
  { code: 'A-02', area: 'A区', capacity: 3000, used: 850, status: '部分占用' },
  { code: 'B-01', area: 'B区', capacity: 4000, used: 0, status: '空闲' },
  { code: 'B-02', area: 'B区', capacity: 6000, used: 6000, status: '满仓' },
  { code: 'C-01', area: 'C区', capacity: 3000, used: 0, status: '空闲' },
  { code: 'C-02', area: 'C区', capacity: 3000, used: 0, status: '空闲' },
  { code: 'C-03', area: 'C区', capacity: 4000, used: 1600, status: '部分占用' },
  { code: 'D-01', area: 'D区', capacity: 3000, used: 0, status: '空闲' },
  { code: 'D-02', area: 'D区', capacity: 2000, used: 0, status: '空闲' },
  { code: 'D-03', area: 'D区', capacity: 2000, used: 0, status: '空闲' },
  { code: 'D-04', area: 'D区', capacity: 3000, used: 750, status: '部分占用' },
];

// 入库记录
export interface InboundRecord {
  id: string; date: string; gradeCode: string; batchNo: string;
  quantity: number; vehicleNo: string; origin: string; supplier: string; inspector: string;
}

export const INBOUND_RECORDS: InboundRecord[] = [
  { id: 'IB20260701', date: '2026-07-01', gradeCode: 'F401', batchNo: '20260701-F401-01', quantity: 450, vehicleNo: '闽C·56218', origin: '福建泉州', supplier: '中化石化', inspector: '华测检测' },
  { id: 'IB20260703', date: '2026-07-03', gradeCode: 'T30S', batchNo: '20260703-T30S-03', quantity: 2200, vehicleNo: '浙C·32105', origin: '宁波镇海', supplier: '镇海炼化', inspector: 'SGS宁波' },
  { id: 'IB20260705', date: '2026-07-05', gradeCode: 'L5E89', batchNo: '20260705-L5E89-02', quantity: 350, vehicleNo: '浙F·78231', origin: '嘉兴', supplier: '嘉兴PP粉料', inspector: 'CCIC温州' },
  { id: 'IB20260706', date: '2026-07-06', gradeCode: 'K7726H', batchNo: '20260706-K7726H-01', quantity: 300, vehicleNo: '浙J·12098', origin: '台州', supplier: '燕山石化', inspector: '华测检测' },
  { id: 'IB20260708', date: '2026-07-08', gradeCode: 'S1003', batchNo: '20260708-S1003-02', quantity: 1800, vehicleNo: '闽A·87653', origin: '福建福清', supplier: '中景石化', inspector: '华测检测' },
  { id: 'IB20260710', date: '2026-07-10', gradeCode: 'T30S', batchNo: '20260710-T30S-04', quantity: 500, vehicleNo: '浙F·45218', origin: '嘉兴', supplier: '镇海炼化', inspector: 'SGS宁波' },
];

// 出库记录
export interface OutboundRecord {
  id: string; date: string; gradeCode: string; batchNo: string;
  quantity: number; vehicleNo: string; destination: string; customer: string; purpose: string;
}

export const OUTBOUND_RECORDS: OutboundRecord[] = [
  { id: 'OB20260702', date: '2026-07-02', gradeCode: 'T30S', batchNo: '20260615-T30S-01', quantity: 200, vehicleNo: '浙C·55210', destination: '平阳萧江', customer: '温州华塑集团', purpose: '塑编生产' },
  { id: 'OB20260704', date: '2026-07-04', gradeCode: 'L5E89', batchNo: '20260618-L5E89-01', quantity: 150, vehicleNo: '浙C·33018', destination: '苍南灵溪', customer: '苍南塑编一厂', purpose: '塑编生产' },
  { id: 'OB20260705', date: '2026-07-05', gradeCode: 'T30S', batchNo: '20260615-T30S-01', quantity: 500, vehicleNo: '浙C·87215', destination: '龙港', customer: '金田集团', purpose: 'BOPP薄膜生产' },
  { id: 'OB20260707', date: '2026-07-07', gradeCode: 'S1003', batchNo: '20260620-S1003-01', quantity: 300, vehicleNo: '闽J·44521', destination: '福建宁德', customer: '宁德塑胶制品', purpose: '注塑制品' },
  { id: 'OB20260709', date: '2026-07-09', gradeCode: 'K8003', batchNo: '20260625-K8003-01', quantity: 100, vehicleNo: '浙J·78632', destination: '台州路桥', customer: '台州汽车配件', purpose: '汽车改性PP' },
  { id: 'OB20260711', date: '2026-07-11', gradeCode: 'T30S', batchNo: '20260703-T30S-03', quantity: 400, vehicleNo: '浙C·67512', destination: '平阳萧江', customer: '温州华塑集团', purpose: '塑编生产' },
];

// 库存统计数据
export const INVENTORY_STATS = {
  totalQuantity: 12700,       // 总库存 吨
  totalValue: 12700 * 7600,   // 总货值 元（按均价7600元/吨）
  capacityTotal: 38000,       // 总库容 吨
  capacityUsed: 12700,        // 已用库容
  capacityRate: 12700 / 38000,// 库容利用率
  qualityPassRate: 0.96,      // 质检合格率
  monthlyInbound: 5600,       // 本月入库
  monthlyOutbound: 2150,      // 本月出库
  receiptRegistered: 6,       // 已注册仓单数
  receiptPending: 3,          // 待注册仓单数
};
