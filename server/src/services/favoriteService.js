import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { getSkipTake, buildPaginationMeta } from '../utils/pagination.js';

export async function addFavorite(userId, carId) {
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) throw AppError.notFound('Car not found');

  const existing = await prisma.favorite.findUnique({
    where: { userId_carId: { userId, carId } },
  });
  if (existing) throw AppError.conflict('Car is already in your favorites');

  await prisma.favorite.create({ data: { userId, carId } });
}

export async function removeFavorite(userId, carId) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_carId: { userId, carId } },
  });
  if (!existing) throw AppError.notFound('This car is not in your favorites');

  await prisma.favorite.delete({ where: { id: existing.id } });
}

export async function listFavorites(userId, { page, limit }) {
  const { skip, take } = getSkipTake(page, limit);

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip, take,
      include: {
        car: {
          include: {
            brand: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
      },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);

  const cars = favorites.map((f) => ({ ...f.car, isFavorited: true, favoritedAt: f.createdAt }));
  return { cars, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getFavoritedCarIdSet(userId, carIds) {
  if (!userId || !carIds.length) return new Set();
  const favorites = await prisma.favorite.findMany({
    where: { userId, carId: { in: carIds } },
    select: { carId: true },
  });
  return new Set(favorites.map((f) => f.carId));
}