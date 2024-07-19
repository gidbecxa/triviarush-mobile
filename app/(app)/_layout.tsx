import { Icon } from '@roninoss/icons';
import { Link, Redirect, Stack } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { useAuthContext } from '~/store/ctx';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppLayout() {
  const { loading, isLoggedIn, isNewUser, isFirstLaunch } = useAuthContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant="body" style={fontStyles.promptMedium}>
          Loading...
        </Text>
      </View>
    );
  }

  if (isFirstLaunch && !isLoggedIn) {
    return <Redirect href="/get-started" />;
  } else if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  } else if (isNewUser) {
    return <Redirect href="/onboarding" />;
  }

  return <AppNavigator />;
}

function AppNavigator() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={HOME_OPTIONS} />
      <Stack.Screen name="modal" options={MODAL_OPTIONS} />
      <Stack.Screen name="playground" options={HOME_OPTIONS} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'TriviaRush',
  headerRight: () => <SettingsIcon />,
} as const;

const HOME_OPTIONS = {
  headerLargeTitle: true,
  title: '',
  headerRight: () => <SettingsIcon />,
  headerLeft: () => <HamburgerMenuIcon />,
  headerShadowVisible: false,
  headerShown: false,
} as const;

function HamburgerMenuIcon() {
  const { colors } = useColorScheme();

  return (
    <Pressable className="opacity-80">
      {({ pressed }) => (
        <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
          <Ionicons name="menu" size={24} color={colors.foreground} />
        </View>
      )}
    </Pressable>
  );
}

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
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
