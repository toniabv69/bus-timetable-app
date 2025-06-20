import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  direction: number;
  physical_station_id: number;
}

const StationsList = () => {
  const { t, language } = useLanguage();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Fetch stations for both directions and combine
        const [res0, res1] = await Promise.all([
          axios.get(`${process.env.VITE_BACKEND_URL}/api/stations?lang=${language}&direction=0`),
          axios.get(`${process.env.VITE_BACKEND_URL}/api/stations?lang=${language}&direction=1`)
        ]);
        setStations([...res0.data, ...res1.data]);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, [language]);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(search.toLowerCase()) ||
    station.id.toString().includes(search)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', mx: '1in', mt: '1in' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="500">
          {t('stations')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {t('searchByStation')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label={t('searchByStation')}
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
          />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {filteredStations.map((station: Station) => (
          <Grid item xs={12} sm={6} md={4} key={station.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea component={Link} to={`/station/${station.id}`} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LocationOnIcon color="primary" sx={{ fontSize: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {station.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {station.id}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StationsList; 