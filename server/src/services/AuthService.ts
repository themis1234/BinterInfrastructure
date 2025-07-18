import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole, LoginRequest, RegisterRequest, JWTPayload } from '../types';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  // Register a new user
  async register(userData: RegisterRequest): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'>; token?: string }> {
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return { success: false, message: 'All fields are required' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Invalid email format' };
      }

      // Validate password strength
      if (userData.password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long' };
      }

      // Check if user already exists
      const existingUser = await this.userRepo.findByEmail(userData.email);
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await this.userRepo.create({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.USER // Default role
      });

      // Generate token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      const token = generateToken(tokenPayload);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'>; token?: string }> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return { success: false, message: 'Email and password are required' };
      }

      // Find user
      const user = await this.userRepo.findByEmail(credentials.email.toLowerCase());
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Check password
      const passwordMatch = await comparePassword(credentials.password, user.password);
      if (!passwordMatch) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Generate token
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      const token = generateToken(tokenPayload);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Get user profile
  async getProfile(userId: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Profile retrieved successfully',
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    try {
      const user = await this.userRepo.updateRole(userId, newRole);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'User role updated successfully',
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Update role error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<{ success: boolean; message: string; users?: Omit<User, 'password'>[] }> {
    try {
      const users = await this.userRepo.findAll();
      const usersWithoutPasswords = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        message: 'Users retrieved successfully',
        users: usersWithoutPasswords
      };

    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
}