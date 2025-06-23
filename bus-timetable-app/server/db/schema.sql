-- Create buses table
-- Drop existing data
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS bus_stations;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS buses;
DROP TYPE IF EXISTS route_type;

DO $$ BEGIN
    CREATE TYPE route_type AS ENUM ('bus', 'tram', 'trolley', 'e-bus', 'metro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    number TEXT NOT NULL,
    type route_type NOT NULL
);

-- Create stations table with direction-specific IDs
-- Each station can have different IDs for different directions
-- This allows for different names, properties, etc. per direction
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_bg TEXT NOT NULL,
    direction INTEGER NOT NULL DEFAULT 0, -- 0 for one way, 1 for the other
    physical_station_id INTEGER NOT NULL -- Links stations that are physically the same location
);

-- Create bus_stations table (for mapping buses to stations with order)
CREATE TABLE IF NOT EXISTS bus_stations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL,
    direction INTEGER NOT NULL DEFAULT 0, -- 0 for one way, 1 for the other
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bus_id, station_id, direction)
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    direction INTEGER NOT NULL DEFAULT 0, -- 0 for one way, 1 for the other
    arrival_time TIME NOT NULL,
    day_type TEXT NOT NULL, -- 'weekday', 'weekend'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bus_stations_bus_id ON bus_stations(bus_id);
CREATE INDEX idx_bus_stations_station_id ON bus_stations(station_id);
CREATE INDEX idx_schedule_bus_id ON schedule(bus_id);
CREATE INDEX idx_schedule_station_id ON schedule(station_id);
CREATE INDEX idx_schedule_arrival_time ON schedule(arrival_time);
CREATE INDEX idx_stations_direction ON stations(direction);
CREATE INDEX idx_stations_physical_id ON stations(physical_station_id); 