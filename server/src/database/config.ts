import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config();

const dbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
} : {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'test',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'test',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
console.log('DATABASE_URL being used:', process.env.DATABASE_URL);

export const pool = new Pool(dbConfig);

export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('🔄 Closing database connections...');
  await pool.end();
  process.exit(0);
});