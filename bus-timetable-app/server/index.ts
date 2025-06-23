import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as busRoutes } from './routes/busRoutes';
import { router as stationsRoutes } from './routes/stationsRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/api/buses', busRoutes);
app.use('/api/stations', stationsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 