-- Clear existing data
TRUNCATE TABLE schedule CASCADE;
TRUNCATE TABLE bus_stations CASCADE;
TRUNCATE TABLE buses CASCADE;
TRUNCATE TABLE stations CASCADE;

-- Insert sample buses
INSERT INTO buses (number, name, type) VALUES
('101', 'Downtown Express', 'Express'),
('102', 'Airport Shuttle', 'Shuttle'),
('103', 'Beach Route', 'Regular'),
('104', 'University Line', 'Express'),
('105', 'Night Owl', 'Night Service');

-- Insert sample stations
INSERT INTO stations (name, location) VALUES
('Central Station', 'Downtown Center'),
('Airport Terminal 1', 'International Airport'),
('Beach Front', 'Coastal Area'),
('University Campus', 'University District'),
('Shopping Mall', 'Commercial District'),
('Hospital', 'Medical District'),
('Sports Complex', 'Recreation Area'),
('Tech Park', 'Business District');

-- Connect buses with stations (bus_stations)
-- Route 101: Downtown Express
INSERT INTO bus_stations (bus_id, station_id, stop_order) VALUES
(1, 1, 1), -- Central Station
(1, 5, 2), -- Shopping Mall
(1, 8, 3), -- Tech Park
(1, 6, 4); -- Hospital

-- Route 102: Airport Shuttle
INSERT INTO bus_stations (bus_id, station_id, stop_order) VALUES
(2, 1, 1), -- Central Station
(2, 2, 2); -- Airport Terminal 1

-- Route 103: Beach Route
INSERT INTO bus_stations (bus_id, station_id, stop_order) VALUES
(3, 1, 1), -- Central Station
(3, 5, 2), -- Shopping Mall
(3, 3, 3); -- Beach Front

-- Route 104: University Line
INSERT INTO bus_stations (bus_id, station_id, stop_order) VALUES
(4, 1, 1), -- Central Station
(4, 8, 2), -- Tech Park
(4, 4, 3); -- University Campus

-- Route 105: Night Owl
INSERT INTO bus_stations (bus_id, station_id, stop_order) VALUES
(5, 1, 1), -- Central Station
(5, 6, 2), -- Hospital
(5, 4, 3), -- University Campus
(5, 3, 4); -- Beach Front

-- Insert sample schedule (24-hour format)
-- Route 101: Downtown Express
INSERT INTO schedule (bus_id, station_id, arrival_time, departure_time) VALUES
-- Morning schedule
(1, 1, '07:00', '07:05'),
(1, 5, '07:20', '07:25'),
(1, 8, '07:40', '07:45'),
(1, 6, '08:00', '08:05'),
-- Afternoon schedule
(1, 1, '13:00', '13:05'),
(1, 5, '13:20', '13:25'),
(1, 8, '13:40', '13:45'),
(1, 6, '14:00', '14:05');

-- Route 102: Airport Shuttle
INSERT INTO schedule (bus_id, station_id, arrival_time, departure_time) VALUES
(2, 1, '06:00', '06:05'),
(2, 2, '06:30', '06:35'),
(2, 1, '07:00', '07:05'),
(2, 2, '07:30', '07:35');

-- Route 103: Beach Route
INSERT INTO schedule (bus_id, station_id, arrival_time, departure_time) VALUES
(3, 1, '09:00', '09:05'),
(3, 5, '09:25', '09:30'),
(3, 3, '09:50', '09:55'),
(3, 1, '14:00', '14:05'),
(3, 5, '14:25', '14:30'),
(3, 3, '14:50', '14:55');

-- Route 104: University Line
INSERT INTO schedule (bus_id, station_id, arrival_time, departure_time) VALUES
(4, 1, '08:00', '08:05'),
(4, 8, '08:25', '08:30'),
(4, 4, '08:50', '08:55'),
(4, 1, '15:00', '15:05'),
(4, 8, '15:25', '15:30'),
(4, 4, '15:50', '15:55');

-- Route 105: Night Owl
INSERT INTO schedule (bus_id, station_id, arrival_time, departure_time) VALUES
(5, 1, '22:00', '22:05'),
(5, 6, '22:25', '22:30'),
(5, 4, '22:50', '22:55'),
(5, 3, '23:15', '23:20'); 