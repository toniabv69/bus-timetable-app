import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Chip, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TramIcon from '@mui/icons-material/Tram';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import SubwayIcon from '@mui/icons-material/Subway';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  direction: number;
  physical_station_id: number;
}

interface BusSchedule {
  bus_id: number;
  bus_number: string;
  bus_type: string;
  arrival_time: string;
  direction: number;
  day_type: string;
}

const getRouteIcon = (type: string) => {
  switch (type) {
    case 'tram':
      return <TramIcon fontSize="small" />;
    case 'trolley':
      return <ElectricRickshawIcon fontSize="small" />;
    case 'e-bus':
      return <ElectricRickshawIcon fontSize="small" />;
    case 'metro':
      return <SubwayIcon fontSize="small" />;
    default:
      return <DirectionsBusIcon fontSize="small" />;
  }
};

const getBusTypeColor = (type: string) => {
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

const StationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [station, setStation] = useState<Station | null>(null);
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [busLoading, setBusLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [dayType, setDayType] = useState<'weekday' | 'weekend'>('weekday');

  useEffect(() => {
    const fetchStation = async () => {
      try {
        // Fetch station for both directions and combine
        const [res0, res1] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stations?lang=${language}&direction=0`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stations?lang=${language}&direction=1`)
        ]);
        const found = [...res0.data, ...res1.data].find((s: Station) => s.id === Number(id));
        setStation(found);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id, language]);

  useEffect(() => {
    const fetchBuses = async () => {
      setBusLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stations/${id}/buses`);
        setBusSchedules(res.data);
        // Select first bus by default if available
        if (res.data.length > 0 && !selectedBus) {
          setSelectedBus(res.data[0].bus_id.toString());
        }
      } finally {
        setBusLoading(false);
      }
    };
    fetchBuses();
  }, [id, selectedBus]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%"><CircularProgress /></Box>;
  }
  if (!station) {
    return <Typography color="error">{t('routeNotFound')}</Typography>;
  }

  // Deduplicate buses for dropdown by bus_id
  const uniqueBuses = Array.from(
    new Map(busSchedules.map(b => [b.bus_id, b])).values()
  );

  // Only show the table for the selected bus, selected day type, and correct direction
  const filteredSchedules = busSchedules.filter(
    b => b.bus_id === Number(selectedBus) && b.day_type === dayType && b.direction === station.direction
  );
  const selectedBusObj = uniqueBuses.find(b => b.bus_id === Number(selectedBus));

  // Map: hour -> [minutes] (no duplicates)
  const hourToMinutes: { [hour: number]: string[] } = {};
  HOURS.forEach(h => (hourToMinutes[h] = []));
  filteredSchedules.forEach(b => {
    const [h, m] = b.arrival_time.split(':');
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
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mx: '1in', mt: '1in' }}>
      <Typography variant="h4" gutterBottom>
        {station.name} <Typography component="span" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.95em' }}>({station.id})</Typography>
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>{t('stationsAndSchedule')}</Typography>
      <FormControl sx={{ mb: 3, width: 300 }} size="small">
        <InputLabel id="bus-select-label">{t('route')}</InputLabel>
        <Select
          labelId="bus-select-label"
          value={selectedBus}
          label={t('route')}
          onChange={e => setSelectedBus(e.target.value as string)}
        >
          {uniqueBuses.map(bus => (
            <MenuItem key={bus.bus_id} value={bus.bus_id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getRouteIcon(bus.bus_type)}
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 600, fontSize: '1.2rem', color: getBusTypeColor(bus.bus_type) }}>
                  {t('route')} {bus.bus_number}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        value={dayType}
        exclusive
        onChange={(_, value) => value && setDayType(value)}
        sx={{ mb: 3, ml: 2 }}
        size="small"
      >
        <ToggleButton value="weekday">{t('weekday') || 'Weekday'}</ToggleButton>
        <ToggleButton value="weekend">{t('weekend') || 'Weekend'}</ToggleButton>
      </ToggleButtonGroup>
      {busLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
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
                          <Typography key={i} variant="body2" sx={{ fontWeight: 500, color: getBusTypeColor(selectedBusObj?.bus_type || '') }}>
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
      )}
    </Box>
  );
};

export default StationDetail; 