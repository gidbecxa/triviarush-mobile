import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchCaptions } from '~/data/utils/fetchCaptions';
import { Category, Caption, SubCategory } from '~/data/types';
import CaptionCard from '~/components/interface/cards/CaptionCard';
import { FlashList } from '@shopify/flash-list';
import { View, useWindowDimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from '~/lib/useColorScheme';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';

import categories from "~/assets/content/categories-all.json"
import { StyleSheet } from 'nativewind';
import { Snackbar } from 'react-native-paper';
import { Icon } from '@roninoss/icons';

const CaptionsScreen = () => {
  const { category } = useLocalSearchParams();
  // console.log('category', category);

  const { colors } = useColorScheme();
  const { height } = useWindowDimensions();
  const bottomSheetModalRef = useSheetRef();
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['captions', category, subCategory?.id],
    /* queryFn: fetchCaptions, */
    queryFn: ({ pageParam }) => fetchCaptions({ category, pageParam, subCategoryId: subCategory?.id }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const keyExtractor = (item: Caption) => String(item.id);

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSubCategory(subCategory);
    bottomSheetModalRef.current?.close();
  };

  const selectedCategory = categories.find((cat: Category) => cat.id === Number(category));
  const subCategories = selectedCategory?.subCategories || [];
  /* console.log('Sub-Categories', subCategories.map((sub: SubCategory) => sub.title)); */

  /* console.log('Data fetched: ', data?.pages.flatMap((page) => page.captions)); */

  return (
    <View className='flex-1'>
      <View className='flex flex-row justify-between items-center px-4 pt-3 pb-2 mt-6 border-0 border-border'>
        <TouchableOpacity onPress={() => {router.back()}}>
          <Icon name="chevron-left" size={28} color={colors.grey} />
        </TouchableOpacity>

        <Text variant="title3" className='flex-1 pl-1' style={fontStyles.dmSansSemiBold}>Captions</Text>
        <TouchableOpacity
          containerStyle={{ backgroundColor: "rgba(58, 134, 255,0.35)", padding: 4, borderRadius: 12, }}
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <Ionicons name='reorder-two' size={28} color={colors.grey} />
        </TouchableOpacity>
      </View>

      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        data={data?.pages.flatMap((page) => page.captions)}
        renderItem={({ item }) => <CaptionCard caption={item} showSnackbar={showSnackbar} />}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size={48} /> : null
        }
        ListEmptyComponent={
          isLoading ? (
            <View className='flex-1 h-screen items-center justify-center'>
              <ActivityIndicator size={48} />
            </View>
          ) : (
            <View className='flex-1 h-screen items-center justify-center'>
              <Text variant="title3" style={fontStyles.dmSansSemiBold}>Captions not yet available.</Text>
            </View>
          )
        }
        estimatedItemSize={100}
        numColumns={1}
        contentContainerClassName="py-4 android:pb-12"
      />

      <Sheet ref={bottomSheetModalRef} snapPoints={[400, height * 0.6]}>
        <View className="flex-1 items-center pb-8">
          <Text variant="heading" className='leading-loose' style={fontStyles.dmSansSemiBold}>Filter by Sub-Category</Text>
          {subCategories.map((subCat: SubCategory) => (
            <TouchableOpacity
              key={subCat.id}
              containerStyle={styles.filterOptionContainer}
              onPress={() => handleSubCategorySelect(subCat)}
            >
              <Text variant='callout' style={fontStyles.dmSansRegular}>{subCat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Sheet>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: 'OK',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

function renderItemSeparator() {
  return <View className="p-1.5 border-0 border-border" />;
}

export default CaptionsScreen;

const styles = StyleSheet.create({
  filterOptionContainer: {
    width: "95%",
    padding: 8,
    marginVertical: 2,
    borderWidth: 0,
    borderColor: "#CCC",
    borderRadius: 12
  }
})
