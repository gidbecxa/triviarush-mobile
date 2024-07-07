import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useSheetRef, Sheet } from '~/components/nativewindui/Sheet';
import * as Clipboard from 'expo-clipboard';
import { Snackbar } from 'react-native-paper';

import hashtags from '~/assets/content/hashtags.json';
import { Hashtag } from '~/data/types';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { StyleSheet } from 'nativewind';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Icon } from '@roninoss/icons';

export default function HashtagsScreen() {
  const { topic } = useLocalSearchParams();

  const { colors } = useColorScheme();
  const bottomSheetModalRef = useSheetRef();

  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [filteredHashtags, setFilteredHashtags] = useState<Hashtag[]>([]); // hashtags.find((t) => t.id === Number(topic))?.hashtags || []
  const [tags, setTags] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // collect all tags from the hashtags array for topic
    if (topic) {
      const topicObject = hashtags.find((t) => t.id === Number(topic));
      if (topicObject) {
        const hashtagsArray = topicObject.hashtags;
        if (hashtagsArray) {
          const allTagsSet = new Set<string>();
          hashtagsArray.forEach((hashtag) => {
            if (typeof hashtag.tag === 'string') {
              allTagsSet.add(hashtag.tag);
            } else if (Array.isArray(hashtag.tag)) {
              hashtag.tag.forEach((tag) => allTagsSet.add(tag));
            }
          });
          const allTags = ['All', ...Array.from(allTagsSet)];
          setTags(allTags);
          setFilteredHashtags(hashtagsArray);
          setIsLoading(false);
        }
      }
    }
  }, [topic, hashtags]);

  const topicObject = hashtags.find((t) => t.id === Number(topic));

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    if (topicObject) {
      const hashtagsArray = topicObject.hashtags;
      if (tag === 'All') {
        setFilteredHashtags(hashtagsArray);
      } else {
        const filtered = hashtagsArray.filter((item) => {
          if (typeof item.tag === 'string') {
            return item.tag === tag;
          } else if (Array.isArray(item.tag)) {
            return item.tag.includes(tag);
          }
          return false;
        });
        setFilteredHashtags(filtered);
      }
    }
  };

  const handleHashtagSelect = (hashtag: string) => {
    setSelectedHashtags((prevSelected) =>
      prevSelected.includes(hashtag)
        ? prevSelected.filter((item) => item !== hashtag)
        : [...prevSelected, hashtag]
    );
    /* console.log('Selected: ', selectedHashtags); */
  };

  const handleSelectAll = () => {
    if (selectedHashtags.length === filteredHashtags.length) {
      setSelectedHashtags([]);
    } else {
      setSelectedHashtags(filteredHashtags.map((item) => item.value));
    }
  };

  const renderTag = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={{ backgroundColor: "transparent", minHeight: 48, minWidth: 48 }}
      className="mr-1 items-center justify-center rounded-full border-0 border-border px-2"
      onPress={() => handleTagSelect(item)}
      accessibilityRole="button"
      accessibilityHint="Find hashtags for a specific social media app">
      <Text
        style={[
          fontStyles.dmSansRegular,
          {color: colors.foreground},
          selectedTag === item && [fontStyles.dmSansMedium, { fontSize: 15 }],
        ]}
        variant="footnote">
        {item}
      </Text>
    </TouchableOpacity>
  );

  const handleHeaderIconPress = () => {
    if (selectedHashtags.length === 0) {
      setSnackbarMessage('Please select at least one hashtag.');
      setSnackBarVisible(true);
    } else {
      bottomSheetModalRef.current?.present();
    }
  };

  const handleCopy = async () => {
    if (selectedHashtags.length === 0) {
      setSnackbarMessage('No hashtags to copy.');
      setSnackBarVisible(true);
    } else {
      await Clipboard.setStringAsync(selectedHashtags.join(' '));
      setSnackbarMessage('Hashtags copied to clipboard!');
      bottomSheetModalRef.current?.dismiss();
      setSnackBarVisible(true);
    }
  };

  /* const keyExtractor = (item: Hashtag) => String(item.id); */

  return (
    <View className="flex-1">
      <View className="mt-6 h-20 flex-row items-center justify-between border-0 border-border py-1 pr-4">
        <TouchableOpacity
          style={styles.headerButtonStyle}
          onPress={() => {
            router.back();
          }}>
          <Icon name="chevron-left" size={28} color={colors.grey} />
        </TouchableOpacity>

        <Text variant="title3" className="flex-1 pl-1" style={fontStyles.dmSansSemiBold}>
          Hashtags
        </Text>

        <GHTouchableOpacity
          containerStyle={[
            styles.headerButtonStyle,
            // { backgroundColor: 'rgba(58, 134, 255,0.5)' },
          ]}
          onPress={handleHeaderIconPress}>
          <Ionicons name="copy-outline" size={24} color={colors.grey} />
        </GHTouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : topic && hashtags.find((t) => t.id === Number(topic))?.label !== 'Coming Soon' ? (
        <>
          <View className="min-h-16 border-b border-border py-1">
            <FlatList
              data={tags}
              keyExtractor={(item) => item}
              renderItem={renderTag}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pl-2"
            />
          </View>

          <ScrollView
            className="border-0 border-border px-2 py-3"
            contentContainerStyle={styles.hashtagsContainer}>
            {filteredHashtags.map((hashtag) => (
              <TouchableOpacity
                key={hashtag.id}
                style={[
                  styles.hashtagButton,
                  //   {borderColor: "rgba(58, 134, 255, 0.3)"},
                  selectedHashtags.includes(hashtag.value) && { borderColor: colors.primary },
                ]}
                onPress={() => handleHashtagSelect(hashtag.value)}
                className="m-1 rounded-full border border-border p-3">
                <Text
                  variant="footnote"
                  className="mr-1"
                  style={[
                    { color: colors.foreground },
                    fontStyles.dmSansRegular,
                    selectedHashtags.includes(hashtag.value) && { color: colors.grey2 },
                  ]}>
                  {hashtag.value}
                </Text>
                {selectedHashtags.includes(hashtag.value) && (
                  <SimpleLineIcons name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <View className="h-screen flex-1 items-center justify-center">
          <Text variant="title3" className="text-center" style={fontStyles.dmSansMedium}>
            Hashtags not yet available for this topic.
          </Text>
        </View>
      )}

      <Sheet ref={bottomSheetModalRef} snapPoints={[200]}>
        <View className="flex-1 items-center justify-between px-4 pb-14">
          <Text variant="heading" className="leading-loose" style={fontStyles.dmSansSemiBold}>
            Copy Hashtags
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: colors.primary }}
            className=" w-full items-center rounded-full py-3"
            onPress={handleCopy}>
            <Text variant="heading" className="text-card">
              Copy
            </Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: 'OK',
          onPress: () => {
            setSnackBarVisible(false);
          },
        }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButtonStyle: {
    padding: 4,
    borderRadius: 12,
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  hashtagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    minWidth: 48,
  },
});
