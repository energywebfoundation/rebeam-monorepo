import axios from 'axios';

export interface HttpRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private instance: ReturnType<typeof axios.create>;

  constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async request<T>(config: HttpRequestConfig): Promise<T> {
    const response = await this.instance.request({
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      timeout: config.timeout,
    });
    return response.data;
  }

  async get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'GET', ...config });
  }

  async post<T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'POST', data, ...config });
  }

  async put<T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data, ...config });
  }

  async delete<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', ...config });
  }
}
