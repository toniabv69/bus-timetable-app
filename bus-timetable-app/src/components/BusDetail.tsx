import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Schedule {
  id: number;
  arrival_time: string;
  day_type: string;
}

interface Bus {
  id: number;
  number: string;
  name: string;
  type: string;
}

const BusDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const [busResponse, stationsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/buses/${id}`),
          axios.get(`http://localhost:5000/api/buses/${id}/stations`)
        ]);

        setBus(busResponse.data);
        setStations(stationsResponse.data);
        if (stationsResponse.data.length > 0) {
          setSelectedStation(stationsResponse.data[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bus details');
        setLoading(false);
      }
    };

    fetchBusData();
  }, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (selectedStation) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/buses/${id}/schedule/${selectedStation}`
          );
          setSchedule(response.data);
        } catch (err) {
          setError('Failed to fetch schedule');
        }
      }
    };

    fetchSchedule();
  }, [id, selectedStation]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !bus) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h6">
          {error || 'Bus not found'}
        </Typography>
      </Container>
    );
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bus {bus.number} - {bus.name}
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        Type: {bus.type}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={stations.findIndex((station) => station.id === selectedStation)}
          onChange={(_, newValue) => setSelectedStation(stations[newValue].id)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {stations.map((station) => (
            <Tab key={station.id} label={station.name} />
          ))}
        </Tabs>
      </Box>

      {schedule.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Day Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((time) => (
                <TableRow key={time.id}>
                  <TableCell>{formatTime(time.arrival_time)}</TableCell>
                  <TableCell>{time.day_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center">No schedule available for this station</Typography>
      )}
    </Container>
  );
};

export default BusDetail; 