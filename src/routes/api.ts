import { Router } from 'express';
import { getBooks, addBook, removeBook, toggleHideBook } from '../controllers/bookController';
import { getLayout, updateLayout } from '../controllers/layoutController';

const router = Router();

// Public Routes
router.get('/public/layout', getLayout);
router.get('/books', getBooks);

// Admin Routes (Books)
router.post('/admin/books', addBook);
router.delete('/admin/books/:id', removeBook);
router.patch('/admin/books/:id/status', toggleHideBook);

// Admin Routes (Layout)
router.put('/admin/layout', updateLayout);

export default router;
