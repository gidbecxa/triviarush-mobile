// _layout.tsx for game room
import { Stack } from 'expo-router';

export default function RoomLayout() {
  return <RoomNavigator />;
}

function RoomNavigator() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={ROOM_OPTIONS} />
      <Stack.Screen name="multiplayer" options={ROOM_OPTIONS} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const ROOM_OPTIONS = {
  animation: 'slide_from_right',
  headerShown: false,
} as const;
