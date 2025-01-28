import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_DATABASE_URL) {
  throw new Error('Database connection string not found');
}

const sql = neon(process.env.POSTGRES_DATABASE_URL);

export default sql;