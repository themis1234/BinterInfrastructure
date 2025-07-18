import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { QRCodeController } from '../controllers/QRCodeController';
import { AuthService } from '../services/AuthService';
import { QRCodeService } from '../services/QRCodeService';
import { UserRepository } from '../repositories/UserRepository';
import { QRCodeRepository } from '../repositories/QRCodeRepository';
import { pool } from '../database/config';
import { authenticate, requireEmployee, requireAdmin } from '../utils/auth';

const userRepository = new UserRepository(pool);
const qrCodeRepository = new QRCodeRepository(pool);

const authService = new AuthService(userRepository);
const qrCodeService = new QRCodeService(qrCodeRepository);

const authController = new AuthController(authService);
const qrCodeController = new QRCodeController(qrCodeService);

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'QR Code Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);
router.put('/auth/users/:userId/role', authenticate, requireAdmin, authController.updateUserRole);
router.get('/auth/users', authenticate, requireAdmin, authController.getAllUsers);

// QR Code routes for regular users
router.get('/qr-codes/inactive', authenticate, qrCodeController.getInactiveQRCodes);
router.post('/qr-codes/activate', authenticate, qrCodeController.activateQRCode);
router.get('/qr-codes/my-codes', authenticate, qrCodeController.getUserQRCodes);
router.get('/qr-codes/status/:status', authenticate, qrCodeController.getQRCodesByStatus);

// Employee routes
router.post('/qr-codes/complete', authenticate, requireEmployee, qrCodeController.completeQRCode);
router.get('/qr-codes/:qrCodeId/details', authenticate, qrCodeController.getQRCodeDetails);
router.get('/qr-codes', authenticate, qrCodeController.getAllQRCodes);

// Admin only routes
router.post('/qr-codes', authenticate, requireAdmin, qrCodeController.createQRCode);
router.post('/qr-codes/bulk', authenticate, requireAdmin, qrCodeController.createBulkQRCodes);

export default router;