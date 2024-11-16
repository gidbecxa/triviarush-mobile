import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '../_layout';
import { avatars as avatarsData } from '~/data/avatars';
import { TopicsApi, TopicsResponse, UserApi } from '~/api/api';
import { StyleSheet } from 'nativewind';
import { useAuthContext } from '~/store/ctx';

const fetchTopics = async ({ pageParam = 1 }) => {
  const response = await TopicsApi.getTopics(pageParam, 10);
  return response;
};

const fetchAvatars = async ({ pageParam = 1 }) => {
  const pageSize = 18;
  const startIndex = (pageParam - 1) * pageSize;
  return avatarsData.slice(startIndex, startIndex + pageSize);
};

export default function UserOnboarding() {
  const { colors, setColorScheme } = useColorScheme();
  const { width, height } = useWindowDimensions();

  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedTopics, setSelectedTopcs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { setIsNewUser } = useAuthContext();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  React.useEffect(() => {
    setColorScheme('dark');
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        const fullName = parsedUser.username || '';
        const firstName = fullName.split(' ')[0]; // We pick the first name
        setUsername(firstName || '');
      }
    };

    fetchUser();
  }, []);

  const storeUsername = async (newUsername: string) => {
    try {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.username = newUsername;
        await SecureStore.setItemAsync('profile', JSON.stringify(parsedUser));
        console.log('New username stored!');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const storeAvatar = async (avatarUrl: string) => {
    try {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.avatar = avatarUrl;
        await SecureStore.setItemAsync('profile', JSON.stringify(parsedUser));
        console.log('New avatar stored!');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const storeTopics = async (topics: any) => {
    try {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.topics = topics;
        await SecureStore.setItemAsync('profile', JSON.stringify(parsedUser));
        console.log('Topics stored!');
        return parsedUser;
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const animateToSlide = (slideIndex: any) => {
    Animated.timing(slideAnim, {
      toValue: slideIndex * -width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentSlide(slideIndex);
    });
  };

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
      return lastPage.length === 24 ? pages.length + 1 : undefined;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 10) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const handleTopicSelect = (topic: any) => {
    console.log('Selected!');
    setSelectedTopcs((prevSelectedTopics) => {
      if (prevSelectedTopics.includes(topic)) {
        return prevSelectedTopics.filter((t) => t !== topic);
      }
      if (prevSelectedTopics.length < 3) {
        return [...prevSelectedTopics, topic];
      }
      return prevSelectedTopics;
    });
  };

  const topicIsSelected = (topic: any) => selectedTopics.includes(topic);

  const renderItem = ({ item }: { item: TopicsResponse }) => (
    <Pressable className="flex-row" onPress={() => handleTopicSelect(item.slug)}>
      <View className="mr-3 border-0 border-white py-3">
        <View
          style={topicIsSelected(item.slug) ? styles.checkboxSelected : styles.checkboxUnselected}
        />
      </View>
      <View className="flex-1 p-2">
        <Text variant="callout" className="mb-1.5" style={fontStyles.promptMedium}>
          {item.title}
        </Text>
        <Text
          variant="subhead"
          style={[fontStyles.promptRegular, { color: colors.grey, fontSize: 14 }]}
          className="leading-tight">
          {item.description}
        </Text>
      </View>
    </Pressable>
  );

  const handleNext = () => {
    if (currentSlide === 0) {
      storeUsername(username);
    } else if (currentSlide === 1) {
      storeAvatar(selectedAvatar);
    }
    animateToSlide(currentSlide + 1);
  };

  const handleContinue = async () => {
    if (selectedTopics.length === 0) {
      console.log('No topics selected!');
      return;
    }
    const userData = await storeTopics(selectedTopics);
    try {
      // console.log('User data:', userData);
      await UserApi.updateUser(userData, userData.id).then((res) => {
        console.log('User update response:', res);
        setIsNewUser(false);
        router.replace('/');
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const renderAvatarItem = ({ item }) => (
    <Pressable
      onPress={() => handleAvatarPress(item.url)}
      style={{
        width: width / 3 - width * 0.05, // 3 items per row with padding
        height: 100,
        margin: 8,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: selectedAvatar === item.url ? colors.primary : colors.tertiary,
        borderWidth: 2,
      }}>
      <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} alt={`Avatar`} />
    </Pressable>
  );

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    console.log('Scrolling:', { isNearEnd, hasNextAvatarsPage, isFetchingNextAvatarsPage });

    if (isNearEnd && hasNextAvatarsPage && !isFetchingNextAvatarsPage) {
      console.log('Fetching next page...');
      fetchNextAvatarsPage();
    }
  };

  console.log('Current slide:', currentSlide);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <View
            className="flex-1 items-start justify-start border-0 border-white px-0 py-6"
            style={{ width }}>
            <View className="border-0 border-white" style={{ width, paddingVertical: 16 }}>
              <Text
                variant="title3"
                className="text-center"
                style={[fontStyles.promptMedium, { color: colors.foreground }]}>
                Choose your username
              </Text>
            </View>

            <View
              className="flex-1 justify-center border-0 border-white"
              style={{ width, padding: 12 }}>
              <View className="w-full" style={{ position: 'absolute', left: 12, top: '22.5%' }}>
                <Text variant="title2" className="mb-4 text-left" style={fontStyles.promptSemiBold}>
                  Hi, {username}!
                </Text>

                {/* Instructions */}
                <Text
                  variant="callout"
                  className="mb-4 text-left leading-normal"
                  style={fontStyles.promptRegular}>
                  Choose a username or keep the current. You can always change it later in your
                  profile settings
                </Text>
              </View>

              <TextInput
                className="mb-4 w-full px-2 py-3"
                placeholder="Enter your username"
                placeholderTextColor={colors.grey}
                value={username}
                onChangeText={setUsername}
                style={{
                  borderColor: colors.grey,
                  borderWidth: 2,
                  color: colors.foreground,
                  fontFamily: 'Prompt-Regular',
                  fontSize: 16,
                }}
              />

              <TouchableOpacity
                onPress={handleNext}
                className="w-full items-center py-4"
                style={{ borderRadius: 0, backgroundColor: colors.primary }}>
                <Text
                  variant="heading"
                  className="text-text uppercase"
                  style={fontStyles.promptSemiBold}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 1:
        return (
          <View
            className="flex-1 items-start justify-start border-0 border-white p-5"
            style={{ width }}>
            <View style={{ paddingHorizontal: '30%', alignItems: 'center' }}>
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
                ListHeaderComponent={
                  <View className="w-full border-0 border-white">
                    <Text
                      variant="title3"
                      className="py-4 text-center"
                      style={[fontStyles.promptMedium, { color: colors.foreground }]}>
                      Choose your avatar
                    </Text>
                  </View>
                }
                ListFooterComponent={
                  isFetchingNextAvatarsPage ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                  ) : null
                }
                contentContainerStyle={{ paddingHorizontal: width * 0.085, paddingBottom: 64 }}
              />
            </View>
            <View className="w-full" style={{ paddingHorizontal: width, position: 'relative', bottom: height * 0.075 }}>
              <TouchableOpacity
                onPress={handleNext}
                className="w-full items-center py-4"
                style={{ borderRadius: 0, backgroundColor: colors.primary }}>
                <Text
                  variant="heading"
                  className="text-text uppercase"
                  style={fontStyles.promptSemiBold}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View
            className="flex-1 items-end justify-start border-0 border-white px-0 py-5"
            style={{ width }}>
            <View
              className="border-0 border-white"
              style={{ borderColor: '#ccc', borderWidth: 0, width: width }}>
              <Text
                variant="title3"
                className="py-4 text-center"
                style={[fontStyles.promptMedium, { color: colors.foreground }]}>
                Choose your topics
              </Text>
            </View>

            <View className="flex-1 border-0 border-white  px-2" style={{ width }}>
              <FlashList
                data={data?.pages.flatMap((page) => page) || []}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
                onEndReachedThreshold={0.5}
                estimatedItemSize={160}
                ItemSeparatorComponent={() => renderItemSeparator(colors.grey2)}
              />
            </View>

            <View className="w-1/3 border-0 border-white" style={{ paddingHorizontal: '1%' }}>
              <TouchableOpacity
                onPress={handleContinue}
                className="w-full items-center py-4"
                style={{ borderRadius: 0, backgroundColor: colors.primary }}>
                <Text
                  variant="heading"
                  className="text-text uppercase"
                  style={fontStyles.promptSemiBold}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    // <View className="flex-1 ">
    <Animated.View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: width * 3,
        transform: [{ translateX: slideAnim }],
      }}>
      {renderSlide()}
    </Animated.View>
    // </View>
  );
}

function renderItemSeparator(color: string) {
  return <View style={{ height: 1, marginLeft: '10%', backgroundColor: color }} />;
}

const styles = StyleSheet.create({
  checkboxSelected: {
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: 'rgb(48, 209, 88)',
  },
  checkboxUnselected: {
    width: 18,
    height: 18,
    borderRadius: 50,
    borderWidth: 0,
    backgroundColor: 'rgb(72, 72, 74)',
  },
});
