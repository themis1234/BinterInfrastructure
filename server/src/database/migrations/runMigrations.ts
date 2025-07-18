import { pool } from '../config';
import * as migration001 from "./001_initial_schema";

interface Migration {
  name: string;
  up: (pool: any) => Promise<void>;
  down: (pool: any) => Promise<void>;
}

const migrations: Migration[] = [
  {
    name: '001_initial_schema',
    up: migration001.up,
    down: migration001.down
  }
];

const runMigrations = async (): Promise<void> => {
  try {
    console.log('🚀 Running database migrations...');
    
    for (const migration of migrations) {
      console.log(`⏳ Running migration: ${migration.name}`);
      await migration.up(pool);
      console.log(`✅ Completed migration: ${migration.name}`);
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };