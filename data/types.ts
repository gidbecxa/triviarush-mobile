export interface UserProfile {
  id: number;
  avatar: string;
  bio: string | null;
  createdAt: string | null;
  email: string;
  isOnline: boolean;
  location: string | null;
  phoneNumber: string | null;
  points: number;
  refreshToken: string | null;
  skillLevel: string;
  coins: number;
  topics: string[];
  updatedAt: string | null;
  username: string;
  numberOfWins: number | null;
  gamesPlayed: number | null;
  isLoggedIn?: boolean | null;
  multipleDevicesAllowed?: boolean | null;
}

export interface BasicUserData {
  id: number;
  username: string;
  avatar: string;
  topics?: string[];
  bio?: string | null;
  skillLevel?: string;
  // location?: string | null;
};

export interface Room {
  id: number;
  title: string;
  category: string;
  state: string;
  createdAt: string | null;
  participants?: any[] | null;
  messages?: Message[] | null;
}

export interface RoomParticipant {
  id: number;
  username: string;
  avatar: string;
  bio: string | null;
  skillLevel: string;
}

export interface TriviaSpecial {
  id: number
  title: string
  caption: string
  description: string | null
  rewardId: number
  reward?: any[] | null
  category: string
  type: string;
  numberOfPlayers: number
  playTime: number
  timePerQuestion: number
  avatar: string | null
  gameStatus: string
  questions: any[] | null
  createdAt: string
  updatedAt: string
  dueDate: string | null
}

export interface Message {
  id: number;
  text: string;
  createdAt: string;
  system: boolean;
  user: BasicUserData;
  clientId: string;
}

export interface Question {
  id: number;
  text: string;
  options: string;
  answer: string;
  category: string;
  level: string;
}