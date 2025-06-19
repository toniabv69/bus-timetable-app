import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CircularProgress,
  Box,
  Chip,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  TextField
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TramIcon from '@mui/icons-material/Tram';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import SubwayIcon from '@mui/icons-material/Subway';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import axios from 'axios';
import React from 'react';

interface Bus {
  id: number;
  number: string;
  type: 'bus' | 'tram' | 'trolley' | 'e-bus' | 'metro';
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

const BusList = () => {
  const { t } = useLanguage();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteBuses');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('favoriteBuses', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/buses');
        setBuses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch buses');
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const toggleFavorite = (event: React.MouseEvent, busId: number) => {
    event.preventDefault();
    event.stopPropagation();
    setFavorites((prev: number[]) => 
      prev.includes(busId) 
        ? prev.filter((id: number) => id !== busId)
        : [...prev, busId]
    );
  };

  const filteredBuses = buses.filter(bus =>
    bus.number.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" height="100%">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', mx: '1in', mt: '1in' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="500">
          {t('availableRoutes')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('findRoute')}
        </Typography>
        <TextField
          label={t('searchByNumber') || 'Search by number'}
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mt: 2, width: 300 }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredBuses.map((bus: Bus) => (
          <Grid item xs={12} sm={6} md={4} key={bus.id}>
            <Card>
              <CardActionArea component={Link} to={`/bus/${bus.id}`}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: getBusTypeColor(bus.type) }}>
                      {getRouteIcon(bus.type)}
                    </Avatar>
                  }
                  action={
                    <Tooltip title={favorites.includes(bus.id) ? t('removeFromFavorites') : t('addToFavorites')}>
                      <IconButton 
                        size="small" 
                        onClick={(e: React.MouseEvent) => toggleFavorite(e, bus.id)}
                        sx={{ 
                          color: favorites.includes(bus.id) ? 'primary.main' : 'action.disabled',
                          mt: 1
                        }}
                      >
                        {favorites.includes(bus.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  }
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="div">
                        {t('route')} {bus.number}
                      </Typography>
                      <Chip
                        label={t(`routeTypes.${bus.type}`)}
                        size="small"
                        sx={{
                          bgcolor: `${getBusTypeColor(bus.type)}15`,
                          color: getBusTypeColor(bus.type),
                          fontWeight: 500,
                          height: '20px'
                        }}
                      />
                    </Box>
                  }
                  sx={{
                    '& .MuiCardHeader-content': {
                      overflow: 'hidden'
                    },
                    pb: 1
                  }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BusList; 