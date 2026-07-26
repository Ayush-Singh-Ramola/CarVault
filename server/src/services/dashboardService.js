import prisma from '../lib/prisma.js';

const NON_DRAFT = { status: { not: 'DRAFT' } };

async function getBrandStats() {
  const [grouped, brands] = await Promise.all([
    prisma.car.groupBy({
      by: ['brandId'],
      where: NON_DRAFT,
      _count: { _all: true },
      _avg: { price: true },
    }),
    prisma.brand.findMany({ select: { id: true, name: true } }),
  ]);

  const brandNameById = new Map(brands.map((b) => [b.id, b.name]));

  return grouped
    .map((g) => ({
      brandId: g.brandId,
      brand: brandNameById.get(g.brandId) || 'Unknown',
      carCount: g._count._all,
      avgPrice: g._avg.price ? Math.round(Number(g._avg.price)) : 0,
    }))
    .sort((a, b) => b.carCount - a.carCount);
}

async function getCarsByYear() {
  const grouped = await prisma.car.groupBy({
    by: ['year'],
    where: NON_DRAFT,
    _count: { _all: true },
    orderBy: { year: 'asc' },
  });
  return grouped.map((g) => ({ year: g.year, count: g._count._all }));
}

async function getFuelDistribution() {
  const grouped = await prisma.car.groupBy({
    by: ['fuelType'],
    where: NON_DRAFT,
    _count: { _all: true },
  });
  return grouped.map((g) => ({ fuelType: g.fuelType, count: g._count._all }));
}

async function getMonthlyAddedCars() {
  const rows = await prisma.$queryRaw`
    SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
           COUNT(*)::int AS count
    FROM cars
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `;

  const countByMonth = new Map(rows.map((r) => [r.month, r.count]));

  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      month: key,
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count: countByMonth.get(key) || 0,
    });
  }
  return months;
}

async function getInventoryStats() {
  const [
    totalCars, available, sold, pending, draft, priceAgg,
    brandCount, userCount, favoriteCount, reviewCount,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: 'AVAILABLE' } }),
    prisma.car.count({ where: { status: 'SOLD' } }),
    prisma.car.count({ where: { status: 'PENDING' } }),
    prisma.car.count({ where: { status: 'DRAFT' } }),
    prisma.car.aggregate({ where: NON_DRAFT, _sum: { price: true }, _avg: { price: true } }),
    prisma.brand.count(),
    prisma.user.count(),
    prisma.favorite.count(),
    prisma.review.count(),
  ]);

  return {
    totalCars, available, sold, pending, draft,
    totalInventoryValue: priceAgg._sum.price ? Math.round(Number(priceAgg._sum.price)) : 0,
    avgPrice: priceAgg._avg.price ? Math.round(Number(priceAgg._avg.price)) : 0,
    brandCount, userCount, favoriteCount, reviewCount,
  };
}

export async function getDashboardOverview() {
  const [carsByBrand, carsByYear, fuelDistribution, monthlyAddedCars, inventoryStats] =
    await Promise.all([
      getBrandStats(),
      getCarsByYear(),
      getFuelDistribution(),
      getMonthlyAddedCars(),
      getInventoryStats(),
    ]);

  return { carsByBrand, carsByYear, fuelDistribution, monthlyAddedCars, inventoryStats };
}