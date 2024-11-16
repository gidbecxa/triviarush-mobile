import { useCallback, useEffect } from "react";
import { useSocket } from "./socketContext";
import * as SecureStore from 'expo-secure-store';
import { Room, TriviaSpecial, UserProfile } from '~/data/types';
import { debounce, throttle } from "lodash";

export const useHomeSocket = (
    setProfile: (profile: UserProfile) => void,
    setRooms: (rooms: Room[]) => void,
    setNewRoom: (room: Room) => void,
    setUpdatedRoom: (room: Room) => void,
    setSpecialTrivias: (trivias: TriviaSpecial[]) => void
) => {
    const { socket } = useSocket();

    const fetchRooms = useCallback(
        debounce(() => {
            socket?.emit('fetchRooms', (response: any) => {
                if (response?.error) {
                    console.error('Error joining room:', response.error);
                }
            });
        }, 1000),
        [socket]
    );

    const handleOnlineStatus = useCallback(
        debounce(async (status: { userId: number; status: 'online' | 'offline' }) => {
            console.log(`Player ${status.userId} is now ${status.status}!`);

            const profileData = await SecureStore.getItemAsync('profile');
            const profile: UserProfile | null = profileData ? JSON.parse(profileData) : null;

            if (profile) {
                const profileUpdated = {
                    ...profile,
                    isOnline: status.status === 'online',
                };
                await SecureStore.setItemAsync('profile', JSON.stringify(profileUpdated));
                setProfile(profileUpdated);
            }
            
            // fetchRooms();
        }, 1000),
        [setProfile]
    );

    const handleWaitingRooms = useCallback(
        throttle((rooms: Room[]) => {
            console.log('Received waiting rooms!');
            setRooms(rooms);
        }, 5000), // Throttle delay in milliseconds
        [setRooms]
    );

    const handleSpecialTrivias = useCallback(
        throttle((trivias: TriviaSpecial[]) => {
            console.log('Received special trivias!');
            setSpecialTrivias(trivias);
        }, 5000), // Throttle delay in milliseconds
        [setSpecialTrivias]
    );

    const handleNewRoom = useCallback(
        debounce((newRoom: Room) => {
            console.log('New room created:', newRoom);
            setNewRoom(newRoom);
        }, 500),
        [setNewRoom]
    );

    const handleUpdatedRoom = useCallback(
        debounce((updatedRoom: Room) => {
            console.log('Room updated:', updatedRoom);
            setUpdatedRoom(updatedRoom);
        }, 500),
        [setUpdatedRoom]
    );

    useEffect(() => {
        if (!socket) {
            console.log('Socket failed to initialize');
            return;
        }

        fetchRooms();

        socket.on('onlineStatus', handleOnlineStatus);
        socket.on('waitingRooms', handleWaitingRooms);
        socket.on('specialTrivias', handleSpecialTrivias);
        socket.on('newRoom', handleNewRoom);
        socket.on('updatedRoom', handleUpdatedRoom);

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket?.off('onlineStatus', handleOnlineStatus);
            socket?.off('waitingRooms', handleWaitingRooms);
            socket?.off('specialTrivias', handleSpecialTrivias);
            // socket?.off('newRoom', handleNewRoom);
            // socket?.off('updatedRoom', handleUpdatedRoom);
        };
    }, [socket, fetchRooms, handleOnlineStatus, handleWaitingRooms, handleSpecialTrivias, handleNewRoom, handleUpdatedRoom]);
};
