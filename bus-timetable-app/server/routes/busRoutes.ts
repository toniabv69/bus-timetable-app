import { Router } from 'express';
import { 
  getAllBuses,
  getBusById,
  getBusStations,
  getBusSchedule
} from '../controllers/busController';

const router = Router();

// Get all buses
router.get('/', getAllBuses);

// Get specific bus by ID
router.get('/:id', getBusById);

// Get all stations for a specific bus
router.get('/:id/stations', getBusStations);

// Get schedule for a specific bus at a specific station and direction
router.get('/:id/schedule/:stationId/:direction', getBusSchedule);

export { router }; 