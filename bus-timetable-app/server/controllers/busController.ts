import type { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../config/database.js';

interface Bus {
  id: number;
  number: string;
  name: string;
  type: string;
}

interface BusParams {
  id?: string;
  stationId?: string;
}

// Get all buses
export const getAllBuses = async (_req: Request, res: Response) => {
  try {
    const result: QueryResult<Bus> = await pool.query('SELECT * FROM buses ORDER BY number');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching buses' });
  }
};

// Get specific bus by ID
export const getBusById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result: QueryResult<Bus> = await pool.query('SELECT * FROM buses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bus' });
  }
};

// Get all stations for a specific bus
export const getBusStations = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT stations.* FROM stations 
       INNER JOIN bus_stations ON stations.id = bus_stations.station_id 
       WHERE bus_stations.bus_id = $1 
       ORDER BY bus_stations.stop_order`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bus stations' });
  }
};

// Get schedule for a specific bus at a specific station
export const getBusSchedule = async (req: Request, res: Response) => {
  const { id, stationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT schedule.* FROM schedule 
       WHERE bus_id = $1 AND station_id = $2 
       ORDER BY arrival_time`,
      [id, stationId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedule' });
  }
}; 