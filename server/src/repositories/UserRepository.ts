import { Pool, QueryResult } from 'pg';
import { User, UserRole } from '../types';

export class UserRepository {
  constructor(private pool: Pool) {}

  // Create a new user
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const query = `
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.role
    ];
    
    const result: QueryResult<any> = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult<any> = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result: QueryResult<any> = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  // Check if email already exists
  async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    const result: QueryResult<any> = await this.pool.query(query, [email]);
    return result.rows.length > 0;
  }

  // Update user role (for admin operations)
  async updateRole(userId: string, role: UserRole): Promise<User | null> {
    const query = `
      UPDATE users 
      SET role = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result: QueryResult<any> = await this.pool.query(query, [role, userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  // Get all users (admin only)
  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result: QueryResult<any> = await this.pool.query(query);
    return result.rows.map(row => this.mapRowToUser(row));
  }

  // Helper method to map database row to User object
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role as UserRole,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}