// a screen just for experimenting
import React from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions, TextInput, TouchableOpacity, } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { Feather } from '@expo/vector-icons';

import TopAppBar from '~/components/interface/AppBar';
import { fontStyles } from './_layout';
import { TrendingArticle } from '~/data/types';
import TRENDING_ARTICLES from '~/data/trending';
import Thumbnail from '~/components/interface/Thumbnail';

function keyExtractor(item: TrendingArticle) {
    return item.id;
}

const TrendingFrontPage = () => {
    const route = useRouter();
    const { width, height } = useWindowDimensions();
    const { colors } = useColorScheme();

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedTag, setSelectedTag] = React.useState('All');

    const handleSearch = (text: string) => {
        setSearchTerm(text);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const searchField = () => {
        return (
            <View style={[styles.searchContainer, { backgroundColor: colors.card }]} className='mx-4 my-2 px-2 py-2.5 rounded-xl'>
                <Feather name="search" size={20} color={colors.grey2} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search content..."
                    value={searchTerm}
                    onChangeText={handleSearch}
                />
                {searchTerm.length > 0 && (
                    <Feather name="x" size={20} color="gray" style={styles.cancelIcon} onPress={clearSearch} />
                )}
            </View>
        )
    };

    const data = selectedTag === 'All'
        ? TRENDING_ARTICLES.filter((article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : TRENDING_ARTICLES.filter(
            (article) =>
                article.tags.includes(selectedTag) &&
                article.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

    /* const data = searchTerm.length > 0
        ? TRENDING_ARTICLES.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : TRENDING_ARTICLES; */

    const tags = ['All', ...new Set(TRENDING_ARTICLES.flatMap((article) => article.tags))];

    const handleTagSelect = (tag: string) => {
        setSelectedTag(tag);
    };

    const renderTag = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                // styles.tagContainer,
                { backgroundColor: colors.card }
            ]}
            className='mr-1 px-3 py-1 rounded-xl border-0 border-border'
            onPress={() => handleTagSelect(item)}
        >
            <Text style={[fontStyles.dmSansRegular, selectedTag === item && [fontStyles.dmSansMedium, {fontSize: 15}],]} variant="footnote">{item}</Text>
        </TouchableOpacity>
    );

    const capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    const renderCard = ({ item }: { item: TrendingArticle }) => (
        <Card elevation={0} style={[styles.card, { height: height / 8, backgroundColor: colors.card }]} className='border-border'>
            <View style={styles.cardContent} className='p-1 border-0 border-border'>
                <Thumbnail source={item.image} width={height / 9} height={height / 9} backgroundColor={colors.grey6} />

                <View style={[styles.textContainer, { height: height / 9 }]} className='border-0 border-border'>
                    <Text variant="caption2" style={fontStyles.dmSansMedium}>
                        {item.tags.map((desc) => capitalizeWords(desc)).join(', ')}
                    </Text>
                    <Text variant="subhead" style={fontStyles.dmSansSemiBold} className='text-text leading-tight capitalize'>{item.title}</Text>
                    <Text variant="caption1" style={fontStyles.dmSansRegular} numberOfLines={1} className='text-text'>
                        {item.description}
                    </Text>
                </View>
            </View>
        </Card>
    );

    return (
        <View className='flex-1'>
            <TopAppBar />

            <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-text my-2 mx-4'>Discovery</Text>

            {searchField()}

            <FlashList
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                data={data}
                extraData={searchTerm}
                estimatedItemSize={200}
                contentContainerClassName='py-0 android:pb-12 px-3'
                keyExtractor={keyExtractor}
                renderItem={renderCard}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <FlatList
                        data={tags}
                        keyExtractor={(item) => item}
                        renderItem={renderTag}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName='my-2'
                    />
                }
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
        borderRadius: 0,
        marginVertical: 4,
        justifyContent: "center",
        // borderWidth: 1.5
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    illustration: {
        width: 64,
        height: 64,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    cancelIcon: {
        marginLeft: 8,
    },
    tagContainer: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    selectedTag: {
        backgroundColor: '#e0e0e0',
    },
    tagText: {
        fontSize: 14,
    },
});

export default TrendingFrontPage;