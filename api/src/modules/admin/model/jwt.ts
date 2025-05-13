export interface JWTClaims {
    adminId: string;
    email: string;
    name:string
  }
  
export type JWTToken = string;
  
export type SessionId = string;
  
export type RefreshToken = string;
  