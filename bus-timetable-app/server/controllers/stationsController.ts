import { Request, Response } from 'express';
import pool from '../config/database';

interface QueryParams {
  lang?: string;
  direction?: string;
}

export const getAllStations = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  const lang = req.query.lang || 'en';
  const direction = parseInt(req.query.direction || '0', 10);
  
  try {
    const result = await pool.query(
      `SELECT id, name_en, name_bg, direction, physical_station_id 
       FROM stations 
       WHERE direction = $1
       ORDER BY id`,
      [direction]
    );
    
    const formattedStations = result.rows.map((station: any) => ({
      id: station.id,
      name: lang === 'bg' ? station.name_bg : station.name_en,
      direction: station.direction,
      physical_station_id: station.physical_station_id
    }));
    
    res.json(formattedStations);
  } catch (error) {
    console.error('Error in getAllStations:', error);
    res.status(500).json({ error: 'Error fetching stations' });
  }
};

export const getStationBuses = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT b.id as bus_id, b.number as bus_number, b.type as bus_type, s.arrival_time, s.direction, s.day_type
       FROM schedule s
       JOIN buses b ON s.bus_id = b.id
       WHERE s.station_id = $1
       ORDER BY s.arrival_time`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getStationBuses:', error);
    res.status(500).json({ error: 'Error fetching buses for station' });
  }
}; 