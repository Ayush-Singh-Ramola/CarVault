import prisma from '../lib/prisma.js';

export async function listBrands() {
  return prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { cars: true } } },
  });
}