import React, { createContext, useContext, useEffect, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorage';

interface AuthContextProps {
  isFirstLaunch: boolean;
  setIsFirstLaunch: (value: boolean) => void;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  isFirstLaunch: true,
  setIsFirstLaunch: () => {},
  isNewUser: true,
  setIsNewUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isFirstLaunch, setIsFirstLaunch] = useStorageState<boolean>('isFirstLaunch', true);
  const [isNewUser, setIsNewUser] = useStorageState<boolean>('isNewUser', true);
  const [isLoggedIn, setIsLoggedIn] = useStorageState<boolean>('isLoggedIn', false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isFirstLaunch,
        setIsFirstLaunch,
        isNewUser,
        setIsNewUser,
        isLoggedIn,
        setIsLoggedIn,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
