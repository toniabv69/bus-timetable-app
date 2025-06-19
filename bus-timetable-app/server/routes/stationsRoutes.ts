import { Router } from 'express';
import { getAllStations, getStationBuses } from '../controllers/stationsController';

const router = Router();

router.get('/', getAllStations);
router.get('/:id/buses', getStationBuses);

export { router }; 