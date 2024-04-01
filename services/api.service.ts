import { refreshSpotifyToken } from './auth.service';

interface ApiServiceOptions {
  isAuthUrl?: boolean;
  method?: string;
  body?: any;
  endpoint?: string;
}

interface ServiceFunctions {
  get: (endpoint: string, body?: any) => Promise<any>;
  post: (endpoint: string, body?: any) => Promise<any>;
  put: (endpoint: string, body?: any) => Promise<any>;
  delete: (endpoint: string, body?: any) => Promise<any>;
}

const apiService = async ({
  isAuthUrl = false,
  method = 'GET',
  body = null,
  endpoint = ''
}: ApiServiceOptions): Promise<any> => {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const defaultOptions = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body
  };

  const authOptions = {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body && new URLSearchParams(body)
  };

  const options = isAuthUrl ? authOptions : defaultOptions;
  const baseUrl = isAuthUrl ? process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL : process.env.NEXT_PUBLIC_SPOTIFY_API_URL;

  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (!isAuthUrl && refreshToken) {
        await refreshSpotifyToken();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }

    try {
      return await response.json();
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const createServiceFunctions = (isAuthUrl: boolean): ServiceFunctions => ({
  get: (endpoint, body) => apiService({ isAuthUrl, method: 'GET', endpoint, body }),
  post: (endpoint, body) => apiService({ isAuthUrl, method: 'POST', endpoint, body }),
  put: (endpoint, body) => apiService({ isAuthUrl, method: 'PUT', endpoint, body }),
  delete: (endpoint, body) => apiService({ isAuthUrl, method: 'DELETE', endpoint, body })
});

export const baseService: ServiceFunctions = createServiceFunctions(false);
export const authService: ServiceFunctions = createServiceFunctions(true);
