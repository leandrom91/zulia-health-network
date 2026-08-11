import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

export const pool = mysql.createPool(
  connectionUri
    ? {
        uri: connectionUri,
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'zulia_health_db',
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
);

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database successfully.');
    connection.release();
    return true;
  } catch (error: any) {
    console.warn('⚠️ Could not connect to MySQL server. Falling back to internal active state provider:', error?.message || error);
    return false;
  }
}
