import { Pool } from 'pg';

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

const pool = new Pool(poolConfig);

export default pool;
