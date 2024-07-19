export interface UserProfile {
  id: number;
  avatar: string;
  bio: string | null;
  createdAt: string;
  email: string;
  isOnline: boolean;
  location: string | null;
  phoneNumber: string | null;
  points: number;
  refreshToken: string | null;
  skillLevel: string;
  token: number;
  topics: string[];
  updatedAt: string;
  username: string;
}