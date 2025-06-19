import { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import pool from '../config/database';

interface Bus {
  id: number;
  number: string;
  type: string;
}

interface Station {
  id: number;
  name_en: string;
  name_bg: string;
  direction: number;
  physical_station_id: number;
}

interface QueryParams {
  lang?: string;
  direction?: string;
}

interface RouteParams {
  id?: string;
  stationId?: string;
  direction?: string;
}

// Get all buses
export const getAllBuses = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const result: QueryResult<Bus> = await pool.query('SELECT id, number, type FROM buses ORDER BY number');
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getAllBuses:', error);
    res.status(500).json({ 
      error: 'Error fetching buses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get specific bus by ID
export const getBusById = async (req: Request<RouteParams, {}, {}, QueryParams>, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result: QueryResult<Bus> = await pool.query('SELECT id, number, type FROM buses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Bus not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getBusById:', error);
    res.status(500).json({ 
      error: 'Error fetching bus',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all stations for a specific bus and direction
export const getBusStations = async (req: Request<RouteParams, {}, {}, QueryParams>, res: Response): Promise<void> => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';
  const direction = parseInt(req.query.direction || '0', 10);
  
  try {
    const result: QueryResult<Station> = await pool.query(
      `SELECT stations.id, stations.name_en, stations.name_bg, stations.direction, stations.physical_station_id
       FROM stations 
       INNER JOIN bus_stations ON stations.id = bus_stations.station_id 
       WHERE bus_stations.bus_id = $1 AND bus_stations.direction = $2
       ORDER BY bus_stations.stop_order`,
      [id, direction]
    );
    const formattedStations = result.rows.map((station: any) => ({
      id: station.id,
      name: lang === 'bg' ? station.name_bg : station.name_en,
      direction: station.direction,
      physical_station_id: station.physical_station_id
    }));
    res.json(formattedStations);
  } catch (error) {
    console.error('Error in getBusStations:', error);
    res.status(500).json({ 
      error: 'Error fetching bus stations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get schedule for a specific bus at a specific station and direction
export const getBusSchedule = async (req: Request<RouteParams, {}, {}, { day_type?: string }>, res: Response): Promise<void> => {
  const { id, stationId, direction } = req.params;
  const day_type = req.query.day_type || 'weekday';
  try {
    const result = await pool.query(
      `SELECT schedule.* FROM schedule 
       WHERE bus_id = $1 AND station_id = $2 AND direction = $3 AND day_type = $4
       ORDER BY arrival_time`,
      [id, stationId, direction, day_type]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getBusSchedule:', error);
    res.status(500).json({ 
      error: 'Error fetching schedule',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 