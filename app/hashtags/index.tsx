import React from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { hashtagsData } from '~/data/hashtags';
import { FlashList } from '@shopify/flash-list';
import ImageIllustration from '~/components/interface/ImageIllustration';
import TopAppBar from '~/components/interface/AppBar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';

import topics from "~/assets/content/hashtags.json"
import { Topic } from '~/data/types';
import { router } from 'expo-router';

function keyExtractor(item: Topic) {
    return String(item.id);
}

const HashtagsFrontPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { width, height } = useWindowDimensions();
    const { colors, isDarkColorScheme } = useColorScheme();

    const renderCard = ({ item }: { item: Topic }) => (
        <Card
            elevation={0}
            style={[styles.card, { height: height / 9, backgroundColor: colors.background }]}
            className='border-border'
            onPress={() => {
                router.navigate({ pathname: item.href, params: { topic: item.id } })
            }}
        >
            <View style={styles.cardContent} className='px-2 border-0 border-border'>
                <ImageIllustration source={{ uri: item.illustration }} width={40} height={40} backgroundColor={"transparent"} />
                <View style={styles.textContainer} className='border-0 border-border'>
                    <Text variant="callout" style={fontStyles.dmSansMedium} className='text-text'>{item.title}</Text>
                    <Text variant="caption1" style={[fontStyles.dmSansRegular, { marginTop: 1 }]} numberOfLines={2} className='text-text leading-tight'>
                        {item.description}
                    </Text>
                </View>
                <Pressable
                    /* style={{
                        backgroundColor: isDarkColorScheme ? "white" : colors.grey6,
                        width: 40,
                        height: 40,
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
            <Text variant="heading" style={fontStyles.dmSansSemiBold} className='text-text mt-4 mb-2 mx-4'>Hashtags Topics</Text>
            <FlashList
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                data={topics}
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
        alignItems: "flex-end",
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

export default HashtagsFrontPage;
