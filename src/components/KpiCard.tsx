import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  prefix?: ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
  extra?: ReactNode;
}

export default function KpiCard({ title, value, prefix, suffix, valueStyle, extra }: KpiCardProps) {
  return (
    <Card hoverable style={{ borderRadius: 8 }}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ fontSize: 28, fontWeight: 700, ...valueStyle }}
      />
      {extra && <div style={{ marginTop: 8 }}>{extra}</div>}
    </Card>
  );
}
