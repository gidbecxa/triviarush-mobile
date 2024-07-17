import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'signin',
};

export default function AuthLayout() {
  return <AuthNavigator />;
}

function AuthNavigator() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="signin" options={ONBOARDING_OPTIONS} />
      <Stack.Screen name="onboarding" options={ONBOARDING_OPTIONS} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const ONBOARDING_OPTIONS = {
  animation: 'slide_from_right',
  headerShown: false,
} as const;
