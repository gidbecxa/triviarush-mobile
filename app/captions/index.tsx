import React from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import ImageIllustration from '~/components/interface/ImageIllustration';
import TopAppBar from '~/components/interface/AppBar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { Icon } from '@roninoss/icons';
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import categories from "~/assets/content/categories-all.json"
import { Category } from '~/data/types';
import { router } from 'expo-router';

function keyExtractor(item: Category) {
    return String(item.id);
}

const CaptionsFrontPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { width, height } = useWindowDimensions();
    const { colors, } = useColorScheme();

    const capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    function extractTags(item: Category): string[] {
        const allTags: string[] = [];

        if (item.subCategories) { // Check if subCategories exist
            item.subCategories.forEach(
                (subcategory) => {
                    if (
                        subcategory.label && subcategory.label.toLowerCase() === "top choice"
                        || subcategory.label.toLowerCase() === "coming soon"
                    ) {
                        if (subcategory.tags) { // Check if tags exist
                            subcategory.tags.forEach((tag) => {
                                if (!allTags.includes(tag)) {
                                    allTags.push(tag);
                                }
                            });
                        }
                    }
                });
        }

        return allTags;
    }

    const renderCard = ({ item }: { item: Category }) => (
        <Card
            elevation={0}
            style={[styles.card, { height: height / 9, backgroundColor: colors.background }]}
            className='border-border'
            onPress={() => {
                router.navigate({ pathname: item.href, params: { category: item.id } })
            }}
        >
            <View style={styles.cardContent} className='px-2 border-0 border-border'>
                <ImageIllustration source={{ uri: item.illustration }} width={36} height={36} backgroundColor={"transparent"} />
                <View style={styles.textContainer} className='border-0 border-border'>
                    <Text variant="callout" style={fontStyles.dmSansMedium} className='text-text'>{item.title}</Text>
                    <Text variant="caption1" style={fontStyles.dmSansRegular} className='text-text' numberOfLines={1}>
                        {extractTags(item).map((desc) => capitalizeWords(desc)).join(', ')}
                    </Text>
                </View>
                <Pressable
                    /* style={{
                        backgroundColor: isDarkColorScheme ? "white" : colors.grey6,
                        width: 32,
                        height: 32,
                    }} */
                    className='overflow-hidden rounded-lg p-1 flex-row items-center justify-center border-0 border-border'>
                    <Entypo name="chevron-small-right" size={24} color={colors.grey2} />
                </Pressable>
            </View>
        </Card>
    );

    return (
        <View className='flex-1'>
            <TopAppBar />
            <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-text my-2 mx-4'>Captions Categories</Text>
            <FlashList
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                data={categories}
                estimatedItemSize={200}
                contentContainerClassName='py-0 android:pb-12 px-3'
                keyExtractor={keyExtractor}
                renderItem={renderCard}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    card: {
        borderRadius: 15,
        marginVertical: 6,
        justifyContent: "center",
        // borderWidth: 1.5
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    illustration: {
        width: 64,
        height: 64,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
});

export default CaptionsFrontPage;
