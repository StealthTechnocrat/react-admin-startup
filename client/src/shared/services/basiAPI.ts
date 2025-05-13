import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import forge from 'node-forge';
import { app } from '../../config';
import { AuthService } from '../../modules/admin/services/authServices';
import { toast } from '../hooks/use-toast';

export abstract class BaseAPI {
  protected baseUrl: string;
  protected axiosInstance: AxiosInstance;
  protected authService: AuthService; // Define the appropriate type for authService

  constructor(authService: AuthService) {
    this.baseUrl = app.baseUrl ? app.baseUrl : '';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    this.authService = authService;
    this.enableInterceptors();
  }

  private enableInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Attach token from Cookies

        // Attach token from authService
        if (this.authService) {
          const accessToken = this.authService.getToken();
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        }

        // Generate signature
        const signature = this.generateSignature(config);
        if (signature) {
          config.headers['x-signature'] = signature;
        }

        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      this.getSuccessResponseHandler(),
      this.getErrorResponseHandler(),
    );
  }

  private getSuccessResponseHandler() {
    return (response: AxiosResponse) => response;
  }

  private didAccessTokenExpire(response: AxiosResponse): boolean {
    return response.data.message === 'Token signature expired.';
  }

  private getErrorResponseHandler() {
    return async (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        // If token expired or backend sends "Please Login", redirect to /login
        if (status === 401 && this.didAccessTokenExpire(error.response)) {
          this.authService.removeToken();
          window.location.replace('/login?session=expired'); // replace() to prevent back navigationtoast({ title: 'Session Expired' });
        } else if (
          data?.message ===
          'Auth token not found. Admin is probably not logged in. Please login again.'
        ) {
          this.authService.removeToken();
          window.location.replace('/login?session=logout');
        }
      }

      return Promise.reject(error);
    };
  }

  private generateSignature(config: AxiosRequestConfig): string | undefined {
    const xPrivateKey = app.xPrivateKey;
    const method = config.method?.toUpperCase();
    const timestamp = Date.now().toString();

    if (!config.headers) {
      config.headers = {};
    }

    const stringToSign = `${method}${timestamp}`;
    const privateKey = forge.pki.privateKeyFromPem(`${xPrivateKey}`);

    const md = forge.md.sha256.create();
    md.update(stringToSign, 'utf8');
    const signature = privateKey.sign(md);

    config.headers['x-timestamp'] = timestamp;

    return forge.util.encode64(signature);
  }

  private constructUrl(endpoint: string): string {
    return endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;
  }

  protected get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(this.constructUrl(url), {
      params: params || {}, // Default to empty object
      headers: headers || {}, // Default to empty object
    });
  }

  protected post<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(this.constructUrl(url), data, {
      params: params || {}, // Default to empty object
      headers: headers || {}, // Default to empty object
    });
  }

  protected put<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(this.constructUrl(url), data, {
      params: params || {}, // Default to empty object
      headers: headers || {}, // Default to empty object
    });
  }

  protected delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(this.constructUrl(url), {
      params: params || {}, // Default to empty object
      headers: headers || {}, // Default to empty object
    });
  }
}
