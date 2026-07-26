import { z } from 'zod';

const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUG_IN_HYBRID', 'CNG'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT'];
const BODY_TYPES = [
  'SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE',
  'WAGON', 'PICKUP_TRUCK', 'MINIVAN', 'CROSSOVER',
];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', 'FOUR_WD'];
const CAR_STATUSES = ['AVAILABLE', 'SOLD', 'PENDING', 'DRAFT'];
const SORT_OPTIONS = ['newest', 'oldest', 'price_asc', 'price_desc', 'mileage_asc', 'mileage_desc'];

function csvEnum(values) {
  return z.preprocess((val) => {
    if (val === undefined || val === '') return undefined;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return val;
  }, z.array(z.enum(values)).optional());
}

function csvString() {
  return z.preprocess((val) => {
    if (val === undefined || val === '') return undefined;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return val;
  }, z.array(z.string()).optional());
}

export const carQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  brandId: csvString(),
  fuelType: csvEnum(FUEL_TYPES),
  transmission: csvEnum(TRANSMISSIONS),
  bodyType: csvEnum(BODY_TYPES),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
  minMileage: z.coerce.number().nonnegative().optional(),
  maxMileage: z.coerce.number().nonnegative().optional(),
  status: z.enum(CAR_STATUSES).optional(),
  featured: z.coerce.boolean().optional(),
  sortBy: z.enum(SORT_OPTIONS).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(48).optional().default(12),
});

const featuresField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  });

const baseCarFields = {
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce
    .number()
    .int()
    .min(1980, 'Year must be 1980 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  mileage: z.coerce.number().nonnegative('Mileage cannot be negative'),
  color: z.string().trim().optional(),
  description: z.string().trim().max(2000).optional(),
  fuelType: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSIONS),
  bodyType: z.enum(BODY_TYPES),
  brandId: z.string().min(1, 'Brand is required'),
  status: z.enum(CAR_STATUSES).optional(),
  isFeatured: z.coerce.boolean().optional(),

  engine: z.string().trim().optional(),
  horsepower: z.coerce.number().int().positive().optional(),
  torqueNm: z.coerce.number().int().positive().optional(),
  drivetrain: z.enum(DRIVE_TYPES).optional(),
  seatingCapacity: z.coerce.number().int().min(1).max(15).optional(),
  doors: z.coerce.number().int().min(2).max(6).optional(),
  safetyRating: z.coerce.number().min(0).max(5).optional(),
  acceleration0to60: z.coerce.number().positive().optional(),
  topSpeedKmh: z.coerce.number().int().positive().optional(),
  fuelTankCapacityL: z.coerce.number().positive().optional(),
  fuelEconomyKmpl: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().int().positive().optional(),
  features: featuresField,
};

export const createCarSchema = z.object(baseCarFields);

export const updateCarSchema = z.object(
  Object.fromEntries(
    Object.entries(baseCarFields).map(([key, schema]) => [
      key,
      key === 'features' ? schema : schema.optional(),
    ])
  )
);