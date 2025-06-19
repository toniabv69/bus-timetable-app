import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TramIcon from '@mui/icons-material/Tram';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import SubwayIcon from '@mui/icons-material/Subway';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import axios from 'axios';

interface Bus {
  id: number;
  number: string;
  type: 'bus' | 'tram' | 'trolley' | 'e-bus' | 'metro';
}

interface Station {
  id: number;
  name: string;
  direction: number;
  physical_station_id: number;
}

interface Schedule {
  id: number;
  arrival_time: string;
}

const getRouteIcon = (type: Bus['type']) => {
  switch (type) {
    case 'tram':
      return <TramIcon />;
    case 'trolley':
      return <ElectricRickshawIcon />;
    case 'e-bus':
      return <ElectricRickshawIcon />;
    case 'metro':
      return <SubwayIcon />;
    default:
      return <DirectionsBusIcon />;
  }
};

const getBusTypeColor = (type: Bus['type']) => {
  switch (type) {
    case 'bus':
      return '#1976d2';
    case 'tram':
      return '#e91e63';
    case 'trolley':
      return '#43a047';
    case 'e-bus':
      return '#009688';
    case 'metro':
      return '#9c27b0';
    default:
      return '#ff9800';
  }
};

const HOURS = Array.from({ length: 20 }, (_, i) => (i + 5) % 24);

const BusDetail = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsDir0, setStationsDir0] = useState<Station[]>([]);
  const [stationsDir1, setStationsDir1] = useState<Station[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(0);
  const [dayType, setDayType] = useState<'weekday' | 'weekend'>('weekday');

  // Fetch bus and both directions' stations on load or language change
  useEffect(() => {
    const fetchBusAndStations = async () => {
      try {
        const [busResponse, stations0Response, stations1Response] = await Promise.all([
          axios.get(`http://localhost:5000/api/buses/${id}`),
          axios.get(`http://localhost:5000/api/buses/${id}/stations?direction=0&lang=${language}`),
          axios.get(`http://localhost:5000/api/buses/${id}/stations?direction=1&lang=${language}`)
        ]);
        setBus(busResponse.data);
        setStationsDir0(stations0Response.data);
        setStationsDir1(stations1Response.data);
        // Set initial stations and selectedStation for current direction
        const initialStations = direction === 0 ? stations0Response.data : stations1Response.data;
        setStations(initialStations);
        if (initialStations.length > 0) {
          setSelectedStation(initialStations[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bus details');
        setLoading(false);
      }
    };
    fetchBusAndStations();
  }, [id, language, direction]);

  // Update stations and selectedStation when direction changes
  useEffect(() => {
    const newStations = direction === 0 ? stationsDir0 : stationsDir1;
    setStations(newStations);
    if (newStations.length > 0) {
      setSelectedStation(newStations[0].id);
    }
  }, [direction, stationsDir0, stationsDir1]);

  // Fetch schedule when selectedStation, direction, dayType, or id changes
  useEffect(() => {
    const fetchSchedule = async () => {
      if (selectedStation !== null && direction !== null && dayType) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/buses/${id}/schedule/${selectedStation}/${direction}?day_type=${dayType}`
          );
          setSchedule(response.data);
        } catch (err) {
          setError('Failed to fetch schedule');
        }
      }
    };
    fetchSchedule();
  }, [id, selectedStation, direction, dayType]);

  // Helper to get start/end station names for a direction
  const getDirectionLabel = (dir: number) => {
    const arr = dir === 0 ? stationsDir0 : stationsDir1;
    if (arr.length > 1) {
      return `${arr[0]?.name} → ${arr[arr.length - 1]?.name}`;
    }
    return dir === 0 ? t('AtoB') || 'A → B' : t('BtoA') || 'B → A';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !bus) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" height="100%">
        <Typography color="error" variant="h6">
          {error || t('routeNotFound')}
        </Typography>
      </Box>
    );
  }

  // Map: hour -> [minutes] (no duplicates, keep leading zeros)
  const hourToMinutes: { [hour: number]: string[] } = {};
  HOURS.forEach(h => (hourToMinutes[h] = []));
  schedule.forEach((s: Schedule) => {
    const [h, m] = s.arrival_time.split(':');
    let hour = parseInt(h, 10);
    if (hour === 0) hour = 24; // treat 00 as 24 for display
    if (hour >= 5 && hour <= 23) {
      if (!hourToMinutes[hour].includes(m)) {
        hourToMinutes[hour].push(m);
      }
    } else if (hour === 24) {
      hourToMinutes[0] = hourToMinutes[0] || [];
      if (!hourToMinutes[0].includes(m)) {
        hourToMinutes[0].push(m);
      }
    }
  });

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', py: 3 }}>
      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton
              component={Link}
              to="/"
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="500">
                {t('route')} {bus.number}
              </Typography>
            </Box>
            <Chip
              label={t(`routeTypes.${bus.type}`)}
              sx={{
                bgcolor: `${getBusTypeColor(bus.type)}15`,
                color: getBusTypeColor(bus.type),
                fontWeight: 500,
                ml: 'auto'
              }}
            />
          </Box>
          <Card sx={{ mb: 4, width: '100%', maxWidth: 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('routeInformation')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getRouteIcon(bus.type)}
                  <Typography>
                    {stations.length} {t('stops')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="primary" />
                  <Typography>
                    {getDirectionLabel(direction)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: '100%', maxWidth: 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('stationsAndSchedule')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <FormControl fullWidth sx={{ maxWidth: 350 }}>
                  <InputLabel id="station-select-label">{t('selectStation')}</InputLabel>
                  <Select
                    labelId="station-select-label"
                    value={selectedStation || ''}
                    label={t('selectStation')}
                    onChange={(e) => setSelectedStation(e.target.value as number)}
                  >
                    {stations.map((station: Station) => (
                      <MenuItem key={station.id} value={station.id}>
                        {station.name} <Typography component="span" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.95em' }}>({station.id})</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <ToggleButtonGroup
                  value={direction}
                  exclusive
                  onChange={(_, value) => value !== null && setDirection(value)}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  <ToggleButton value={0}>{getDirectionLabel(0)}</ToggleButton>
                  <ToggleButton value={1}>{getDirectionLabel(1)}</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  value={dayType}
                  exclusive
                  onChange={(_, value) => value && setDayType(value)}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  <ToggleButton value="weekday">{t('weekday') || 'Weekday'}</ToggleButton>
                  <ToggleButton value="weekend">{t('weekend') || 'Weekend'}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, width: '100%', maxWidth: 'none', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {HOURS.map(h => (
                        <TableCell align="center" key={h} sx={{ fontWeight: 700 }}>
                          {h === 0 ? '00' : h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {HOURS.map(h => (
                        <TableCell align="center" key={h} sx={{ verticalAlign: 'top', minWidth: 40 }}>
                          {hourToMinutes[h] && hourToMinutes[h].length > 0
                            ? hourToMinutes[h].map((m, i) => (
                                <Typography key={i} variant="body2" sx={{ fontWeight: 500, color: getBusTypeColor(bus.type) }}>
                                  {m}
                                </Typography>
                              ))
                            : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default BusDetail; 