import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as busRoutes } from './routes/busRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/buses', busRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 