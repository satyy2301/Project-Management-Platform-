import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3001/api';

interface ApiOptions {
  method?: string;
  body?: any;
}

export const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', body } = options;
  const token = Cookies.get('auth_token');
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = 'API call failed';
    try {
      const error = JSON.parse(text);
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
