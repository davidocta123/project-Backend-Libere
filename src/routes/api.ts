import { Router } from 'express';
import multer from 'multer';

import {
  getBooks,
  addBook,
  removeBook,
  toggleHideBook,
  getBookFile
} from '../controllers/bookController';

import { getLayout, updateLayout } from '../controllers/layoutController';

const router = Router();

// 🔥 multer config
const upload = multer({
  storage: multer.memoryStorage(),
//   limits: { fileSize: 50 * 1024 * 1024 }, // optional (50MB)
});

// =======================
// PUBLIC ROUTES
// =======================
router.get('/public/layout', getLayout);
router.get('/books', getBooks);
router.get('/books/:id/file', getBookFile);

// =======================
// ADMIN BOOKS
// =======================
router.post(
  '/admin/books',
  upload.fields([
    { name: "file", maxCount: 1 },        // PDF
    { name: "thumbnail", maxCount: 1 }    // image
  ]),
  addBook
);

router.delete('/admin/books/:id', removeBook);
router.patch('/admin/books/:id/status', toggleHideBook);

// =======================
// ADMIN LAYOUT
// =======================
router.put('/admin/layout', updateLayout);

export default router;