-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS bus_stations (
    bus_id INTEGER REFERENCES buses(id),
    station_id INTEGER REFERENCES stations(id),
    stop_order INTEGER NOT NULL,
    PRIMARY KEY (bus_id, station_id)
);

CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id),
    station_id INTEGER REFERENCES stations(id),
    arrival_time TIME NOT NULL,
    departure_time TIME NOT NULL
); 