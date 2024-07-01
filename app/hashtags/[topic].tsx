import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useSheetRef, Sheet } from '~/components/nativewindui/Sheet';
import * as Clipboard from 'expo-clipboard';
import { Snackbar } from 'react-native-paper';

import hashtags from "~/assets/content/hashtags.json"
import { Hashtag } from '~/data/types';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { StyleSheet } from 'nativewind';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

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
            style={{ backgroundColor: colors.card }}
            className='mr-1 px-2 py-1 rounded-xl border-0 border-border'
            onPress={() => handleTagSelect(item)}
        >
            <Text
                style={[
                    fontStyles.dmSansRegular,
                    selectedTag === item && [fontStyles.dmSansMedium, { fontSize: 15, }],
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
        <View className='flex-1'>
            <View className='flex-row justify-between items-center px-4 pt-3 pb-2 mt-6 border-0 border-border'>
                <Text variant="title3" style={fontStyles.dmSansSemiBold}>Hashtags</Text>
                <GHTouchableOpacity
                    containerStyle={{ backgroundColor: "rgba(58, 134, 255,0.45)", padding: 8, borderRadius: 12, }}
                    onPress={handleHeaderIconPress}
                >
                    <Ionicons name='copy-outline' size={20} color={colors.grey} />
                </GHTouchableOpacity>
            </View>

            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size='large' />
                </View>
            ) : (
                topic && hashtags.find((t) => t.id === Number(topic))?.label !== "Coming Soon" ? (
                    <>
                        <View className='py-2 h-12 border-0 border-border'>
                            <FlatList
                                data={tags}
                                keyExtractor={(item) => item}
                                renderItem={renderTag}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerClassName='pl-3'
                            />
                        </View>

                        <ScrollView className='p-2 border-0 border-border' contentContainerStyle={styles.hashtagsContainer}>
                            {filteredHashtags.map((hashtag) => (
                                <TouchableOpacity
                                    key={hashtag.id}
                                    style={[
                                        styles.hashtagButton,
                                        selectedHashtags.includes(hashtag.value) && { borderColor: colors.tertiary }
                                    ]}
                                    onPress={() => handleHashtagSelect(hashtag.value)}
                                    className='p-2 m-1 border border-border rounded-full'
                                >
                                    <Text
                                        variant='footnote'
                                        className='mr-1'
                                        style={[
                                            { color: colors.grey },
                                            fontStyles.dmSansRegular,
                                            selectedHashtags.includes(hashtag.value) && { color: colors.grey2 }]
                                        }
                                    >
                                        {hashtag.value}
                                    </Text>
                                    {selectedHashtags.includes(hashtag.value) && (
                                        <SimpleLineIcons name='check' size={18} color={colors.tertiary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                ) : (
                    <View className='flex-1 h-screen items-center justify-center'>
                        <Text variant="title3" className='text-center' style={fontStyles.dmSansMedium}>Hashtags not yet available for this topic.</Text>
                    </View>
                )
            )}

            <Sheet ref={bottomSheetModalRef} snapPoints={[200]}>
                <View className="flex-1 items-center justify-between pb-14 px-4">
                    <Text variant="heading" className='leading-loose' style={fontStyles.dmSansSemiBold}>Copy Hashtags</Text>
                    <TouchableOpacity
                        style={{ backgroundColor: colors.primary }}
                        className=' w-full py-3 items-center rounded-full'
                        onPress={handleCopy}
                    >
                        <Text variant='heading' className='text-card'>Copy</Text>
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
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    hashtagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow: 1
    },
    hashtagButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

/**
 * const renderHashtag = ({ item }: { item: Hashtag }) => (
        <TouchableOpacity
            style={styles.hashtagButton}
            onPress={() => handleHashtagSelect(item.value)}
            className='p-2 m-1 border border-border rounded-full'
        >
            <Text variant='footnote' className='mr-1' style={{ color: colors.grey }}>{item.value}</Text>
            {selectedHashtags.includes(item.value) && (
                <SimpleLineIcons name='check' size={18} color={colors.tertiary} />
            )}
        </TouchableOpacity>
    );
 */