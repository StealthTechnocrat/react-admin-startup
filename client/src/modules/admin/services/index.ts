import { AdminService } from './adminServices';
import { AuthService } from './authServices';

const authService = new AuthService();

const adminService = new AdminService(authService);

export { authService, adminService };
