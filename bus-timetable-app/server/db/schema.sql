-- Create buses table
CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'bus', 'trolley', 'tram'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stations table
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bus_stations table (for mapping buses to stations with order)
CREATE TABLE bus_stations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bus_id, station_id)
);

-- Create schedule table
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    arrival_time TIME NOT NULL,
    day_type VARCHAR(20) NOT NULL, -- 'weekday', 'saturday', 'sunday'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bus_stations_bus_id ON bus_stations(bus_id);
CREATE INDEX idx_bus_stations_station_id ON bus_stations(station_id);
CREATE INDEX idx_schedule_bus_id ON schedule(bus_id);
CREATE INDEX idx_schedule_station_id ON schedule(station_id);
CREATE INDEX idx_schedule_arrival_time ON schedule(arrival_time); 