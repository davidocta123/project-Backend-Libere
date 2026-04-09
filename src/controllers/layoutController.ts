import { Request, Response } from 'express';
import prisma from '../prisma';

export const getLayout = async (req: Request, res: Response) => {
  const layout = await prisma.libraryLayout.findFirst({
    include: {
      categories: true,
      featuredBooks: {
        include: { category: true }
      }
    }
  });

  if (!layout) {
    return res.status(404).json({ error: 'Library layout not found' });
  }

  res.json(layout);
};

export const updateLayout = async (req: Request, res: Response) => {
  const { heroText, heroImg, featuredBookIds, categoryIds } = req.body;

  try {
    // pastikan layout ada (kalau tidak → buat)
    let layout = await prisma.libraryLayout.findFirst();

    if (!layout) {
      layout = await prisma.libraryLayout.create({
        data: {
          heroText: heroText || "",
          heroImg: heroImg || ""
        }
      });
    }

    // validasi categoryIds (optional tapi bagus)
    if (categoryIds) {
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } }
      });

      if (categories.length !== categoryIds.length) {
        return res.status(400).json({ error: 'Invalid categoryIds' });
      }
    }

    // validasi featuredBookIds
    if (featuredBookIds) {
      const books = await prisma.book.findMany({
        where: { id: { in: featuredBookIds } }
      });

      if (books.length !== featuredBookIds.length) {
        return res.status(400).json({ error: 'Invalid featuredBookIds' });
      }
    }

    // update
    const updatedLayout = await prisma.libraryLayout.update({
      where: { id: layout.id },
      data: {
        ...(heroText !== undefined && { heroText }),
        ...(heroImg !== undefined && { heroImg }),

        ...(categoryIds !== undefined && { 
          categories: {
            set: categoryIds.map((id: number) => ({ id }))
          } 
        }), 

        ...(featuredBookIds !== undefined && {
          featuredBooks: {
            set: featuredBookIds.map((id: number) => ({ id }))
          }
        })
      }, 
      include: {
        categories: true,
        featuredBooks: true
      }
    });

    res.json(updatedLayout);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};