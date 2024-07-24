// lib/db.js
import sql from 'mssql';

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: process.env.AZURE_SQL_ENCRYPT === 'true', // Use true if you're on Azure
  },
};

let pool;

export async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to Azure SQL Database');
    } catch (err) {
      console.error('Database connection failed: ', err);
      throw err;
    }
  }
  return pool;
}