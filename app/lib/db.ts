import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_DATABASE_URL) {
  console.error('Available environment variables:', Object.keys(process.env));
  throw new Error('POSTGRES_DATABASE_URL environment variable is not set');
}

// Add debug logging
console.log('Initializing database connection');

const sql = neon(process.env.POSTGRES_DATABASE_URL);
console.log('Database connection initialized successfully');

export default sql;