import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '~/components/interface/LoadingScreen';
import { supabase } from '~/utils/supabaseClient';

interface AppContextProps {
  isFirstLaunch: boolean | null;
  setIsFirstLaunch: (value: boolean) => void;
  isNewUser: boolean | null;
  setIsNewUser: (value: boolean) => void;
  isDarkMode: boolean | null;
  setIsDarkMode: (value: boolean) => void;
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
  // userToken: string | null;
  // setUserToken: (value: string | null) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAppState = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('@isFirstLaunch');
        setIsFirstLaunch(firstLaunch !== null ? JSON.parse(firstLaunch) : true);

        const newUser = await AsyncStorage.getItem('@isNewUser');
        setIsNewUser(newUser !== null ? JSON.parse(newUser) : true);

        const darkMode = await AsyncStorage.getItem('@isDarkMode');
        setIsDarkMode(darkMode !== null ? JSON.parse(darkMode) : false);

        const loggedIn = await AsyncStorage.getItem('@isLoggedIn');
        setIsLoggedIn(loggedIn !== null ? JSON.parse(darkMode) : false);

        /* const token = await AsyncStorage.getItem('@userToken');
        setUserToken(token !== null ? token : null); */
      } catch (error) {
        console.error('Error loading app state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppState();
  }, []);

  useEffect(() => {
    const saveAppState = async () => {
      try {
        if (isFirstLaunch !== null) {
          await AsyncStorage.setItem('@isFirstLaunch', JSON.stringify(isFirstLaunch));
        }
        if (isNewUser !== null) {
          await AsyncStorage.setItem('@isNewUser', JSON.stringify(isNewUser));
        }
        if (isDarkMode !== null) {
          await AsyncStorage.setItem('@isDarkMode', JSON.stringify(isDarkMode));
        }
        if (isLoggedIn !== null) {
          await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(isLoggedIn));
        }
        /* if (userToken !== null) {
          await AsyncStorage.setItem('@userToken', userToken);
        } */
      } catch (error) {
        console.error('Failed to save app state:', error);
      }
    };

    saveAppState();
  }, [isFirstLaunch, isNewUser, isDarkMode, isLoggedIn]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppContext.Provider
      value={{
        isFirstLaunch,
        setIsFirstLaunch,
        isNewUser,
        setIsNewUser,
        isDarkMode,
        setIsDarkMode,
        isLoggedIn,
        setIsLoggedIn,
        /* userToken,
        setUserToken, */
        loading,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
