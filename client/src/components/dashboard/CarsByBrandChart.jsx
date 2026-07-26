import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { CHART_PALETTE } from '@utils/chartColors';

export default function CarsByBrandChart({ data }) {
  const chartData = [...data].sort((a, b) => b.carCount - a.carCount).slice(0, 8);

  return (
    <ChartCard title="Cars per Brand" subtitle="Inventory count by manufacturer">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
          <XAxis
            dataKey="brand"
            tick={{ fontSize: 11 }}
            stroke="currentColor"
            className="text-gray-400"
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Bar dataKey="carCount" name="Cars" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}