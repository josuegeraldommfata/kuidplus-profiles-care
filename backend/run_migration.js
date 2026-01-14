const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function run() {
  try {
    const migrationPath = path.join(__dirname, 'migrations', '20260112_add_professional_fields.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Running migration...');
    await pool.query(sql);
    console.log('Migration executed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(2);
  }
}

run();
