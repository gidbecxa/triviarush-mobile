import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';

type UseStateHook<T> = [T, (value: T) => void];

export function useStorageState<T>(key: string, initialValue: T): UseStateHook<T> {
    const [state, setState] = React.useState<T>(() => {
        try {
            const value = SecureStore.getItem(key);
            return value !== null ? JSON.parse(value) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const updateState = (newValue: T) => {
        setState(newValue);
        try {
            SecureStore.setItem(key, JSON.stringify(newValue));
        } catch (error) {
            console.error(`Error storing ${key}: ${error}`);
        }
    };

    return [state, updateState];
}