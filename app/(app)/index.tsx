import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import useSocket from '~/utils/useSocket';
import { UserProfile } from '~/data/types';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await SecureStore.getItemAsync('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

export default function Screen() {
  const { setColorScheme, colors } = useColorScheme();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    setColorScheme('dark');

    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    fetchProfile();
  }, []);

  const socket = useSocket(setProfile);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant="body" style={fontStyles.promptMedium}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-6">
      <View className="w-full flex-row items-center justify-between border-0 border-white p-2">
        <TouchableOpacity
          className="border-0 border-white p-3 rounded-full bg-white/15"
          onPress={() => console.log('Game mode')}>
          <AntDesign name="appstore1" size={24} color={colors.secondary} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center justify-center">
          <Text variant="heading" style={[fontStyles.promptMedium, {position: "relative", top: 1}]}>
            {profile.points}
            {'23,456'}{' '}
          </Text>
          <AntDesign name="star" size={20} color={colors.tertiary} />
        </View>

        <TouchableOpacity
          className="z-10 h-12 w-12 rounded-full"
          onPress={() => console.log('View Profile and settings...')}>
          <Image
            source={{ uri: profile.avatar }}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            contentFit="cover"
            alt="Profile avatar"
          />
          <View
            className="absolute bottom-0 right-0 z-20 h-3 w-3 rounded-full"
            style={{ backgroundColor: profile.isOnline ? colors.primary : colors.destructive }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
