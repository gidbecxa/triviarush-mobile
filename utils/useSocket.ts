import { useEffect } from 'react';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '~/data/types';

const useSocket = (setProfile: (profile: UserProfile) => void) => {
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const profileData = await SecureStore.getItemAsync('profile');
        const profile: UserProfile | null = profileData ? JSON.parse(profileData) : null;

        if (!profile || !profile.id) {
          console.log('No user ID found');
          return;
        }

        const socket = io('http://192.168.43.135:3000', {
          query: {
            userId: Number(profile.id),
          },
        });

        socket.on('connect', () => {
          console.log('Connected to the socket server!');
          socket.emit('userOnline', { userId: profile.id });
        });

        // Handle onlineStatus event
        socket.on('onlineStatus', async (status: {userId: number; status: 'online' | 'offline'}) => {
          console.log(`Player ${status.userId} is now ${status.status}!`);
          const profileUpdated = {
            ...profile,
            isOnline: status.status === 'online',
          };
          await SecureStore.setItemAsync('profile', JSON.stringify(profileUpdated));
          setProfile(profileUpdated);
        })

        socket.on('disconnect', () => {
          console.log('Disconnected from the socket server');
          socket.emit('userOffline', { userId: profile.id });
        });

        return () => {
          socket.close();
        };
      } catch (error) {
        console.log('Error setting up socket connection', error);
      }
    };

    setupSocket();
  }, []);
};

export default useSocket;
