import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;
  const dbName = process.env.DB_NAME || 'zulia_health_db';

  console.log(`🔌 Conectando a MySQL en ${host}:${port} como usuario '${user}'...`);

  try {
    // 1. Connection without specifying DB to ensure CREATE DATABASE works
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true,
    });

    console.log(`📦 Creando base de datos '${dbName}' si no existe...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    // 2. Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📋 Aplicando estructura de tablas (schema.sql)...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Tablas creadas exitosamente.');
    }

    // 3. Read and execute seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Cargando datos iniciales de los ambulatorios del Zulia (seed.sql)...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✅ Datos iniciales (Ambulatorio Corito 1 y Red Zulia) cargados exitosamente.');
    }

    await connection.end();
    console.log('🎉 ¡Base de datos MySQL configurada e inicializada correctamente!');
  } catch (error: any) {
    console.error('❌ Error al inicializar la base de datos MySQL:', error.message);
    console.log('\n💡 Sugerencia: Verifique que MySQL esté iniciado y revise las credenciales en server/.env');
  }
}

initDatabase();
