import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { getSkipTake, buildPaginationMeta } from '../utils/pagination.js';
import { deleteImageFile } from './uploadService.js';
import { getFavoritedCarIdSet } from './favoriteService.js';

const CAR_FIELDS = [
  'title', 'model', 'year', 'price', 'mileage', 'color', 'description',
  'fuelType', 'transmission', 'bodyType', 'status', 'isFeatured',
];

const SPEC_FIELDS = [
  'engine', 'horsepower', 'torqueNm', 'drivetrain', 'seatingCapacity',
  'doors', 'safetyRating', 'acceleration0to60', 'topSpeedKmh',
  'fuelTankCapacityL', 'fuelEconomyKmpl', 'weightKg', 'features',
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function generateUniqueSlug(base) {
  const root = slugify(base);
  let slug = root;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.car.findUnique({ where: { slug } })) {
    slug = `${root}-${counter++}`;
  }
  return slug;
}

function buildWhereClause(query) {
  const {
    search, brandId, fuelType, transmission, bodyType,
    minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
    status, featured,
  } = query;

  const where = {};
  where.status = status || { not: 'DRAFT' };

  if (featured !== undefined) where.isFeatured = featured;
  if (brandId?.length) where.brandId = { in: brandId };
  if (fuelType?.length) where.fuelType = { in: fuelType };
  if (transmission?.length) where.transmission = { in: transmission };
  if (bodyType?.length) where.bodyType = { in: bodyType };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (minYear !== undefined || maxYear !== undefined) {
    where.year = {};
    if (minYear !== undefined) where.year.gte = minYear;
    if (maxYear !== undefined) where.year.lte = maxYear;
  }
  if (minMileage !== undefined || maxMileage !== undefined) {
    where.mileage = {};
    if (minMileage !== undefined) where.mileage.gte = minMileage;
    if (maxMileage !== undefined) where.mileage.lte = maxMileage;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return where;
}

function buildOrderBy(sortBy) {
  switch (sortBy) {
    case 'price_asc': return { price: 'asc' };
    case 'price_desc': return { price: 'desc' };
    case 'mileage_asc': return { mileage: 'asc' };
    case 'mileage_desc': return { mileage: 'desc' };
    case 'oldest': return { createdAt: 'asc' };
    case 'newest':
    default: return { createdAt: 'desc' };
  }
}

export async function listCars(query, userId) {
  const where = buildWhereClause(query);
  const orderBy = buildOrderBy(query.sortBy);
  const { skip, take } = getSkipTake(query.page, query.limit);

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where, orderBy, skip, take,
      include: {
        brand: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    }),
    prisma.car.count({ where }),
  ]);

  const favoritedIds = await getFavoritedCarIdSet(userId, cars.map((c) => c.id));
  const carsWithFavorites = cars.map((c) => ({ ...c, isFavorited: favoritedIds.has(c.id) }));

  return {
    cars: carsWithFavorites,
    meta: buildPaginationMeta({ page: query.page, limit: query.limit, total }),
  };
}

export async function getCarBySlugOrId(identifier, userId) {
  const car = await prisma.car.findFirst({
    where: { OR: [{ slug: identifier }, { id: identifier }] },
    include: {
      brand: true,
      images: { orderBy: { order: 'asc' } },
      specifications: true,
      createdBy: { select: { id: true, name: true } },
    },
  });
  if (!car) throw AppError.notFound('Car not found');

  const favoritedIds = await getFavoritedCarIdSet(userId, [car.id]);
  return { ...car, isFavorited: favoritedIds.has(car.id) };
}

export async function createCar(data, uploadedImages) {
  const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
  if (!brand) throw AppError.badRequest('Selected brand does not exist');

  const slug = await generateUniqueSlug(`${data.year}-${brand.name}-${data.model}`);

  const carData = Object.fromEntries(
    CAR_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );
  const specData = Object.fromEntries(
    SPEC_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );

  const car = await prisma.car.create({
    data: {
      ...carData,
      slug,
      brand: { connect: { id: data.brandId } },
      specifications: { create: { ...specData, features: specData.features || [] } },
      images: {
        create: uploadedImages.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: i === 0,
          order: i,
        })),
      },
    },
    include: { brand: true, images: true, specifications: true },
  });

  return car;
}

export async function updateCar(id, data, uploadedImages = []) {
  const existing = await prisma.car.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Car not found');

  if (data.brandId) {
    const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
    if (!brand) throw AppError.badRequest('Selected brand does not exist');
  }

  const carData = Object.fromEntries(
    CAR_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );
  const specData = Object.fromEntries(
    SPEC_FIELDS.filter((f) => data[f] !== undefined).map((f) => [f, data[f]])
  );

  const existingImageCount = await prisma.image.count({ where: { carId: id } });

  const car = await prisma.car.update({
    where: { id },
    data: {
      ...carData,
      ...(data.brandId && { brand: { connect: { id: data.brandId } } }),
      ...(Object.keys(specData).length > 0 && {
        specifications: {
          upsert: { create: specData, update: specData },
        },
      }),
      ...(uploadedImages.length > 0 && {
        images: {
          create: uploadedImages.map((img, i) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: existingImageCount === 0 && i === 0,
            order: existingImageCount + i,
          })),
        },
      }),
    },
    include: { brand: true, images: { orderBy: { order: 'asc' } }, specifications: true },
  });

  return car;
}

export async function deleteCar(id) {
  const car = await prisma.car.findUnique({ where: { id }, include: { images: true } });
  if (!car) throw AppError.notFound('Car not found');

  await Promise.all(car.images.map((img) => deleteImageFile(img)));
  await prisma.car.delete({ where: { id } });
}

export async function deleteCarImage(carId, imageId) {
  const image = await prisma.image.findFirst({ where: { id: imageId, carId } });
  if (!image) throw AppError.notFound('Image not found');

  await deleteImageFile(image);
  await prisma.image.delete({ where: { id: imageId } });

  const wasPrimary = image.isPrimary;
  if (wasPrimary) {
    const nextImage = await prisma.image.findFirst({
      where: { carId },
      orderBy: { order: 'asc' },
    });
    if (nextImage) {
      await prisma.image.update({ where: { id: nextImage.id }, data: { isPrimary: true } });
    }
  }
}