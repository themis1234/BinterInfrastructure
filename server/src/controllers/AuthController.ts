import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterRequest, LoginRequest, UserRole } from '../types';

export class AuthController {
  constructor(private authService: AuthService) {}

  // Register a new user
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: RegisterRequest = req.body;
      const result = await this.authService.register(userData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            user: result.user,
            token: result.token
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Register controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Login user
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginRequest = req.body;
      const result = await this.authService.login(credentials);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            user: result.user,
            token: result.token
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get user profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getProfile(userId);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            user: result.user
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Update user role (admin only)
  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
        return;
      }

      const result = await this.authService.updateUserRole(userId, role);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            user: result.user
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Update user role controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  // Get all users (admin only)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.getAllUsers();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            users: result.users
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get all users controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}