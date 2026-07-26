import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { STATUS_COLORS } from '@utils/chartColors';

export default function InventoryStatusChart({ inventoryStats }) {
  const chartData = [
    { name: 'Available', value: inventoryStats.available, status: 'AVAILABLE' },
    { name: 'Pending', value: inventoryStats.pending, status: 'PENDING' },
    { name: 'Sold', value: inventoryStats.sold, status: 'SOLD' },
    { name: 'Draft', value: inventoryStats.draft, status: 'DRAFT' },
  ].filter((d) => d.value > 0);

  return (
    <ChartCard title="Inventory Status" subtitle="Breakdown of listing statuses" height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={2}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}