import 'dotenv/config';
import { Pool } from 'pg';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ensureMigrationsTable = async (client) => {
  await client.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`
  );
};

const getAppliedMigrations = async (client) => {
  const result = await client.query('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map((row) => row.filename));
};

const runMigration = async (client, filename, sql) => {
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
    await client.query('COMMIT');
    console.log(`Applied ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);

    const entries = await readdir(migrationsDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .map((entry) => entry.name)
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }
      const sql = await readFile(path.join(migrationsDir, file), 'utf8');
      const trimmed = sql.trim();
      if (!trimmed) {
        continue;
      }
      await runMigration(client, file, trimmed);
    }
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
