import axios, { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

// types for the user info and API response
export interface GoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

interface GoogleSignInParams {
  idToken: string;
  // user: GoogleUser;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
  newUser: boolean;
}

// types for the decoded token
type DecodedToken = {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
};

// configure the token cache
export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  removeToken: (key: string) => Promise<void>;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// create an axios instance with the base URL set to the API URL
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to decode the JWT token
const decodeToken = (token: string): DecodedToken => {
  return jwtDecode(token);
};

// Helper function to get token from Store
const getTokenFromStore = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error retrieving token from store:', error);
    return null;
  }
};

// Add interceptors for request and response
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getTokenFromStore('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getTokenFromStore('refreshToken');
        if (refreshToken) {
          const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
          if (response.data.accessToken) {
            await SecureStore.setItemAsync('accessToken', response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// set default timeout
axiosInstance.defaults.timeout = 10000;

export const AuthApi = {
  signInWithGoogle: async (params: GoogleSignInParams): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/mobile/google-signin', {
      idToken: params.idToken,
      // user: params.user,
    });

    console.log('API Response | Google user signed in:');
    return response.data;
  },
  googleWebSignIn: async (params: GoogleSignInParams): Promise<AuthResponse> => {
    const config: AxiosRequestConfig = {
      data: {
        idToken: params.idToken,
        // user: params.user
      },
    };
    const response = await axiosInstance.get<AuthResponse>('/auth/google', config);
    return response.data
  },
  signUp: async (userData: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },
  signIn: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  signOut: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
  verifyToken: async (token: string): Promise<DecodedToken> => {
    return decodeToken(token);
  },
  getTokenFromStore: getTokenFromStore,
};

export const UserApi = {
  getUser: async (): Promise<any> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
  updateUser: async (userData: any): Promise<any> => {
    const response = await axiosInstance.put('/auth/me', userData);
    return response.data;
  },
  deleteUser: async (): Promise<void> => {
    await axiosInstance.delete('/auth/me');
  },
}
