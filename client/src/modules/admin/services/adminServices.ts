import axios, { AxiosResponse } from 'axios';
import { BaseAPI } from '../../../shared/services/basiAPI';
import { APIResponse } from '../../../shared/services/APIResponse';
import { left, right } from '../../../shared/core/either';
import { Result } from '../../../shared/core/result';
import { AuthService } from './authServices';
import { LoginFormData } from '../components/LoginForm';
import Admin from '../model/admin';
import { PaginatedResponse } from '../../../shared/core/PaginatedResponse';
import { CreateAdminData } from '../components/CreateAdminForm';
import { ResetPasswordFormType } from '../../../pages/Authentication/ResetPassword';

export interface IAdminService {
  adminLogin(rawData: LoginFormData): Promise<APIResponse<void>>;
  getCurrentAdminProfile(): Promise<APIResponse<Admin>>;
  logout(): Promise<APIResponse<void>>;
  createAdmin(data: CreateAdminData): Promise<APIResponse<void>>;
  verifiyEmail(token: string): Promise<APIResponse<void>>;
  changePassword(
    oldPassword: string,
    password: string,
  ): Promise<APIResponse<void>>;
  blockAdmin(adminId: string): Promise<APIResponse<void>>;
  resetPassword(
    data: ResetPasswordFormType,
    token: string,
  ): Promise<APIResponse<void>>;
}

export class AdminService extends BaseAPI implements IAdminService {
  constructor(authService: AuthService) {
    super(authService);
  }

  public async createInfluencer(data: {
    name: string;
    email: string;
    referalCode: string;
    password: string;
  }) {
    try {
      (await this.post('/admins/create-influencer', data)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }
  public async createAgent(data: {
    name: string;
    email: string;
    referalCode: string;
    password: string;
  }) {
    try {
      (await this.post('/admins/create-agent', data)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async resetPassword(
    data: ResetPasswordFormType,
    token: string,
  ): Promise<APIResponse<void>> {
    try {
      (await this.post(`/admins/reset-password`, {
        password: data.password,
        token: token,
      })) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async sendresetLinkToEmail(email: string): Promise<APIResponse<void>> {
    try {
      (await this.get(`/admins/send-forgot-request/${email}`)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }
  public async blockAdmin(adminId: string): Promise<APIResponse<void>> {
    try {
      (await this.get(`/admins/block-admin/${adminId}`)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async changePassword(
    oldPassword: string,
    password: string,
  ): Promise<APIResponse<void>> {
    try {
      (await this.post(`/admins/change-password`, {
        oldPassword: oldPassword,
        password: password,
      })) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async logout(): Promise<APIResponse<void>> {
    try {
      (await this.get(`/admins/logout`)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async verifiyEmail(token: string): Promise<APIResponse<void>> {
    try {
      const resp = (await this.get(`/admins/verifiy-email`, {
        token: token,
      })) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async createAdmin(data: CreateAdminData): Promise<APIResponse<void>> {
    try {
      (await this.post('/admins', data)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async getCurrentAdminProfile(): Promise<APIResponse<Admin>> {
    try {
      const response = (await this.get('/admins/getme')) as AxiosResponse;
      return right(Result.ok<Admin>(response.data));
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async adminLogin(rawData: LoginFormData): Promise<APIResponse<void>> {
    try {
      (await this.post('/admins/login', rawData)) as AxiosResponse;

      return right(Result.ok<void>());
    } catch (error) {
      console.error(error);
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }

  public async getAllAdmins(filters: {
    page: string;
    limit: string;
    q: string;
  }): Promise<APIResponse<PaginatedResponse<Admin>>> {
    try {
      const { q, page, limit } = filters;
      const params: Record<string, unknown> = {
        q,
        page,
        limit,
      };
      const response: AxiosResponse = await this.get('/admins', { ...params });

      return right(
        Result.ok<PaginatedResponse<Admin>>({
          items: response.data.items.map((item: unknown) => item as Admin),
          offset: response.data.offset,
          page: response.data.page,
          totalCount: response.data.totalCount,
        }),
      );
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Connection failed';
      return left(errMessage);
    }
  }
}
