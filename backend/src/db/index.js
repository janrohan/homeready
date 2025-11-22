import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
console.log('DATABASE_URL (debug) =', process.env.DATABASE_URL);
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default {
    query: (text, params) => pool.query(text, params),
    pool
};
