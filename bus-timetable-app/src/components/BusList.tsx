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
  Box
} from '@mui/material';
import axios from 'axios';

interface Bus {
  id: number;
  number: string;
  name: string;
  type: string;
}

const BusList = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Buses
      </Typography>
      <Grid container spacing={3}>
        {buses.map((bus) => (
          <Grid item xs={12} sm={6} md={4} key={bus.id}>
            <Card>
              <CardActionArea component={Link} to={`/bus/${bus.id}`}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {bus.number}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {bus.type}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {bus.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BusList; 