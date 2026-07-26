import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { CHART_COLORS } from '@utils/chartColors';
import { formatCurrency } from '@utils/formatters';

export default function AvgPriceByBrandChart({ data }) {
  const chartData = [...data].sort((a, b) => b.avgPrice - a.avgPrice).slice(0, 8);

  return (
    <ChartCard title="Average Price by Brand" subtitle="Mean listing price per manufacturer">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            stroke="currentColor"
            className="text-gray-400"
            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
          />
          <YAxis
            type="category"
            dataKey="brand"
            tick={{ fontSize: 11 }}
            stroke="currentColor"
            className="text-gray-400"
            width={80}
          />
          <Tooltip content={<ChartTooltip formatter={formatCurrency} />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Bar dataKey="avgPrice" name="Avg. Price" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}