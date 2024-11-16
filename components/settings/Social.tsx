import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useColorScheme } from '~/lib/useColorScheme';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { UserApi } from '~/api/api';
import { fontStyles } from '~/app/_layout';
import { ActivityIndicator } from '../nativewindui/ActivityIndicator';
import { cssInterop, StyleSheet } from 'nativewind';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { gamePalsPlaceholder } from '~/data/schema/placeholder';
import SpecialButton from '../interface/SpecialButton';
import { Radar, UsersRound } from 'lucide-react-native';

cssInterop(FlashList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

const fetchMatchingPlayers = async ({ pageParam = 1 }) => {
  const response = await UserApi.getGamePals(pageParam, 10);
  return response;
};

const SocialSettings = () => {
  const { colors } = useColorScheme();
  const { height } = useWindowDimensions();

  const sheetRef = useSheetRef();
  const [gamePals, setGamePals] = useState<string[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['matchingPlayers'],
    queryFn: fetchMatchingPlayers,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 10) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const handleAddGamePal = (playerId: string) => {
    setGamePals((prev) => [...prev, playerId]);
    console.log('Added Game Pal! Game pals', gamePals);
  };

  const openSocialSheet = () => {
    sheetRef.current?.present();
  };

  const renderPlayerItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
      <Image
        source={{ uri: item.avatar }}
        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 10 }}
      />
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text variant="body" style={[{ color: colors.foreground }, fontStyles.promptRegular]}>
          {item.username}
        </Text>
        <Text
          variant="footnote"
          numberOfLines={1}
          style={[{ color: colors.grey, letterSpacing: 0, lineHeight: 16, marginTop: 2, textTransform: 'capitalize' }, fontStyles.promptRegular]}>
          {/* {item.bio || 'No bio available'} */}
          {item.topics.join(', ')}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleAddGamePal(item.id)}
        style={{ backgroundColor: colors.primary, padding: 6 }}>
        <Text
          variant="footnote"
          style={[{ color: colors.card, textTransform: 'uppercase' }, fontStyles.promptMedium]}>
          Add Pal
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View className="h-full flex-1 items-center justify-center border-0 border-white p-16">
      <UsersRound color={colors.grey} size={40} />
      <Text
        variant="body"
        className="text-center"
        style={[{ color: colors.grey, marginTop: 10 }, fontStyles.promptRegular]}>
        No matching players found. Try again later!
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        variant="title3"
        style={[fontStyles.promptMedium, { color: colors.foreground, fontSize: 19 }]}>
        Find and Add Game Pals
      </Text>
      <Text
        variant="body"
        style={[fontStyles.promptRegular, { color: colors.grey, marginVertical: 10 }]}>
        Browse and add players who match your interests as game pals. Challenge them in duo-player
        mode.
      </Text>

      <InteractiveButton onPress={openSocialSheet} />

      <Sheet ref={sheetRef} snapPoints={[height * 0.8]} enableContentPanningGesture={false}>
        <FlashList
          data={data?.pages.flatMap((page) => page) || []}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          estimatedItemSize={50}
          ItemSeparatorComponent={() => renderItemSeparator('transparent')}
          contentContainerClassName="py-2 android:pb-12"
          ListEmptyComponent={renderEmptyList}
          ListHeaderComponent={
            <View className="w-full items-center justify-center">
              <Radar color={colors.primary} size={32} />
              <Text
                variant="title3"
                style={[
                  fontStyles.promptMedium,
                  { color: colors.foreground, fontSize: 18, marginTop: 8 },
                ]}>
                Find A Game Pal
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : null
          }
        />
      </Sheet>
    </View>
  );
};

export default SocialSettings;

function renderItemSeparator(color: string) {
  return <View style={{ height: 1, marginLeft: '10%', backgroundColor: color }} />;
}

function InteractiveButton({ onPress }) {
  const { colors } = useColorScheme();
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, { backgroundColor: colors.primary }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: colors.primary,
          },
        ]}>
        <Radar color={colors.root} size={48} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    alignSelf: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
  },
});
