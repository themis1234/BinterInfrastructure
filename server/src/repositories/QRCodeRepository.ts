import { Pool, QueryResult } from 'pg';
import { QRCode, QRCodeStatus, StatusHistory } from '../types';

export class QRCodeRepository {
  constructor(private pool: Pool) {}

  // Create a new QR code
  async create(code: string): Promise<QRCode> {
    const query = `
      INSERT INTO qr_codes (code, status)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result: QueryResult<any> = await this.pool.query(query, [code, QRCodeStatus.INACTIVE]);
    return this.mapRowToQRCode(result.rows[0]);
  }

  // Find QR code by ID
  async findById(id: string): Promise<QRCode | null> {
    const query = 'SELECT * FROM qr_codes WHERE id = $1';
    const result: QueryResult<any> = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToQRCode(result.rows[0]);
  }

  // Find QR code by code value
  async findByCode(code: string): Promise<QRCode | null> {
    const query = 'SELECT * FROM qr_codes WHERE code = $1';
    const result: QueryResult<any> = await this.pool.query(query, [code]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToQRCode(result.rows[0]);
  }

  // Get all QR codes with a specific status
  async findByStatus(status: QRCodeStatus): Promise<QRCode[]> {
    const query = 'SELECT * FROM qr_codes WHERE status = $1 ORDER BY created_at DESC';
    const result: QueryResult<any> = await this.pool.query(query, [status]);
    return result.rows.map(row => this.mapRowToQRCode(row));
  }

  // Get QR codes assigned to a specific user
  async findByUserId(userId: string): Promise<QRCode[]> {
    const query = 'SELECT * FROM qr_codes WHERE user_id = $1 ORDER BY updated_at DESC';
    const result: QueryResult<any> = await this.pool.query(query, [userId]);
    return result.rows.map(row => this.mapRowToQRCode(row));
  }

  // Update QR code status (with transaction to include history)
  async updateStatus(
    qrCodeId: string, 
    newStatus: QRCodeStatus, 
    userId: string, 
    assignToUserId?: string,
    notes?: string
  ): Promise<QRCode | null> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get current QR code
      const getCurrentQuery = 'SELECT * FROM qr_codes WHERE id = $1';
      const currentResult = await client.query(getCurrentQuery, [qrCodeId]);
      
      if (currentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const currentQRCode = this.mapRowToQRCode(currentResult.rows[0]);
      
      // Update QR code
      const updateQuery = `
        UPDATE qr_codes 
        SET status = $1, user_id = $2
        WHERE id = $3
        RETURNING *
      `;
      
      const updateResult = await client.query(updateQuery, [
        newStatus,
        assignToUserId || currentQRCode.userId,
        qrCodeId
      ]);
      
      // Add to status history
      const historyQuery = `
        INSERT INTO status_history (qr_code_id, from_status, to_status, changed_by, notes)
        VALUES ($1, $2, $3, $4, $5)
      `;
      
      await client.query(historyQuery, [
        qrCodeId,
        currentQRCode.status,
        newStatus,
        userId,
        notes
      ]);
      
      await client.query('COMMIT');
      return this.mapRowToQRCode(updateResult.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get status history for a QR code
  async getStatusHistory(qrCodeId: string): Promise<StatusHistory[]> {
    const query = `
      SELECT sh.*, u.first_name, u.last_name, u.email
      FROM status_history sh
      JOIN users u ON sh.changed_by = u.id
      WHERE sh.qr_code_id = $1
      ORDER BY sh.changed_at DESC
    `;
    
    const result: QueryResult<any> = await this.pool.query(query, [qrCodeId]);
    return result.rows.map(row => ({
      id: row.id,
      qrCodeId: row.qr_code_id,
      fromStatus: row.from_status as QRCodeStatus,
      toStatus: row.to_status as QRCodeStatus,
      changedBy: row.changed_by,
      changedAt: row.changed_at,
      notes: row.notes,
      // Additional user info for display
      changedByName: `${row.first_name} ${row.last_name}`,
      changedByEmail: row.email
    }));
  }

  // Get all QR codes with pagination
  async findAll(limit: number = 50, offset: number = 0): Promise<QRCode[]> {
    const query = `
      SELECT * FROM qr_codes 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result: QueryResult<any> = await this.pool.query(query, [limit, offset]);
    return result.rows.map(row => this.mapRowToQRCode(row));
  }

  // Create multiple QR codes at once (bulk insert)
  async createBulk(codes: string[]): Promise<QRCode[]> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const values = codes.map(code => `('${code}', 'inactive')`).join(', ');
      const query = `
        INSERT INTO qr_codes (code, status)
        VALUES ${values}
        RETURNING *
      `;
      
      const result = await client.query(query);
      await client.query('COMMIT');
      
      return result.rows.map(row => this.mapRowToQRCode(row));
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Helper method to map database row to QRCode object
  private mapRowToQRCode(row: any): QRCode {
    return {
      id: row.id,
      code: row.code,
      status: row.status as QRCodeStatus,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}