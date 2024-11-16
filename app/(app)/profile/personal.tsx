import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';

import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { UserProfile } from '~/data/types';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await SecureStore.getItemAsync('profile');
    if (profile) {
      console.log('Personal Info Screen: ', profile);
      return JSON.parse(profile);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

const LevelStars: React.FC<{ level: string }> = ({ level }) => {
  const levels = [
    'trivia_rookie',
    'trivia_ace',
    'trivia_expert',
    'mastermind',
    'grand_trivia_maestro',
  ];
  const currentLevelIndex = levels.indexOf(level);
  const { colors } = useColorScheme();

  return (
    <View className="flex-row items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <AntDesign
          key={index}
          name={index <= currentLevelIndex ? 'star' : 'staro'}
          size={18}
          color={colors.tertiary}
        />
      ))}
    </View>
  );
};

export default function PersonalInfoScreen() {
  const { colors } = useColorScheme();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            width,
            height: 96,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            gap: 8,
            paddingBottom: 16,
            elevation: 6,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="border-0 border-white p-2"
            style={{ position: 'relative', bottom: 0 }}>
            <AntDesign name="arrowleft" size={24} color={colors.foreground} />
            {/* <Ionicons name='arrow-back' size={24} color={colors.foreground} /> */}
          </TouchableOpacity>

          <Text
            variant="title3"
            className="p-2"
            style={[
              fontStyles.promptMedium,
              { color: colors.foreground, fontSize: 19, position: 'relative', top: 3 },
            ]}>
            {'Personal Information'}
          </Text>
        </View>
      ),
    });
  }, []);

  React.useEffect(() => {
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

  return (
    profile && (
      <View className="flex-1 p-4">
        {/* Username */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Username
          </Text>
          <Text variant="callout" style={fontStyles.promptRegular}>
            {profile.username || 'Username is not available'}
          </Text>
        </View>

        {/* Bio */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Bio
          </Text>
          <Text variant="callout" style={fontStyles.promptRegular}>
            {profile.bio || 'Bio is not available'}
          </Text>
        </View>

        {/* Earnings (Coins) */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Earnings
          </Text>
          <Text variant="callout" style={fontStyles.promptRegular}>
            {profile.coins}
            {'246'}
          </Text>
        </View>

        {/* Score (Points) */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Score
          </Text>
          <Text variant="callout" style={fontStyles.promptRegular}>
            {profile.points}
            {'2,345'}
          </Text>
        </View>

        {/* Skill Level */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Skill Level
          </Text>
          <LevelStars level={profile.skillLevel} />
        </View>

        {/* Topics */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Topics
          </Text>
          <Text variant="callout" className="capitalize" style={fontStyles.promptRegular}>
            {profile.topics?.join(', ') || 'Topics are not available'}
          </Text>
        </View>

        {/* Date Joined */}
        <View className="flex-row justify-between py-3">
          <Text variant="callout" style={fontStyles.promptRegular} className="capitalize">
            Date Joined
          </Text>
          <Text variant="callout" style={fontStyles.promptRegular}>
            {new Date(profile.createdAt).toLocaleDateString() || 'Date is not available'}
          </Text>
        </View>

        {/* Edit Button */}
        <View className="mt-6">
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 12,
              alignItems: 'center',
            }}>
            <Text
              variant="callout"
              style={fontStyles.promptSemiBold}
              className="text-text uppercase">
              Edit my information
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
}
