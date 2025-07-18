import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './database/config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); 
app.use(cors());
app.use(express.json()); 

// Mount API routes
app.use('/api', router);

// Root route (optional)
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the QR Code Tracker API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
