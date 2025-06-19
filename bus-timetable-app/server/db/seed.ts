import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const dbDir = path.resolve(__dirname, '../../db');

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'adminpass',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function seed() {
  try {
    // Read SQL files
    const schemaSQL = fs.readFileSync(
      path.join(dbDir, 'schema.sql'),
      'utf-8'
    );
    const seedSQL = fs.readFileSync(
      path.join(dbDir, 'seed.sql'),
      'utf-8'
    );

    // Connect to PostgreSQL
    const client = await pool.connect();
    
    try {
      // Execute schema and seed SQL
      await client.query(schemaSQL);
      await client.query(seedSQL);
      
      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error reading SQL files:', error);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seed().catch(console.error); 