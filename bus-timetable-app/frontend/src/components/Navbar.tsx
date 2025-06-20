import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLanguage } from '../contexts/LanguageContext.tsx';

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bg' : 'en');
  };

  console.log(import.meta.env);

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ py: 1, mx: '1in' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <DirectionsBusIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Bus Timetable
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<TimelineIcon />}
            sx={{
              opacity: location.pathname === '/' ? 1 : 0.7,
              '&:hover': { opacity: 1 }
            }}
          >
            {t('schedules')}
          </Button>
          <Button
            component={Link}
            to="/stations"
            color="inherit"
            startIcon={<LocationOnIcon />}
            sx={{
              opacity: location.pathname === '/stations' ? 1 : 0.7,
              '&:hover': { opacity: 1 }
            }}
          >
            {t('stations')}
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="inherit"
          onClick={toggleLanguage}
          sx={{ 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            px: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Typography variant="button" sx={{ mr: 1, textTransform: 'uppercase' }}>
            {language}
          </Typography>
          <LanguageIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 