// PP牌号及质量标准（大商所聚丙烯期货交割标准）
// 参考：GB/T 12670《聚丙烯(PP)树脂》/ 大商所PP期货业务细则

export interface PPGradeInfo {
  code: string;
  name: string;
  category: '拉丝' | '共聚' | '薄膜' | '透明' | '纤维' | '注塑';
  mfrRange: string;       // 熔融指数范围 g/10min
  tensileStrength: string;// 拉伸强度 MPa
  impactStrength: string; // 简支梁冲击强度 kJ/m²
  ashContent: string;     // 灰分 %
  producer: string;
  isDelivery: boolean;    // 是否可用于期货交割
  marketPrice: number;    // 市场参考价 元/吨
}

export const PP_GRADES: PPGradeInfo[] = [
  {
    code: 'T30S', name: 'T30S 拉丝级', category: '拉丝',
    mfrRange: '2.5-3.5', tensileStrength: '≥32', impactStrength: '≥2.5',
    ashContent: '≤0.03', producer: '中石化镇海炼化', isDelivery: true,
    marketPrice: 7550,
  },
  {
    code: 'L5E89', name: 'L5E89 拉丝级', category: '拉丝',
    mfrRange: '2.8-3.8', tensileStrength: '≥31', impactStrength: '≥2.3',
    ashContent: '≤0.03', producer: '中石油兰州石化', isDelivery: true,
    marketPrice: 7480,
  },
  {
    code: 'S1003', name: 'S1003 拉丝级', category: '拉丝',
    mfrRange: '2.5-3.5', tensileStrength: '≥32', impactStrength: '≥2.5',
    ashContent: '≤0.03', producer: '中景石化（福清）', isDelivery: true,
    marketPrice: 7420,
  },
  {
    code: 'K8003', name: 'K8003 共聚级', category: '共聚',
    mfrRange: '2.0-3.0', tensileStrength: '≥26', impactStrength: '≥25',
    ashContent: '≤0.04', producer: '中石化扬子石化', isDelivery: true,
    marketPrice: 8120,
  },
  {
    code: 'EPS30R', name: 'EPS30R 共聚级', category: '共聚',
    mfrRange: '1.5-2.5', tensileStrength: '≥25', impactStrength: '≥30',
    ashContent: '≤0.04', producer: '中石化齐鲁石化', isDelivery: true,
    marketPrice: 8250,
  },
  {
    code: 'M800E', name: 'M800E 透明级', category: '透明',
    mfrRange: '7.0-9.0', tensileStrength: '≥30', impactStrength: '≥3.0',
    ashContent: '≤0.02', producer: '中石化上海石化', isDelivery: false,
    marketPrice: 8900,
  },
  {
    code: 'F401', name: 'F401 薄膜级', category: '薄膜',
    mfrRange: '2.0-3.0', tensileStrength: '≥34', impactStrength: '≥2.5',
    ashContent: '≤0.03', producer: '中化石化（泉州）', isDelivery: true,
    marketPrice: 7680,
  },
  {
    code: 'Y26', name: 'Y26 纤维级', category: '纤维',
    mfrRange: '24-28', tensileStrength: '≥32', impactStrength: '≥2.0',
    ashContent: '≤0.02', producer: '中石化济南石化', isDelivery: false,
    marketPrice: 7950,
  },
  {
    code: 'K7726H', name: 'K7726H 注塑级', category: '注塑',
    mfrRange: '25-30', tensileStrength: '≥28', impactStrength: '≥4.0',
    ashContent: '≤0.03', producer: '中石化燕山石化', isDelivery: true,
    marketPrice: 8350,
  },
];

// 质检标准（大商所PP期货交割质量标准）
export const DELIVERY_STANDARDS = {
  mfr: { name: '熔体质量流动速率(MFR)', unit: 'g/10min', standard: '2.0-4.0', method: 'GB/T 3682' },
  tensileYield: { name: '拉伸屈服应力', unit: 'MPa', standard: '≥30', method: 'GB/T 1040.2' },
  impact: { name: '简支梁缺口冲击强度', unit: 'kJ/m²', standard: '≥2.0', method: 'GB/T 1043.1' },
  ash: { name: '灰分', unit: '%', standard: '≤0.04', method: 'GB/T 9345.1' },
  contamination: { name: '黑粒', unit: '个/kg', standard: '≤5', method: '目测' },
  yellowness: { name: '黄色指数', unit: '—', standard: '≤4.0', method: 'HG/T 3862' },
};

// 第三方质检机构
export const INSPECTION_AGENCIES = [
  { id: 1, name: 'SGS通标标准技术服务有限公司', contact: '021-61196488', location: '宁波分公司' },
  { id: 2, name: '中国检验认证集团(CCIC)', contact: '0577-88325888', location: '温州分公司' },
  { id: 3, name: '华测检测认证集团(CTI)', contact: '0571-28032000', location: '杭州分公司' },
];

// 大商所交割部联系方式
export const DCE_CONTACTS = {
  delivery_dept: { name: '交割部', contacts: ['唐二宏 0411-84807087', '陈秋爽 0411-84808647'] },
  group_warehouse: { name: '集团交割工作组', contacts: ['夏夏 0411-84808707', '孙天仪 0411-84808263'] },
  address: '辽宁省大连市沙河口区会展路129号期货大厦',
  website: 'www.dce.com.cn',
};
