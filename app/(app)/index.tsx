import * as React from 'react';
import { Pressable, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { Room, TriviaSpecial, UserProfile } from '~/data/types';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/nativewindui/Avatar';
import { topics } from '~/data/schema/topics';
import { PLACEHOLDER_ROOMS, SPECIAL_RUSH_PLACEHOLDER } from '~/data/schema/placeholder';
import { useHomeSocket } from '~/utils/socket/useHomeSocket';
import AppHeader from '~/components/interface/AppBar';
import { UserApi } from '~/api/api';

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const localProfile = await SecureStore.getItemAsync('profile');
    if (localProfile) {
      const profile = JSON.parse(localProfile);
      const user = await UserApi.getUser(profile.id);
      if (user) {
        // console.log('Home: User data fetched successfully via the server|');
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

export default function HomeScreen() {
  const { setColorScheme, colors } = useColorScheme();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [newRoom, setNewRoom] = React.useState<Room | null>(null);
  const [updatedRoom, setUpdatedRoom] = React.useState<Room | null>(null);
  const [specialTrivias, setSpecialTrivias] =
    React.useState<TriviaSpecial[]>(SPECIAL_RUSH_PLACEHOLDER);

  const { height, width } = useWindowDimensions();
  const lottieAnimation = React.useRef<LottieView>(null);

  React.useEffect(() => {
    setColorScheme('dark');

    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        // console.log('User\'s profile:', profile);
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    fetchProfile();
  }, []);

  useHomeSocket(setProfile, setRooms, setNewRoom, setUpdatedRoom, setSpecialTrivias);

  React.useEffect(() => {
    if (newRoom) {
      setRooms((prevRooms) => {
        const roomExists = prevRooms.some((room) => room.id === newRoom.id);
        if (!roomExists) {
          return [...prevRooms, newRoom];
        }
        return prevRooms;
      });
    }
  }, [newRoom]);

  React.useEffect(() => {
    if (updatedRoom) {
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
      );
    }
  }, [updatedRoom]);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant="body" style={fontStyles.promptMedium}>
          Loading...
        </Text>
      </View>
    );
  }

  const AVATAR_PLACEHOLDER_URI =
    'https://pbs.twimg.com/profile_images/1782428433898708992/1voyv4_A_400x400.jpg';

  const renderItem = ({ item }: { item: Room }) => (
    <TouchableOpacity
      className="items-center gap-1 border-0 border-white px-3 py-2"
      style={{
        flexDirection: 'row',
        borderRadius: 35,
        height: height * 0.15,
        position: 'relative',
        overflow: 'hidden',
        // Shadow styles for iOS
        shadowColor: '#000', // Black shadow color
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        // Shadow style for Android
        elevation: 10,
      }}
      onPress={() => {
        router.push({
          pathname: `/${item.category}`,
          params: {
            roomId: item.id,
            roomName: item.title,
          },
        });
      }}>
      <LinearGradient
        colors={['#1f2A38', '#2b3c50']} /**[ '#2B2E33', '#1B1D20']*/
        start={{ x: 1, y: 0 }}
        end={{ x: 0.1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 40,
        }}
      />
      <View className="items-center border-0 border-white">
        <Avatar className="h-16 w-16" alt="Room avatar">
          <AvatarImage source={getTopicAvatar(item.category)} />
          <AvatarFallback>
            <Text variant="title3" style={fontStyles.promptSemiBold}>
              TR
            </Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="flex-1 border-0 border-white p-2">
        <Text
          variant="subhead"
          className="mb-0.5 tracking-normal"
          style={[fontStyles.promptSemiBold, { fontSize: 14 }]}>
          {capitalizeFirstLetter(item.title)}
        </Text>
        <Text
          variant="caption1"
          style={[fontStyles.promptMedium, { color: colors.grey }]}
          className="leading-tight">
          {getTopicTitleBySlug(item.category)}
        </Text>
        <View className="mt-2 flex-row items-center">
          <AntDesign name="star" size={16} color={colors.tertiary} />
          {item.participants?.length > 0 && (
            <Text
              variant="caption1"
              style={[
                fontStyles.promptRegular,
                { color: colors.grey },
              ]}>{`   ${item.participants?.length} players joined`}</Text>
          )}
        </View>
      </View>
      {/* <View className='justify-center rounded-full px-2 border border-white'>
        <Text variant='callout'>{item.participants?.length > 0 ? item.participants?.length.toString() : '0'}</Text>
      </View> */}
    </TouchableOpacity>
  );

  const renderSpecialItem = ({ item }: { item: TriviaSpecial }) => (
    <Pressable
      className="items-center gap-1 border-0 border-white px-4 py-2"
      style={{
        flexDirection: 'row',
        borderRadius: 35,
        height: height * 0.175,
        width: width * 0.85,
        position: 'relative',
        overflow: 'hidden',
        // Shadow styles for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        // Shadow style for Android
        elevation: 10,
      }}
      onPress={() => {
        router.push({
          pathname: `/special`,
          params: {
            special: JSON.stringify(item),
          },
        });
      }}>
      <LinearGradient
        colors={['#1f2A38', '#2b3c50']} /**[ '#2B2E33', '#1B1D20']*/
        start={{ x: 1, y: 0 }}
        end={{ x: 0.1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 40,
        }}
      />
      <View className="items-center border-0 border-white">
        <Avatar
          style={{
            height: 84,
            width: 68,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          alt="Room avatar">
          <AvatarImage source={{ uri: item.avatar }} />
          <AvatarFallback>
            <Text variant="title3" style={fontStyles.promptSemiBold}>
              TR
            </Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="flex-1 items-start p-2">
        <Text
          variant="subhead"
          className="mb-1.5 leading-snug tracking-normal"
          style={[fontStyles.promptSemiBold, { fontSize: 14 }]}>
          {capitalizeFirstLetter(item.title)}
        </Text>
        <Text
          variant="caption1"
          style={[fontStyles.promptMedium, { color: colors.grey }]}
          numberOfLines={1}
          className="leading-tight">
          {item.caption}
        </Text>
        <View className="mt-1">
          <Text
            variant="caption1"
            className="rounded-full px-2 py-0.5 text-center"
            style={[{ backgroundColor: colors.accent }, fontStyles.promptMedium]}>
            {item.gameStatus}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 pt-6">
      {/* Header */}
      <AppHeader profile={profile} />

      {/* Special section */}
      <View style={{ height: height * 0.25 }} className="border-0 border-white">
        <View className="flex-row items-center justify-between border-0 border-white px-4 pb-1 pt-2">
          <Text variant="heading" style={[fontStyles.promptSemiBold, { fontSize: 18 }]}>
            Special Rush
          </Text>
          <TouchableOpacity>
            <Feather name="info" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <FlashList
          data={specialTrivias}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderSpecialItem}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          ListEmptyComponent={
            <Text variant="subhead" style={fontStyles.promptMedium}>
              Fetching Special trivia...
            </Text>
          }
          ItemSeparatorComponent={renderItemSeparator}
          horizontal
        />
      </View>

      {/* Open rooms */}
      <View style={{ flex: 1 }}>
        {renderOpenRoomsHeader()}
        <FlashList
          data={rooms}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          // ListHeaderComponent={renderOpenRoomsHeader}
          /* ListEmptyComponent={
            <View className="flex-1 items-start justify-center border-0 border-white">
              <Text variant="subhead" style={fontStyles.promptMedium}>
                Please wait while we find open rooms...
              </Text>
            </View>
          } */
          ItemSeparatorComponent={renderItemSeparator}
        />

        {/* List empty view */}
        {rooms.length === 0 && (
          <View
            style={{ height: '100%', position: 'absolute', width }}
            className="items-center gap-4 border-0 border-white">
            <LottieView
              autoPlay
              loop
              ref={lottieAnimation}
              style={{
                width: width - 32,
                height: width - 32,
              }}
              source={require('../../assets/lottie/Animation - 1724800293038.json')}
            />
            <Text variant="subhead" style={fontStyles.promptRegular}>
              Please wait while we find open rooms...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function renderItemSeparator() {
  return <View className="p-2" />;
}

function renderOpenRoomsHeader() {
  return (
    <View className="border-0 border-border px-4 pb-1">
      <Text variant="heading" style={[fontStyles.promptSemiBold, { fontSize: 18 }]}>
        Open Rooms
      </Text>
    </View>
  );
}

// Helper function to capitalize the first letter of titles
const capitalizeFirstLetter = (string: string) => {
  if (!string) return;

  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTopicTitleBySlug = (slug: string) => {
  const topic = topics.find((topic) => topic.slug === slug);
  return topic ? topic.title : '';
};

const getTopicAvatar = (category: string) => {
  const topic = topics.find((topic) => topic.slug === category);
  return topic ? topic.avatar : null;
};
