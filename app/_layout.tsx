import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from "expo-font";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";

import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect } from 'react';
import { Text } from '~/components/nativewindui/Text';
import { StyleSheet } from 'nativewind';
import Hamburger from '~/components/illustrations/Hamburger';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  // NavigationBar.setVisibilityAsync('hidden');
  // NavigationBar.setPositionAsync('relative');
  // NavigationBar.setBehaviorAsync('overlay-swipe');

  const [loaded, error] = useFonts({
    Borel: require('~/assets/fonts/Borel/Borel-Regular.ttf'),
    "Alegreya-Bold": require('~/assets/fonts/AlegreyaSans/AlegreyaSans-Bold.ttf'),
    "Alegreya-Med": require('~/assets/fonts/AlegreyaSans/AlegreyaSans-Medium.ttf'),
    "DMSans-SemiBold": require('~/assets/fonts/DMSans/DMSans-SemiBold.ttf'),
    "DMSans-Regular": require('~/assets/fonts/DMSans/DMSans-Regular.ttf'),
    "DMSans-Medium": require('~/assets/fonts/DMSans/DMSans-Medium.ttf'),
    "DMSans-Light": require('~/assets/fonts/DMSans/DMSans-Light.ttf'),
    Imprima: require('~/assets/fonts/Imprima/Imprima-Regular.ttf'),
    ...AntDesign.font,
    ...Ionicons.font,
    ...Entypo.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayout />
}

function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <Stack screenOptions={SCREEN_OPTIONS}>
                <Stack.Screen name="index" options={HOME_OPTIONS} />
                <Stack.Screen name="onboarding-one" options={ONBOARDING_OPTIONS} />
                <Stack.Screen name="onboarding-two" options={ONBOARDING_OPTIONS} />
                <Stack.Screen name="onboarding-three" options={ONBOARDING_OPTIONS} />
                <Stack.Screen name="get-started" options={ONBOARDING_OPTIONS} />
                <Stack.Screen name="captions" options={HOME_OPTIONS} />
                <Stack.Screen name="hashtags" options={HOME_OPTIONS} />
                <Stack.Screen name="discovery" options={HOME_OPTIONS} />
                <Stack.Screen name="components-menu" options={INDEX_OPTIONS} />
                <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                <Stack.Screen name="playground" options={HOME_OPTIONS} />
              </Stack>
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'Sociagram',
  headerRight: () => <SettingsIcon />,
} as const;

const HOME_OPTIONS = {
  headerLargeTitle: true,
  title: '',
  // headerTitle: () => <HeaderTitle />,
  headerRight: () => <SettingsIcon />,
  headerLeft: () => <HamburgerMenuIcon />,
  headerShadowVisible: false,
  headerShown: false,
} as const;

const ONBOARDING_OPTIONS = {
  animation: 'slide_from_right',
  headerShown: false,
} as const;

function HeaderTitle() {
  return (
    <Text style={{ fontFamily: 'Borel' }}>Sociagram</Text>
  );
}

function HamburgerMenuIcon() {
  const { colors } = useColorScheme();

  return (
    <Pressable className="opacity-80">
      {({ pressed }) => (
        <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
          {/* <Ionicons name="menu" size={24} color={colors.foreground} /> */}
          <Hamburger width={24} height={24} />
        </View>
      )}
    </Pressable>
  );
}

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/onboarding-one" asChild>
      <Pressable className="opacity-80">
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
            <Icon name="cog-outline" color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;

export const fontStyles = StyleSheet.create({
  dmSansSemiBold: {
    fontFamily: "DMSans-SemiBold",
  },
  dmSansMedium: {
    fontFamily: "DMSans-Medium",
  },
  dmSansRegular: {
    fontFamily: "DMSans-Regular",
  },
  dmSansLight: {
    fontFamily: "DMSans-Light",
  }
})
