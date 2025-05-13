export default interface IAdminSession {
  adminSessionId: string;
  adminId: string;
  token: string;
  isDeleted?: boolean;
  expiryDate: Date;
  reply?: string;
}
