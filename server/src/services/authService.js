import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../lib/jwt.js';

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  phone: true,
  createdAt: true,
};

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: SAFE_USER_SELECT,
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const token = signToken({ id: user.id, role: user.role });
  const { password: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: SAFE_USER_SELECT,
  });
  if (!user) throw AppError.notFound('User not found');
  return user;
}

export async function updateUserProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: SAFE_USER_SELECT,
  });
}

export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw AppError.unauthorized('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
}