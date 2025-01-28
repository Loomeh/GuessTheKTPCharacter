import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.POSTGRES_DATABASE_URL);

export default sql;