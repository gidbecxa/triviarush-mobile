import { useEffect } from 'react';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const useSocket = () => {
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const profile = await SecureStore.getItemAsync('profile');
        const userId = profile ? JSON.parse(profile).id : null;

        if (!userId) {
          console.log('No user ID found');
          return;
        }

        const socket = io('http://192.168.43.135:3000', {
          query: {
            userId: userId,
          },
        });

        socket.on('connect', () => {
          console.log('Connected to the socket server!');
          socket.emit('userOnline', { userId });
        });

        // Handle onlineStatus event
        socket.on('onlineStatus', async (status) => {
          console.log(`Player ${status.userId} is now ${status.status}!`);
          const userProfileUpdated = {
            ...JSON.parse(profile),
            isOnline: status.status === 'online',
          };
          await SecureStore.setItemAsync('profile', JSON.stringify(userProfileUpdated));
        })

        socket.on('disconnect', () => {
          console.log('Disconnected from the socket server');
          socket.emit('userOffline', { userId });
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
