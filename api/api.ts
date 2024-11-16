import axios, { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { BasicUserData, RoomParticipant, UserProfile } from '~/data/types';
import { gamePalsPlaceholder } from '~/data/schema/placeholder';

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

export interface TopicsResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
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

    console.log('API Response | Google user signed in:', response.data);
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

// Get the user's ID from the store
export const getUserIdFromStore = async (): Promise<UserProfile | null> => {
  try {
    const user = await SecureStore.getItemAsync('profile');
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error('Error retrieving user ID from store:', error);
    return null;
  }
};

export const UserApi = {
  getUser: async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`/users/user/${id}`);
    return response.data;
  },
  updateUser: async (userData: any, id: number): Promise<any> => {
    const response = await axiosInstance.patch(`/users/user/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: number): Promise<void> => {
    console.log('API: Deleting user with ID:', id);
    // await axiosInstance.delete(`/users/user/${id}`);
  },
  getGamePals: async (page: number, take = 10): Promise<BasicUserData[]> => {
    const id = (await getUserIdFromStore()).id;
    const skip = (page - 1) * take;
    const response = await axiosInstance.get(`users/user/${id}/game-pals`, {
      params: {
        skip,
        take,
      },
    });
    console.log('API Response | Game Pals: ', response.data);
    return gamePalsPlaceholder;
  },
};

export const TopicsApi = {
  getTopics: async (page = 1, limit = 10): Promise<TopicsResponse[]> => {
    const response = await axiosInstance.get('/topics', {
      params: {
        skip: (page - 1) * limit,
        take: limit,
      },
    });
    // console.log('API Response | Topics: ', response.data);
    return response.data;
  },
  getTopic: async (id: number): Promise<TopicsResponse> => {
    const response = await axiosInstance.get(`/topics/${id}`);
    return response.data;
  },
  createTopic: async (topicData: any): Promise<TopicsResponse> => {
    const response = await axiosInstance.post('/topics/new-topic', topicData);
    return response.data;
  },
  updateTopic: async (id: number, topicData: any): Promise<TopicsResponse> => {
    const response = await axiosInstance.put(`/topics/${id}`, topicData);
    return response.data;
  },
  deleteTopic: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/topics/${id}`);
  },
};

export const RoomApi = {
  getPlayersInRoom: async (roomId: string): Promise<any[]> => {
    const response = await axiosInstance.get(`/rooms/:id/players?roomId=${roomId}`);
    /* console.log('API Response | Players in this room: ', response.data); */
    return response.data;
  },
};
