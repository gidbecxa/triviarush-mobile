import React from 'react';
import * as SecureStore from 'expo-secure-store';

import { UserApi } from '~/api/api';
import { UserProfile } from '~/data/types';
import { useColorScheme } from '~/lib/useColorScheme';
import { Pressable, useWindowDimensions, View, TouchableOpacity } from 'react-native';
import AppHeader from '~/components/interface/AppBar';
import { Image } from 'expo-image';
import {
  AntDesign,
  Entypo,
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { router } from 'expo-router';

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const localProfile = await SecureStore.getItemAsync('profile');
    if (localProfile) {
      const profile = JSON.parse(localProfile);
      const user = await UserApi.getUser(profile.id);
      if (user) {
        console.log('Profile: User data fetched successfully via the server!');
        await SecureStore.setItemAsync('profile', JSON.stringify(user));
        return user;
      } else {
        return profile;
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

const playerLevels = {
  trivia_rookie: 'Trivia Rookie',
  trivia_ace: 'Trivia Ace',
  trivia_expert: 'Trivia Expert',
  // trivia_guru: "Trivia Guru",
  mastermind: 'Mastermind',
  grand_trivia_maestro: 'Grand Trivia Maestro',
};

export default function ProfielPage() {
  const { colors } = useColorScheme();
  const { height: vh, width: vw } = useWindowDimensions();

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    const setProfileData = async () => {
      const profile = await fetchUserProfile();
      if (profile) {
        // console.log("Profile: User's data:", profile);
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    setProfileData();
  }, []);

  const handlePress = (item: string) => {
    setSelectedItem(item);
    console.log(`${item} selected!`);
    router.push({ pathname: `/profile/${item}`, params: { profile: JSON.stringify(profile) } });
  };

  const menuItems = [
    { icon: <AntDesign name="user" size={24} />, label: 'Personal Information', key: 'personal' },
    {
      icon: <MaterialCommunityIcons name="trophy-award" size={24} />,
      label: 'Achievements',
      key: 'achievements',
    },
    { icon: <AntDesign name="setting" size={24} />, label: 'Settings', key: 'settings' },
    { icon: <Ionicons name="share" size={24} />, label: 'Invite a friend', key: 'invite' },
    {
      icon: <MaterialIcons name="card-giftcard" size={24} />,
      label: 'Claim a reward',
      key: 'reward',
    },
    { icon: <Feather name="log-out" size={24} />, label: 'Logout', key: 'logout' },
  ];

  return (
    <View className="flex-1 pt-6">
      {/* Header */}
      <AppHeader profile={profile} />

      {/* User's Basic Info */}
      {profile && (
        <View className="w-full items-center border-0 border-white p-2">
          {/* User's Avatar */}
          <View
            style={{
              height: vw / 3,
              width: vw / 3,
              borderColor: colors.primary,
              borderRadius: vw / 6,
              borderWidth: 5,
            }}
            className="items-center justify-center p-2">
            <Image
              source={{ uri: profile.avatar }}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              contentFit="cover"
              alt="Profile avatar"
              cachePolicy="memory-disk"
            />
          </View>

          {/* Player's level */}
          <View className="my-3 w-full items-center border-0 border-white">
            <Text variant="body" style={fontStyles.promptRegular} className="capitalize">
              {playerLevels[profile.skillLevel]?.replace(/_/g, ' ')}
            </Text>
            {/* <LevelStars level={profile.skillLevel} /> */}
            <Pressable className="flex-row items-center">
              <Image
                source={require('~/assets/graphics/coins-32.png')}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
                alt="Profile avatar"
                cachePolicy="memory-disk"
              />
              <Text
                variant="subhead"
                style={[fontStyles.promptMedium, { color: colors.grey }]}
                className="capitalize">
                {' '}
                {profile.coins}
                {',246'}
              </Text>
            </Pressable>
            <Text
              variant="footnote"
              style={[
                fontStyles.promptLight,
                { color: colors.grey, letterSpacing: -0.5, marginTop: 6 },
              ]}>
              A student by day, a hacker by night
            </Text>
          </View>

          {/* Stats */}
          <View className="mt-1 w-full flex-row items-center justify-between border-0 border-white px-4 py-0">
            <View className="items-start p-1">
              <Text variant="title3" style={fontStyles.promptMedium} className="capitalize">
                {'99'}
              </Text>
              <Text
                variant="subhead"
                style={[fontStyles.promptRegular, { color: colors.grey }]}
                className="capitalize">
                Rank
              </Text>
            </View>
            <View className="items-start p-1">
              <Text variant="title3" style={fontStyles.promptMedium} className="capitalize">
                {'6/10'}
              </Text>
              <Text
                variant="subhead"
                style={[fontStyles.promptRegular, { color: colors.grey }]}
                className="capitalize">
                Rating
              </Text>
            </View>
            <View className="items-start p-1">
              <Text variant="title3" style={fontStyles.promptMedium} className="capitalize">
                {'24'}
              </Text>
              <Text
                variant="subhead"
                style={[fontStyles.promptRegular, { color: colors.grey }]}
                className="capitalize">
                Wins
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* The Menu */}
      {profile && (
        <View className="flex-1 items-center border-0 border-white p-2">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              className="my-1 w-full flex-row items-center justify-between border-0 border-white p-3"
              onPress={() => handlePress(item.key)}>
              {React.cloneElement(item.icon, {
                color: selectedItem === item.key ? colors.primary : colors.grey,
              })}
              <Text
                variant="callout"
                style={[
                  fontStyles.promptRegular,
                  { color: selectedItem === item.key ? colors.foreground : colors.grey },
                ]}
                className="flex-1 px-5 capitalize">
                {item.label}
              </Text>
              <Entypo
                name="chevron-small-right"
                size={24}
                color={selectedItem === item.key ? colors.foreground : colors.grey}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
