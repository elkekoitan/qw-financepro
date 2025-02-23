require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  database: 'postgres',
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  port: 6543,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/20240320000000_create_users_table.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Split migration into individual statements
    const statements = migrationSql.split(';').filter(stmt => stmt.trim());

    // Execute each statement in a transaction
    await client.query('BEGIN');

    for (const statement of statements) {
      if (!statement.trim()) continue;

      console.log('Executing statement:', statement.trim());
      
      try {
        await client.query(statement.trim());
        console.log('Statement executed successfully');
      } catch (error) {
        console.error('Statement failed:', error.message);
        throw error;
      }
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration(); 