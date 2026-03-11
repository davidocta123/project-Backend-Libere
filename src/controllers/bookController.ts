import { Request, Response } from 'express';
import prisma from '../prisma';

export const getBooks = async (req: Request, res: Response) => {
  // Get all books for admin, or just visible ones for public depending on use case.
  // For library catalog usually we show non-hidden books.
  const books = await prisma.book.findMany({
    where: { isHidden: false },
    include: { category: true }
  });
  res.json(books);
};

export const addBook = async (req: Request, res: Response) => {
  const { title, author, categoryId, image } = req.body;
  if (!title || !author || !categoryId) {
    return res.status(400).json({ error: 'Title, author, and categoryId are required' });
  }

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      categoryId: parseInt(categoryId, 10),
      image
    },
    include: { category: true }
  });
  
  res.status(201).json(newBook);
};

export const removeBook = async (req: Request, res: Response) => {
  const id = req.params.id;
  
  try {
    const deletedBook = await prisma.book.delete({
      where: { id: parseInt(id as string, 10) }
    });
    res.json({ message: 'Book removed successfully', deletedBook });
  } catch (error) {
    res.status(404).json({ error: 'Book not found' });
  }
};

export const toggleHideBook = async (req: Request, res: Response) => {
  const id = req.params.id;
  
  const book = await prisma.book.findUnique({ where: { id: parseInt(id as string, 10) } });
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const updatedBook = await prisma.book.update({
    where: { id: parseInt(id as string, 10) },
    data: { isHidden: !book.isHidden }
  });

  res.json(updatedBook);
};
