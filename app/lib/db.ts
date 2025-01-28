import { Pool } from 'pg';
import { neon } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;