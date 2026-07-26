import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { CHART_COLORS } from '@utils/chartColors';

export default function CarsByYearChart({ data }) {
  return (
    <ChartCard title="Cars by Model Year" subtitle="Inventory distribution across years">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" />
          <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
          <Bar dataKey="count" name="Cars" fill={CHART_COLORS.purple} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}