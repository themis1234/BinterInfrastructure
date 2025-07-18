// User roles - extensible for future user types
export enum UserRole {
  USER = 'user',
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

// QR Code status - extensible for future stages
export enum QRCodeStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

// User interface
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// QR Code interface
export interface QRCode {
  id: string;
  code: string; // The actual QR code value
  status: QRCodeStatus;
  userId?: string; // null when inactive, set when activated
  createdAt: Date;
  updatedAt: Date;
}

// Status history for audit trail
export interface StatusHistory {
  id: string;
  qrCodeId: string;
  fromStatus: QRCodeStatus;
  toStatus: QRCodeStatus;
  changedBy: string; // user ID who made the change
  changedAt: Date;
  notes?: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ActivateQRCodeRequest {
  qrCodeId: string;
}

export interface CompleteQRCodeRequest {
  qrCodeId: string;
  notes?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}