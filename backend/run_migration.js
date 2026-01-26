const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function run() {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();

    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(sql);
      console.log(`Migration ${file} executed successfully.`);
    }

    console.log('All migrations executed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(2);
  }
}

run();
