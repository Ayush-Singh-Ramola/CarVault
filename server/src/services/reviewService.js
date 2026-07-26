import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { getSkipTake, buildPaginationMeta } from '../utils/pagination.js';

const REVIEW_USER_SELECT = { id: true, name: true, avatarUrl: true };

async function recalculateCarRating(carId) {
  const agg = await prisma.review.aggregate({
    where: { carId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.car.update({
    where: { id: carId },
    data: { avgRating: agg._avg.rating || 0, reviewCount: agg._count.rating },
  });
}

export async function listReviewsForCar(carId, { page, limit }) {
  const { skip, take } = getSkipTake(page, limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { carId },
      orderBy: { createdAt: 'desc' },
      skip, take,
      include: { user: { select: REVIEW_USER_SELECT } },
    }),
    prisma.review.count({ where: { carId } }),
  ]);

  return { reviews, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function upsertReview(userId, carId, { rating, comment }) {
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) throw AppError.notFound('Car not found');

  const review = await prisma.review.upsert({
    where: { userId_carId: { userId, carId } },
    create: { userId, carId, rating, comment },
    update: { rating, comment },
    include: { user: { select: REVIEW_USER_SELECT } },
  });

  await recalculateCarRating(carId);
  return review;
}

export async function deleteReview(userId, reviewId, isAdmin) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw AppError.notFound('Review not found');

  if (review.userId !== userId && !isAdmin) {
    throw AppError.forbidden('You can only delete your own reviews');
  }

  await prisma.review.delete({ where: { id: reviewId } });
  await recalculateCarRating(review.carId);
}