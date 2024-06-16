import React from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { hashtagsData, HashtagCategory } from '~/data/hashtags';
import { FlashList } from '@shopify/flash-list';
import ImageIllustration from '~/components/interface/ImageIllustration';
import TopAppBar from '~/components/interface/AppBar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { FontAwesome5 } from '@expo/vector-icons';

function keyExtractor(item: HashtagCategory) {
    return item.id;
}

const HashtagsFrontPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { width, height } = useWindowDimensions();
    const { colors, isDarkColorScheme } = useColorScheme();

    const capitalizeWords = (str: string) => {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    const truncatedDescription = (item: HashtagCategory) => {
        const joinedDescription = item.description.map((desc) => capitalizeWords(desc)).join(', ');
        return joinedDescription.length > 35 ? `${joinedDescription.slice(0, 35)}...` : joinedDescription;
    };

    const renderColoredCard = ({ item }: { item: HashtagCategory }) => (
        <Pressable style={[styles.card, { height: height / 9, backgroundColor: colors.secondary }]} className='border-0 border-border'>
            <View style={styles.cardContent} className='px-2.5 border-0 border-border'>
                <ImageIllustration source={item.illustration} width={40} height={40} />
                <View style={styles.textContainer} className='border-0 border-border'>
                    <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-white'>{item.title}</Text>
                    <Text variant="caption1" style={fontStyles.dmSansRegular} className='text-white'>
                        {item.description.map((desc) => capitalizeWords(desc)).join(', ')}
                    </Text>
                </View>
            </View>
        </Pressable>
    );

    const renderCard = ({ item }: { item: HashtagCategory }) => (
        <Card elevation={1} style={[styles.card, { height: height / 9, backgroundColor: colors.card }]} className='border-border'>
            <View style={styles.cardContent} className='px-2 border-0 border-border'>
                <ImageIllustration source={item.illustration} width={40} height={40} backgroundColor={colors.grey6} />
                <View style={styles.textContainer} className='border-0 border-border'>
                    <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-text'>{item.title}</Text>
                    <Text variant="caption1" style={fontStyles.dmSansRegular} className='text-text'>
                        {truncatedDescription(item)}
                    </Text>
                </View>
                <Pressable
                    style={{
                        backgroundColor: isDarkColorScheme ? "white" : colors.grey6,
                        width: 40,
                        height: 40,
                    }}
                    className='overflow-hidden rounded-lg p-2 flex-row items-center justify-center border-0 border-border'>
                    <FontAwesome5 name="long-arrow-alt-right" size={24} color={colors.grey2} />
                </Pressable>
            </View>
        </Card>
    );

    return (
        <View className='flex-1'>
            <TopAppBar />
            <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-text mt-4 mb-2 mx-4'>Hashtags Categories</Text>
            <FlashList
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                data={hashtagsData}
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
        borderRadius: 20,
        marginVertical: 6,
        justifyContent: "center",
        // borderWidth: 1.5
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
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

export default HashtagsFrontPage;
