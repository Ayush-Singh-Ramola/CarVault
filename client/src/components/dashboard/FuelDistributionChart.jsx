import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import { FUEL_TYPE_COLORS } from '@utils/chartColors';
import { labelFor, FUEL_TYPES } from '@utils/constants';

export default function FuelDistributionChart({ data }) {
  const chartData = data.map((d) => ({
    name: labelFor(FUEL_TYPES, d.fuelType),
    value: d.count,
    fuelType: d.fuelType,
  }));

  return (
    <ChartCard title="Fuel Type Distribution" subtitle="Share of inventory by fuel type">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.fuelType}
                fill={FUEL_TYPE_COLORS[entry.fuelType] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}