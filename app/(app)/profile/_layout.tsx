// _layout.tsx for user's profile
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export default function RoomLayout() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ProfileNavigator />
    </QueryClientProvider>
  );
}

function ProfileNavigator() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={INDEX_OPTIONS} />
      <Stack.Screen name="personal" options={PERSONAL_OPTIONS} />
      <Stack.Screen name="invite" options={INVITE_OPTIONS} />
      <Stack.Screen name="achievements" options={ACHIEVEMENTS_OPTIONS} />
      <Stack.Screen name="settings" options={SETTINGS_OPTIONS} />
      <Stack.Screen name="topup" options={{ headerShown: false, animation: 'simple_push' }} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const INDEX_OPTIONS = {
  animation: 'slide_from_right',
  headerShown: false,
} as const;

const PERSONAL_OPTIONS = {
  animation: 'flip',
  headerShown: true,
  title: 'Personal Information',
} as const;

const INVITE_OPTIONS = {
  animation: 'flip',
  headerShown: true,
  title: 'Invite A Friend',
} as const;

const ACHIEVEMENTS_OPTIONS = {
  animation: 'flip',
  headerShown: true,
  title: 'Achievements',
} as const;

const SETTINGS_OPTIONS = {
  animation: 'flip',
  headerShown: true,
  title: 'Settings',
} as const;
