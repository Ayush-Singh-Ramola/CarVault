import { Car, DollarSign, Tag, Users, Heart, MessageSquare } from 'lucide-react';
import { useDashboardStats } from '@hooks/useDashboardStats';
import StatCard from '@components/dashboard/StatCard';
import CarsByBrandChart from '@components/dashboard/CarsByBrandChart';
import AvgPriceByBrandChart from '@components/dashboard/AvgPriceByBrandChart';
import CarsByYearChart from '@components/dashboard/CarsByYearChart';
import FuelDistributionChart from '@components/dashboard/FuelDistributionChart';
import MonthlyAddedChart from '@components/dashboard/MonthlyAddedChart';
import InventoryStatusChart from '@components/dashboard/InventoryStatusChart';
import { DashboardSkeleton } from '@components/ui/Skeleton';
import { formatCurrency, formatNumber } from '@utils/formatters';

export default function AdminDashboard() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500 text-sm">
        Failed to load dashboard data: {error}
      </div>
    );
  }

  const { inventoryStats, carsByBrand, carsByYear, fuelDistribution, monthlyAddedCars } = data;

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your CarVault inventory and activity
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          icon={<Car size={18} />}
          label="Total Cars"
          value={formatNumber(inventoryStats.totalCars)}
          subtext={`${inventoryStats.available} available`}
          accent="primary"
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Inventory Value"
          value={formatCurrency(inventoryStats.totalInventoryValue)}
          subtext={`Avg ${formatCurrency(inventoryStats.avgPrice)}`}
          accent="green"
        />
        <StatCard
          icon={<Tag size={18} />}
          label="Brands"
          value={formatNumber(inventoryStats.brandCount)}
          accent="amber"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Users"
          value={formatNumber(inventoryStats.userCount)}
          accent="accent"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Car size={16} />} label="Sold" value={formatNumber(inventoryStats.sold)} accent="primary" />
        <StatCard icon={<Car size={16} />} label="Pending" value={formatNumber(inventoryStats.pending)} accent="amber" />
        <StatCard icon={<Heart size={16} />} label="Total Favorites" value={formatNumber(inventoryStats.favoriteCount)} accent="accent" />
        <StatCard icon={<MessageSquare size={16} />} label="Total Reviews" value={formatNumber(inventoryStats.reviewCount)} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <CarsByBrandChart data={carsByBrand} />
        <AvgPriceByBrandChart data={carsByBrand} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <MonthlyAddedChart data={monthlyAddedCars} />
        <CarsByYearChart data={carsByYear} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FuelDistributionChart data={fuelDistribution} />
        <InventoryStatusChart inventoryStats={inventoryStats} />
      </div>
    </div>
  );
}