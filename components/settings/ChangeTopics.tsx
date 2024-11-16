import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TopicsApi, TopicsResponse, UserApi } from '~/api/api';
import { useWindowDimensions, View, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { ActivityIndicator } from '../nativewindui/ActivityIndicator';
import { cssInterop, StyleSheet } from 'nativewind';
import { FlashList } from '@shopify/flash-list';

cssInterop(FlashList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

const fetchTopics = async ({ pageParam = 1 }) => {
  const response = await TopicsApi.getTopics(pageParam, 10);
  return response;
};

const ChangeTopics: React.FC = () => {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();

  const [selectedTopics, setSelectedTopcs] = useState([]);

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
        <Text variant="heading" className="mb-1.5" style={fontStyles.promptMedium}>
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

  const handleSave = async () => {
    if (selectedTopics.length === 0) {
      console.log('No topics selected!');
      return;
    }
    const userData = await storeTopics(selectedTopics);
    const data = { topics: userData?.topics };
    try {
      // console.log('User data:', userData);
      await UserApi.updateUser(data, userData.id).then((res) => {
        console.log('User update response:', res);
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <View className="flex-1 border-0 border-white px-2" style={{ width }}>
      <View className="flex-1 border-0 border-white px-2">
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
          contentContainerClassName="py-2 android:pb-12"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          }
          ListFooterComponent={
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
          }
        />
      </View>
    </View>
  );
};

export default ChangeTopics;

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
