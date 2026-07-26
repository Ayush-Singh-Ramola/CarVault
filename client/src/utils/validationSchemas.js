import { z } from 'zod';

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginFormSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().optional().or(z.literal('')),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

const numberOrUndefined = () =>
  z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  );

export const carFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive('Price must be greater than 0'),
  mileage: z.coerce.number().nonnegative('Mileage cannot be negative'),
  color: z.string().trim().optional(),
  description: z.string().trim().max(2000).optional(),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  bodyType: z.string().min(1, 'Body type is required'),
  brandId: z.string().min(1, 'Brand is required'),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),

  engine: z.string().trim().optional(),
  horsepower: numberOrUndefined(),
  torqueNm: numberOrUndefined(),
  drivetrain: z.string().optional(),
  seatingCapacity: numberOrUndefined(),
  doors: numberOrUndefined(),
  safetyRating: numberOrUndefined(),
  acceleration0to60: numberOrUndefined(),
  topSpeedKmh: numberOrUndefined(),
  fuelTankCapacityL: numberOrUndefined(),
  fuelEconomyKmpl: numberOrUndefined(),
  weightKg: numberOrUndefined(),
  features: z.string().optional(),
});