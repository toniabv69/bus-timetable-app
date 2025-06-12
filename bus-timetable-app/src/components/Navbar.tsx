import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <DirectionsBusIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Bus Timetable
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 