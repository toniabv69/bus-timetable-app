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
    day_type VARCHAR(20) NOT NULL, -- 'weekday', 'weekend'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert sample buses
INSERT INTO buses (number, type) VALUES
('101', 'bus'),
('T1', 'tram'),
('TR5', 'trolley'),
('E2', 'e-bus'),
('M1', 'metro');

-- Insert sample stations with different IDs for each direction
-- Direction 0 stations (IDs 1-8)
INSERT INTO stations (id, name_en, name_bg, direction, physical_station_id) VALUES
(1, 'Central Station', 'Централна Гара', 0, 1),
(2, 'University Campus', 'Университетски Кампус', 0, 2),
(3, 'Shopping Mall', 'Търговски Център', 0, 3),
(4, 'Business Park', 'Бизнес Парк', 0, 4),
(5, 'Sports Complex', 'Спортен Комплекс', 0, 5),
(6, 'Airport Terminal', 'Летищен Терминал', 0, 6),
(7, 'Hospital', 'Болница', 0, 7),
(8, 'Tech Hub', 'Технологичен Хъб', 0, 8);

-- Direction 1 stations (IDs 101-108) - same physical locations but different IDs
INSERT INTO stations (id, name_en, name_bg, direction, physical_station_id) VALUES
(101, 'Central Station', 'Централна Гара', 1, 1),
(102, 'University Campus', 'Университетски Кампус', 1, 2),
(103, 'Shopping Mall', 'Търговски Център', 1, 3),
(104, 'Business Park', 'Бизнес Парк', 1, 4),
(105, 'Sports Complex', 'Спортен Комплекс', 1, 5),
(106, 'Airport Terminal', 'Летищен Терминал', 1, 6),
(107, 'Hospital', 'Болница', 1, 7),
(108, 'Tech Hub', 'Технологичен Хъб', 1, 8);

-- Map buses to stations with order and direction
-- Bus 101: direction 0 (A->B) uses stations 1,3,4
-- Bus 101: direction 1 (B->A) uses stations 104,103,101
INSERT INTO bus_stations (bus_id, station_id, stop_order, direction) VALUES
-- Bus 101 direction 0
(1, 1, 1, 0), (1, 3, 2, 0), (1, 4, 3, 0),
-- Bus 101 direction 1  
(1, 104, 1, 1), (1, 103, 2, 1), (1, 101, 3, 1),
-- Bus T1 direction 0
(2, 1, 1, 0), (2, 2, 2, 0), (2, 5, 3, 0),
-- Bus T1 direction 1
(2, 105, 1, 1), (2, 102, 2, 1), (2, 101, 3, 1),
-- Bus TR5 direction 0
(3, 2, 1, 0), (3, 4, 2, 0), (3, 7, 3, 0),
-- Bus TR5 direction 1
(3, 107, 1, 1), (3, 104, 2, 1), (3, 102, 3, 1),
-- Bus E2 direction 0
(4, 3, 1, 0), (4, 5, 2, 0), (4, 8, 3, 0),
-- Bus E2 direction 1
(4, 108, 1, 1), (4, 105, 2, 1), (4, 103, 3, 1),
-- Bus M1 direction 0
(5, 1, 1, 0), (5, 6, 2, 0), (5, 8, 3, 0),
-- Bus M1 direction 1
(5, 108, 1, 1), (5, 106, 2, 1), (5, 101, 3, 1);

-- Insert sample schedules for both directions and all day types
-- Bus 101, direction 0, weekday
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(1, 1, 0, '07:00', 'weekday'), (1, 3, 0, '07:15', 'weekday'), (1, 4, 0, '07:30', 'weekday'),
(1, 1, 0, '08:00', 'weekday'), (1, 3, 0, '08:15', 'weekday'), (1, 4, 0, '08:30', 'weekday'),
-- Bus 101, direction 1, weekday
(1, 104, 1, '07:00', 'weekday'), (1, 103, 1, '07:15', 'weekday'), (1, 101, 1, '07:30', 'weekday'),
(1, 104, 1, '08:00', 'weekday'), (1, 103, 1, '08:15', 'weekday'), (1, 101, 1, '08:30', 'weekday'),
-- Bus 101, direction 0, weekend
(1, 1, 0, '09:00', 'weekend'), (1, 3, 0, '09:15', 'weekend'), (1, 4, 0, '09:30', 'weekend'),
-- Bus 101, direction 1, weekend
(1, 104, 1, '09:00', 'weekend'), (1, 103, 1, '09:15', 'weekend'), (1, 101, 1, '09:30', 'weekend');

-- Example: Add schedules for all stations, all buses, both directions, both day types
-- Bus 101
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
-- Direction 0
(1, 1, 0, '07:00', 'weekday'), (1, 3, 0, '07:10', 'weekday'), (1, 4, 0, '07:20', 'weekday'),
(1, 1, 0, '09:00', 'weekend'), (1, 3, 0, '09:10', 'weekend'), (1, 4, 0, '09:20', 'weekend'),
-- Direction 1
(1, 104, 1, '07:30', 'weekday'), (1, 103, 1, '07:40', 'weekday'), (1, 101, 1, '07:50', 'weekday'),
(1, 104, 1, '09:30', 'weekend'), (1, 103, 1, '09:40', 'weekend'), (1, 101, 1, '09:50', 'weekend');

-- Bus T1
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(2, 1, 0, '08:00', 'weekday'), (2, 2, 0, '08:10', 'weekday'), (2, 5, 0, '08:20', 'weekday'),
(2, 1, 0, '10:00', 'weekend'), (2, 2, 0, '10:10', 'weekend'), (2, 5, 0, '10:20', 'weekend'),
(2, 105, 1, '08:30', 'weekday'), (2, 102, 1, '08:40', 'weekday'), (2, 101, 1, '08:50', 'weekday'),
(2, 105, 1, '10:30', 'weekend'), (2, 102, 1, '10:40', 'weekend'), (2, 101, 1, '10:50', 'weekend');

-- Bus TR5
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(3, 2, 0, '09:00', 'weekday'), (3, 4, 0, '09:10', 'weekday'), (3, 7, 0, '09:20', 'weekday'),
(3, 2, 0, '11:00', 'weekend'), (3, 4, 0, '11:10', 'weekend'), (3, 7, 0, '11:20', 'weekend'),
(3, 107, 1, '09:30', 'weekday'), (3, 104, 1, '09:40', 'weekday'), (3, 102, 1, '09:50', 'weekday'),
(3, 107, 1, '11:30', 'weekend'), (3, 104, 1, '11:40', 'weekend'), (3, 102, 1, '11:50', 'weekend');

-- Bus E2
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(4, 3, 0, '10:00', 'weekday'), (4, 5, 0, '10:10', 'weekday'), (4, 8, 0, '10:20', 'weekday'),
(4, 3, 0, '12:00', 'weekend'), (4, 5, 0, '12:10', 'weekend'), (4, 8, 0, '12:20', 'weekend'),
(4, 108, 1, '10:30', 'weekday'), (4, 105, 1, '10:40', 'weekday'), (4, 103, 1, '10:50', 'weekday'),
(4, 108, 1, '12:30', 'weekend'), (4, 105, 1, '12:40', 'weekend'), (4, 103, 1, '12:50', 'weekend');

-- Bus M1
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(5, 1, 0, '11:00', 'weekday'), (5, 6, 0, '11:10', 'weekday'), (5, 8, 0, '11:20', 'weekday'),
(5, 1, 0, '13:00', 'weekend'), (5, 6, 0, '13:10', 'weekend'), (5, 8, 0, '13:20', 'weekend'),
(5, 108, 1, '11:30', 'weekday'), (5, 106, 1, '11:40', 'weekday'), (5, 101, 1, '11:50', 'weekday'),
(5, 108, 1, '13:30', 'weekend'), (5, 106, 1, '13:40', 'weekend'), (5, 101, 1, '13:50', 'weekend');

-- Add at least one schedule for every station (IDs 1-8 and 101-108) for demonstration
-- For stations not covered above, add a generic bus (M1) for both directions and day types
INSERT INTO schedule (bus_id, station_id, direction, arrival_time, day_type) VALUES
(5, 2, 0, '14:00', 'weekday'), (5, 2, 0, '15:00', 'weekend'),
(5, 4, 0, '14:10', 'weekday'), (5, 4, 0, '15:10', 'weekend'),
(5, 5, 0, '14:20', 'weekday'), (5, 5, 0, '15:20', 'weekend'),
(5, 7, 0, '14:30', 'weekday'), (5, 7, 0, '15:30', 'weekend'),
(5, 101, 1, '14:40', 'weekday'), (5, 101, 1, '15:40', 'weekend'),
(5, 102, 1, '14:50', 'weekday'), (5, 102, 1, '15:50', 'weekend'),
(5, 103, 1, '14:55', 'weekday'), (5, 103, 1, '15:55', 'weekend'),
(5, 104, 1, '14:57', 'weekday'), (5, 104, 1, '15:57', 'weekend'),
(5, 105, 1, '14:59', 'weekday'), (5, 105, 1, '15:59', 'weekend'),
(5, 106, 1, '16:00', 'weekday'), (5, 106, 1, '17:00', 'weekend'),
(5, 107, 1, '16:10', 'weekday'), (5, 107, 1, '17:10', 'weekend'),
(5, 108, 1, '16:20', 'weekday'), (5, 108, 1, '17:20', 'weekend'); 