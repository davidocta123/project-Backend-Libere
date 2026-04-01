import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import uploadRoute from './routes/uploadRoute';
import 'express-async-errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

// app.use("/api", uploadRoute);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Default route for the root to prevent "Cannot GET /"
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Library REST API is Running!</h1>
    <p>Please use Postman to interact with the API endpoints.</p>
    <ul>
      <li><a href="/api/public/layout">View /api/public/layout</a></li>
      <li><a href="/api/books">View /api/books</a></li>
    </ul>
  `);
});

app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// console.log(process.env.VITE_PRIVY_APP_ID);
// console.log(process.env.VITE_PINATA_API_KEY);
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const supabase = createClient(supabaseUrl!, supabaseKey!);

// const testConnection = async () => {
//   const { data, error } = await supabase
//     .from('Book')
//     .select('*');
  
//   if (error) {
//     console.error('Error:', error.message);
//   } else {
//     console.log('Data from Supabase:', data);
//   }
// };

// testConnection();

