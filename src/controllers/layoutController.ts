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
  
  const existingLayout = await prisma.libraryLayout.findFirst();

  if (!existingLayout) {
    return res.status(404).json({ error: 'Library layout not initialized' });
  }

  const updatedLayout = await prisma.libraryLayout.update({
    where: { id: existingLayout.id },
    data: {
      ...(heroText !== undefined && { heroText }),
      ...(heroImg !== undefined && { heroImg }),
      ...(featuredBookIds && {
        featuredBooks: {
          set: featuredBookIds.map((id: number) => ({ id }))
        }
      }),
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((id: number) => ({ id }))
        }
      })
    },
    include: {
      categories: true,
      featuredBooks: true
    }
  });

  res.json(updatedLayout);
};
