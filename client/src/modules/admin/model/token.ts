export type JWTToken = string;

export interface JWTTokenClaims {
  adminId: string;
  isEmailVerified: boolean;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
}
