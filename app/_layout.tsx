import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Link, Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect } from 'react';
import { StyleSheet } from 'nativewind';
import { AuthProvider, useAuthContext } from '~/store/ctx';
import { Provider as PaperProvider } from 'react-native-paper';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

/* export const unstable_settings = {
  initialRouteName: 'get-started',
}; */

SplashScreen.preventAutoHideAsync();

export default function Root() {
  NavigationBar.setVisibilityAsync('hidden');
  NavigationBar.setPositionAsync('relative');
  NavigationBar.setBehaviorAsync('overlay-swipe');

  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    'Prompt-SemiBold': require('~/assets/fonts/Prompt/Prompt-SemiBold.ttf'),
    'Prompt-Regular': require('~/assets/fonts/Prompt/Prompt-Regular.ttf'),
    'Prompt-Medium': require('~/assets/fonts/Prompt/Prompt-Medium.ttf'),
    'Prompt-Light': require('~/assets/fonts/Prompt/Prompt-Light.ttf'),
    'Prompt-Light-Italic': require('~/assets/fonts/Prompt/Prompt-LightItalic.ttf'),
    ...AntDesign.font,
    ...Ionicons.font,
    ...Entypo.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const { isFirstLaunch, isLoggedIn, isNewUser } = useAuthContext();
  console.log(
    `First launch: ${isFirstLaunch} | New User: ${isNewUser} | Logged In: ${isLoggedIn}`
  );
  // console.log('Google:', process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                {/* <AppNavigator /> */}
                <Slot />
              </NavThemeProvider>
            </ActionSheetProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </>
  );
}

export const fontStyles = StyleSheet.create({
  promptSemiBold: {
    fontFamily: 'Prompt-SemiBold',
  },
  promptMedium: {
    fontFamily: 'Prompt-Medium',
  },
  promptRegular: {
    fontFamily: 'Prompt-Regular',
  },
  promptLight: {
    fontFamily: 'Prompt-Light',
  },
  promptLightItalic: {
    fontFamily: 'Prompt-LightItalic'
  }
});

/**
 * Alternative layout structure.
 * The current is being used mostly for the sake of Authentication, based on Expo docs
 */
{/* <Stack screenOptions={SCREEN_OPTIONS}>
  <Stack.Screen name="(app)" />
  <Stack.Screen name="(auth)" />
  <Stack.Screen name="get-started" options={ONBOARDING_OPTIONS} />
</Stack>; */}
