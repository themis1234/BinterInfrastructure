import { Request, Response } from 'express';
import { QRCodeService } from '../services/QRCodeService';
import { QRCodeStatus } from '../types';

export class QRCodeController {
  constructor(private qrCodeService: QRCodeService) {}

  // Get all inactive QR codes (available for activation)
  getInactiveQRCodes = async (req: Request, res: Response): Promise<void> => {
    try {
      const qrCodes = await this.qrCodeService.getInactiveQRCodes();
      
      res.status(200).json({
        success: true,
        message: 'Inactive QR codes retrieved successfully',
        data: {
          qrCodes
        }
      });
    } catch (error) {
      console.error('Get inactive QR codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Activate a QR code (user scans it)
  activateQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { qrCodeId } = req.body;
      const userId = req.user!.userId;
      
      if (!qrCodeId) {
        res.status(400).json({
          success: false,
          message: 'QR code ID is required'
        });
        return;
      }

      const result = await this.qrCodeService.activateQRCode(qrCodeId, userId);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            qrCode: result.qrCode
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Activate QR code error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Complete a QR code (employee marks as completed)
  completeQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { qrCodeId, notes } = req.body;
      const employeeId = req.user!.userId;
      
      if (!qrCodeId) {
        res.status(400).json({
          success: false,
          message: 'QR code ID is required'
        });
        return;
      }

      const result = await this.qrCodeService.completeQRCode(qrCodeId, employeeId, notes);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            qrCode: result.qrCode
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Complete QR code error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get QR codes assigned to current user
  getUserQRCodes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const qrCodes = await this.qrCodeService.getUserQRCodes(userId);
      
      res.status(200).json({
        success: true,
        message: 'User QR codes retrieved successfully',
        data: {
          qrCodes
        }
      });
    } catch (error) {
      console.error('Get user QR codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get QR codes by status (employees/admins)
  getQRCodesByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      
      if (!Object.values(QRCodeStatus).includes(status as QRCodeStatus)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
        return;
      }

      const qrCodes = await this.qrCodeService.getQRCodesByStatus(status as QRCodeStatus);
      
      res.status(200).json({
        success: true,
        message: `QR codes with status ${status} retrieved successfully`,
        data: {
          qrCodes
        }
      });
    } catch (error) {
      console.error('Get QR codes by status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get QR code details with history
  getQRCodeDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { qrCodeId } = req.params;
      
      const result = await this.qrCodeService.getQRCodeDetails(qrCodeId);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'QR code details retrieved successfully',
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get QR code details error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Create new QR code (admin only)
  createQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.body;
      
      if (!code) {
        res.status(400).json({
          success: false,
          message: 'QR code value is required'
        });
        return;
      }

      const result = await this.qrCodeService.createQRCode(code);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            qrCode: result.qrCode
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Create QR code error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Bulk create QR codes (admin only)
  createBulkQRCodes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codes } = req.body;
      
      if (!Array.isArray(codes) || codes.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Codes array is required and must not be empty'
        });
        return;
      }

      const result = await this.qrCodeService.createBulkQRCodes(codes);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            qrCodes: result.qrCodes
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Create bulk QR codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get all QR codes with pagination (admin/employee)
  getAllQRCodes = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const qrCodes = await this.qrCodeService.getAllQRCodes(limit, offset);
      
      res.status(200).json({
        success: true,
        message: 'QR codes retrieved successfully',
        data: {
          qrCodes,
          pagination: {
            limit,
            offset,
            count: qrCodes.length
          }
        }
      });
    } catch (error) {
      console.error('Get all QR codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}