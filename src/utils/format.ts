// 格式化工具函数

/** 格式化数字为千分位 */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** 格式化金额（万元） */
export function formatMoney(n: number): string {
  if (Math.abs(n) >= 10000) {
    return `${(n / 10000).toFixed(2)} 万元`;
  }
  return `${n.toFixed(2)} 元`;
}

/** 格式化吨数 */
export function formatTons(n: number): string {
  if (n >= 10000) {
    return `${(n / 10000).toFixed(2)} 万吨`;
  }
  return `${formatNumber(n)} 吨`;
}

/** 格式化百分比 */
export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** 格式化日期 */
export function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('zh-CN');
}

/** 格式化日期时间 */
export function formatDateTime(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleString('zh-CN');
}

/** 获取状态标签颜色 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    '正常': 'green', '已注册': 'green', '已完成': 'green', '合格': 'green',
    '已质押': 'blue', '交割中': 'blue', '待检验': 'orange', '待审核': 'orange',
    '异常': 'red', '已注销': 'default', '过期': 'red', '不合格': 'red',
  };
  return map[status] || 'default';
}
