import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export class AxiosService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({});
  }

  // Generic GET method
  async get<T>(endpoint: string, params = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  }

  // Generic POST method
  async post<T>(
    endpoint: string,
    data: object,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data, {
        params: params || {}, // Default to empty object
        headers: headers || {}, // Default to empty object
      });
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  }
}
