import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { avatars as avatarsList } from '~/data/avatars';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UserApi } from '~/api/api';
import { FlatList, useWindowDimensions, View, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { Image } from 'expo-image';
import { ActivityIndicator } from '../nativewindui/ActivityIndicator';

interface Avatar {
  url: string;
}

const fetchAvatars = async ({ pageParam = 1 }): Promise<Avatar[]> => {
  const pageSize = 18;
  const startIndex = (pageParam - 1) * pageSize;
  return avatarsList.slice(startIndex, startIndex + pageSize);
};

const ChangeAvatar: React.FC = () => {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleAvatarPress = (avatar: string) => {
    console.log('Avatar selected', avatar);
    setSelectedAvatar(avatar);
  };

  const {
    data: avatars,
    fetchNextPage: fetchNextAvatarsPage,
    hasNextPage: hasNextAvatarsPage,
    isFetchingNextPage: isFetchingNextAvatarsPage,
  } = useInfiniteQuery({
    queryKey: ['avatars'],
    queryFn: fetchAvatars,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 18 ? pages.length + 1 : undefined;
    },
  });

  const storeAvatar = async (avatarUrl: string) => {
    try {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.avatar = avatarUrl;
        await SecureStore.setItemAsync('profile', JSON.stringify(parsedUser));
        console.log('New avatar stored!');
        return parsedUser;
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedAvatar) {
      console.log('No avatar selected!');
      return;
    }
    const userData = await storeAvatar(selectedAvatar);
    const data = { avatar: userData?.avatar };
    try {
      await UserApi.updateUser(data, userData.id).then((res) => {
        console.log('User update response:', res);
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const renderAvatarItem = ({ item }: { item: Avatar }) => (
    <Pressable
      onPress={() => handleAvatarPress(item.url)}
      style={{
        width: width / 3 - width * 0.05,
        height: width / 3 - width * 0.05,
        margin: 8,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: selectedAvatar === item.url ? colors.primary : colors.tertiary,
        borderWidth: 2,
      }}>
      <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} alt="Avatar" />
    </Pressable>
  );

  return (
    <View className="flex-1 border-0 border-white px-0" style={{ width }}>
      <View className="flex-1 border-0 border-white">
        <FlatList
          data={avatars?.pages.flatMap((page) => page) || []}
          renderItem={renderAvatarItem}
          keyExtractor={(item) => item.url}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          onEndReached={() => {
            if (hasNextAvatarsPage && !isFetchingNextAvatarsPage) {
              fetchNextAvatarsPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <>
              {isFetchingNextAvatarsPage && (
                <ActivityIndicator size="large" color={colors.primary} />
              )}

              <View
                className="w-full border-0 border-white"
                style={{ paddingHorizontal: '1%', marginTop: 8 }}>
                <TouchableOpacity
                  onPress={handleSave}
                  className="w-full items-center py-4"
                  style={{ borderRadius: 0, backgroundColor: colors.primary }}>
                  <Text
                    variant="heading"
                    className="text-text uppercase"
                    style={fontStyles.promptSemiBold}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          }
          contentContainerClassName="py-2 android:pb-12"
        />
      </View>
      {/*  */}
    </View>
  );
};

export default ChangeAvatar;
