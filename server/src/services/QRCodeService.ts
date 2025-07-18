import { QRCodeRepository } from '../repositories/QRCodeRepository';
import { QRCode, QRCodeStatus, UserRole } from '../types';

export class QRCodeService {
  constructor(private qrCodeRepo: QRCodeRepository) {}

  // Get all inactive QR codes (available for activation)
  async getInactiveQRCodes(): Promise<QRCode[]> {
    return await this.qrCodeRepo.findByStatus(QRCodeStatus.INACTIVE);
  }

  // Activate a QR code (user scans it)
  async activateQRCode(qrCodeId: string, userId: string): Promise<{ success: boolean; message: string; qrCode?: QRCode }> {
    try {
      // Check if QR code exists
      const qrCode = await this.qrCodeRepo.findByCode(qrCodeId);
      if (!qrCode) {
        return { success: false, message: 'QR code not found' };
      }

      // Check if QR code is inactive
      if (qrCode.status !== QRCodeStatus.INACTIVE) {
        return { success: false, message: 'QR code is not available for activation' };
      }

      // Activate the QR code
      const updatedQRCode = await this.qrCodeRepo.updateStatus(
        qrCode.id,
        QRCodeStatus.ACTIVE,
        userId,
        userId, // assign to the user who activated it
        'QR code activated by user'
      );

      if (!updatedQRCode) {
        return { success: false, message: 'Failed to activate QR code' };
      }

      return { 
        success: true, 
        message: 'QR code activated successfully',
        qrCode: updatedQRCode
      };

    } catch (error) {
      console.error('Error activating QR code:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Complete a QR code (employee marks it as completed)
  async completeQRCode(
    qrCodeId: string, 
    employeeId: string, 
    notes?: string
  ): Promise<{ success: boolean; message: string; qrCode?: QRCode }> {
    try {
      // Check if QR code exists
      const qrCode = await this.qrCodeRepo.findById(qrCodeId);
      if (!qrCode) {
        return { success: false, message: 'QR code not found' };
      }

      // Check if QR code is active
      if (qrCode.status !== QRCodeStatus.ACTIVE) {
        return { success: false, message: 'QR code must be active to complete' };
      }

      // Complete the QR code
      const updatedQRCode = await this.qrCodeRepo.updateStatus(
        qrCodeId,
        QRCodeStatus.COMPLETED,
        employeeId,
        qrCode.userId, // keep the same user assignment
        notes || 'QR code completed by employee'
      );

      if (!updatedQRCode) {
        return { success: false, message: 'Failed to complete QR code' };
      }

      return { 
        success: true, 
        message: 'QR code completed successfully',
        qrCode: updatedQRCode
      };

    } catch (error) {
      console.error('Error completing QR code:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Get QR codes assigned to a user
  async getUserQRCodes(userId: string): Promise<QRCode[]> {
    return await this.qrCodeRepo.findByUserId(userId);
  }

  // Get QR codes by status (for employees/admins)
  async getQRCodesByStatus(status: QRCodeStatus): Promise<QRCode[]> {
    return await this.qrCodeRepo.findByStatus(status);
  }

  async getQRCodeDetails(qrCodeId: string) {
    try {
      const qrCode = await this.qrCodeRepo.findById(qrCodeId);
      if (!qrCode) {
        return { success: false, message: 'QR code not found' };
      }

      const history = await this.qrCodeRepo.getStatusHistory(qrCodeId);

      return {
        success: true,
        data: {
          qrCode,
          history
        }
      };

    } catch (error) {
      console.error('Error getting QR code details:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Create new QR codes (admin only)
  async createQRCode(code: string): Promise<{ success: boolean; message: string; qrCode?: QRCode }> {
    try {
      const existingCode = await this.qrCodeRepo.findByCode(code);
      if (existingCode) {
        return { success: false, message: 'QR code already exists' };
      }

      const qrCode = await this.qrCodeRepo.create(code);
      return { 
        success: true, 
        message: 'QR code created successfully',
        qrCode 
      };

    } catch (error) {
      console.error('Error creating QR code:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Bulk create QR codes (admin only)
  async createBulkQRCodes(codes: string[]): Promise<{ success: boolean; message: string; qrCodes?: QRCode[] }> {
    try {
      // Remove duplicates
      const uniqueCodes = [...new Set(codes)];
      
      const existingCodes = [];
      for (const code of uniqueCodes) {
        const existing = await this.qrCodeRepo.findByCode(code);
        if (existing) {
          existingCodes.push(code);
        }
      }

      if (existingCodes.length > 0) {
        return { 
          success: false, 
          message: `Some QR codes already exist: ${existingCodes.join(', ')}` 
        };
      }

      const qrCodes = await this.qrCodeRepo.createBulk(uniqueCodes);
      return { 
        success: true, 
        message: `${qrCodes.length} QR codes created successfully`,
        qrCodes 
      };

    } catch (error) {
      console.error('Error creating bulk QR codes:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Get all QR codes with pagination (admin/employee)
  async getAllQRCodes(limit: number = 50, offset: number = 0): Promise<QRCode[]> {
    return await this.qrCodeRepo.findAll(limit, offset);
  }
}