import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../lib/cloudinary.js';
import env from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

export async function processUploadedFiles(files = []) {
  if (!files.length) return [];

  if (env.USE_CLOUDINARY) {
    return Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'carvault',
        });
        await fs.unlink(file.path).catch(() => {});
        return { url: result.secure_url, publicId: result.public_id };
      })
    );
  }

  return files.map((file) => ({ url: `/uploads/${file.filename}`, publicId: null }));
}

export async function deleteImageFile(image) {
  try {
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    } else if (image.url?.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(image.url));
      await fs.unlink(filePath);
    }
  } catch {
    // File already gone or Cloudinary unreachable — not fatal.
  }
}