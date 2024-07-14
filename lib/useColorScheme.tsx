import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

import { COLORS } from '~/theme/colors';

function useColorScheme() {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();

  async function setColorScheme(colorScheme: 'light' | 'dark') {
    setNativeWindColorScheme(colorScheme);
    if (Platform.OS !== 'android') return;
    try {
      await setNavigationBar();
    } catch (error) {
      console.error('useColorScheme.tsx", "setColorScheme', error);
    }
  }

  function toggleColorScheme() {
    return setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  }

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
    colors: COLORS.common,
  };
}

/**
 * Set the Android navigation bar color based on the color scheme.
 */
function useInitialAndroidBarSync() {
  const { colorScheme } = useColorScheme();
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    setNavigationBar().catch((error) => {
      console.error('useColorScheme.tsx", "useInitialColorScheme', error);
    });
  }, []);
}

export { useColorScheme, useInitialAndroidBarSync };

function setNavigationBar() {
  return Promise.all([
    NavigationBar.setButtonStyleAsync('light'),
    NavigationBar.setPositionAsync('absolute'),
    NavigationBar.setBackgroundColorAsync('#00000030'),
  ]);
}
