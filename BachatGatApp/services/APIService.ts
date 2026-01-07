/**
 * Generic API Service
 * Base service for all API calls with common configuration
 */

// API Base URL Configuration
export const API_BASE_URL = 'https://api.bachatgat.com'; // Replace with your actual API URL

// API Configuration
const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Response Type
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Error Type
export class APIError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API Service Class
 */
class APIService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build headers with authentication
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...API_CONFIG.headers, ...customHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Build full URL
   */
  private buildURL(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Handle API Response
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    let data: any;
    
    if (isJSON) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        data.message || data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return {
      success: true,
      data: data,
      message: data.message,
    };
  }

  /**
   * GET Request
   */
  async get<T = any>(
    endpoint: string,
    queryParams?: Record<string, any>,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    try {
      let url = this.buildURL(endpoint);

      // Add query parameters
      if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(customHeaders),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * POST Request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    try {
      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(customHeaders),
        body: JSON.stringify(body),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * PUT Request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    try {
      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(customHeaders),
        body: JSON.stringify(body),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * PATCH Request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    try {
      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(customHeaders),
        body: JSON.stringify(body),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(error instanceof Error ? error.message : 'Network error');
    }
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    try {
      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(customHeaders),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(error instanceof Error ? error.message : 'Network error');
    }
  }
}

// Create and export singleton instance
const apiService = new APIService();

export default apiService;
