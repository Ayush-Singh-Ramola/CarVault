import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { CHART_COLORS } from '@utils/chartColors';

export default function MonthlyAddedChart({ data }) {
  return (
    <ChartCard title="Monthly Added Cars" subtitle="Inventory growth over the last 12 months">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="monthlyAddedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" />
          <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            name="Cars added"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            fill="url(#monthlyAddedGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}