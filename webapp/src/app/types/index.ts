export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`

export interface User{
    email: string
    firstName: string
    lastName: string
    role: string

}
export enum QRCodeStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
export interface QRCode {
  id: string;
  code: string; 
  status: QRCodeStatus;
  userId?: string; // null when inactive, set when activated
}