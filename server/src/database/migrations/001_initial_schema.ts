import { Pool } from 'pg';

export const up = async (pool: Pool): Promise<void> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create enum types
    await client.query(`
      CREATE TYPE user_role AS ENUM ('user', 'employee', 'admin');
    `);
    
    await client.query(`
      CREATE TYPE qr_code_status AS ENUM ('inactive', 'active', 'completed');
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create QR codes table
    await client.query(`
      CREATE TABLE qr_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(255) UNIQUE NOT NULL,
        status qr_code_status NOT NULL DEFAULT 'inactive',
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create status history table for audit trail
    await client.query(`
      CREATE TABLE status_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
        from_status qr_code_status NOT NULL,
        to_status qr_code_status NOT NULL,
        changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );
    `);
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX idx_qr_codes_status ON qr_codes(status);
      CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
      CREATE INDEX idx_status_history_qr_code_id ON status_history(qr_code_id);
    `);
    
    // Create function to update updated_at timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    // Create triggers to automatically update updated_at
    await client.query(`
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await client.query(`
      CREATE TRIGGER update_qr_codes_updated_at 
        BEFORE UPDATE ON qr_codes 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await client.query('COMMIT');
    console.log('✅ Initial schema migration completed');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const down = async (pool: Pool): Promise<void> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Drop tables in reverse order
    await client.query('DROP TABLE IF EXISTS status_history CASCADE;');
    await client.query('DROP TABLE IF EXISTS qr_codes CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    
    // Drop functions
    await client.query('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;');
    
    // Drop enum types
    await client.query('DROP TYPE IF EXISTS qr_code_status CASCADE;');
    await client.query('DROP TYPE IF EXISTS user_role CASCADE;');
    
    await client.query('COMMIT');
    console.log('✅ Schema rollback completed');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    client.release();
  }
};