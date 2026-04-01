import { Request, Response } from 'express';
import prisma from '../prisma';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from '../config/s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
  try {
    const {
      title,
      author,
      publisher,
      description,
      publishedYear,
      isbn,
      pageCount,
      categoryId
    } = req.body;

    

    // 🔥 ambil file
    const files = req.files as {
      file?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    };

    const file = files?.file?.[0];
    const thumbnailFile = files?.thumbnail?.[0];

    // 🔒 validasi wajib
    if (!title || !author ||  !isbn || !file) {
      return res.status(400).json({
        error: "Title, author, categoryId, isbn, dan file PDF wajib"
      });
    }

    // 🔒 validasi PDF
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "File buku harus PDF" });
    }

    // =======================
    // 🔥 UPLOAD PDF
    // =======================
    const pdfExt = file.originalname.split(".").pop();
    const fileKey = `books/${Date.now()}.${pdfExt}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    // =======================
    // 🔥 UPLOAD THUMBNAIL (optional)
    // =======================
    let thumbnailKey: string | null = null;

    if (thumbnailFile) {
      if (!thumbnailFile.mimetype.startsWith("image/")) {
        return res.status(400).json({
          error: "Thumbnail harus berupa image"
        });
      }

      const thumbExt = thumbnailFile.originalname.split(".").pop();
      thumbnailKey = `thumbnails/${Date.now()}.${thumbExt}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.SUPABASE_BUCKET!,
          Key: thumbnailKey,
          Body: thumbnailFile.buffer,
          ContentType: thumbnailFile.mimetype,
        })
      );
    }

    // =======================
    // 🔥 SIMPAN KE DATABASE
    // =======================
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        description,
        publishedYear: Number(publishedYear),
        isbn,
        pageCount: Number(pageCount),
        categoryId: parseInt(categoryId, 10),

        fileKey: fileKey,
        fileName: file.originalname,
        thumbnail: thumbnailKey || null, 
      },
      
      include: { category: true }
    });

    return res.status(201).json(newBook);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// =======================
// GET FILE (SIGNED URL)
// =======================
export const getBookFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.SUPABASE_BUCKET!,
      Key: book.fileKey,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    res.json({ url });

  } catch (error) {
    res.status(500).json({ error: "Failed to get file" });
  }
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
