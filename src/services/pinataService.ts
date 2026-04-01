// import axios from "axios";
// import FormData from "form-data";
// import fs from "fs";

// export const uploadToPinata = async (filePath: string) => {

//   const data = new FormData();

//   data.append("file", fs.createReadStream(filePath)); //

//   const res = await axios.post(
//     "https://uploads.pinata.cloud/v3/files",
//     data,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.VITE_PINATA_JWT}`,
//         ...data.getHeaders()
//       }
//     }
//   );

//   return res.data;

// };