export default interface IAdmin {
  adminId: string;
  email: string;
  password: string;
  name: string;
  role: "SUPERADMIN" | "ADMIN" | "AGENT" | "INFLUENCER";
  isActive?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  lastLogin?: Date[];
  loginAttempts?: number;
  lockUntil?: Date;
  isEmailVerified?: boolean;
}
