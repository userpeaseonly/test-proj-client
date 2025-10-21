// Base HTTP client with common functionality
export class BaseApiClient {
  protected baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Initialize with token from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  setAccessToken = (token: string | null) => {
    console.log('🔑 BaseApiClient: Setting access token:', token ? '***token***' : 'null');
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
        console.log('🔑 BaseApiClient: Token saved to localStorage');
      } else {
        localStorage.removeItem('access_token');
        console.log('🔑 BaseApiClient: Token removed from localStorage');
      }
    }
  };

  protected getHeaders = (includeAuth = true): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
      console.log('🔑 BaseApiClient: Including auth header in request');
    } else if (includeAuth && !this.accessToken) {
      console.log('⚠️ BaseApiClient: Auth requested but no token available');
    }

    return headers;
  };

  protected handleResponse = async <T>(response: Response): Promise<T> => {
    console.log('API Response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url: response.url
      });
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.detail || errorJson.message || errorMessage;
      } catch {
        // If not JSON, use the text as is
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as T;
  };
}