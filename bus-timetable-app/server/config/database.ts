import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database configuration:', {
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'bus_postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres'
});

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'bus_postgres',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'adminpass',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
pool.connect((err: Error | undefined, client: PoolClient | undefined, release: (release?: any) => void) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Successfully connected to database');
  if (release) release();
});

// Log the port the Express server will use
console.log('Express server will use port:', process.env.PORT || 5000);

export default pool; 