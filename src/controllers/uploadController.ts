// import { Request, Response } from "express";
// import { uploadToPinata } from "../services/pinataService";
// import prisma from "../prisma";

// export const uploadFile = async (req: Request, res: Response) => {
//   try {

//     // cek apakah file ada
//     if (!req.file) {
//       return res.status(400).json({
//         message: "File tidak ditemukan"
//       });
//     }

//     // ambil path file dari multer
//     const filePath = req.file.path;

//     // upload ke Pinata
//     const result = await uploadToPinata(filePath);

//     const cid = result.data.cid;

//     // simpan ke database
//     const file = await prisma.file.create({
//       data: {
//         cid: cid,
//         fileName: req.file.originalname,
//         // ownerId: (req as any).user.userId // pastikan user sudah di-attach ke req oleh middleware auth
//         ownerId: "user123" 
//       }
//     });

//     res.json({
//       message: "Upload berhasil",
//       file
//     });

//   } catch (err) {

//     console.error("Upload error:", err);

//     res.status(500).json({
//       message: "Upload gagal"
//     });

//   }
// };