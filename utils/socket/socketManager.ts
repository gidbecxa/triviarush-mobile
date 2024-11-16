// socket configuration and mangaer
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { generateUniqueId } from '../uuid';
let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket | null> => {
  if (socket) return socket;

  const profileData = await SecureStore.getItemAsync('profile');
  const profile = profileData ? JSON.parse(profileData) : null;

  if (!profile || !profile.id) {
    console.log('Socket: User not found');
    throw new Error('User not authenticated');
  }

  // Generate a UUID as an Idempotency measure
  const uuid = generateUniqueId();
  console.log('UUID', uuid);

  socket = io('http://192.168.0.103:3000', {
    query: {
      userId: String(profile.id),
      username: String(profile.username),
      idempotencyId: uuid, // Add the UUID to the query
    },
  });

  socket.on('connect', () => {
    console.log('Socket: Connected to the server!');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the socket server');
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
