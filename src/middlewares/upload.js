import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const tempDir = path.join(process.cwd(), 'temp');
    try {
      // Перевіряємо чи існує директорія, якщо ні - створюємо
      await fs.access(tempDir).catch(() => fs.mkdir(tempDir));
      cb(null, tempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniquePrefix + '-' + file.originalname;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createHttpError(415, 'Unsupported file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});