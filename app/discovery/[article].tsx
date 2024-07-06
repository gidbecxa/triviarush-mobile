import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, Image, Pressable, View, useWindowDimensions } from 'react-native';
import { FontAwesome5, Ionicons, FontAwesome6, Octicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { setStatusBarStyle } from 'expo-status-bar';
import { fontStyles } from '../_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { Icon } from '@roninoss/icons';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

import RichContentRenderer from '~/components/interface/NewRichContentRender';
import { ContentBlock } from '~/data/types';
import articles from "~/assets/content/articles.json";
import { fetchContentById, } from '~/data/utils/contentService';
import DiscoverFAB from '~/components/interface/DiscoverFAB';

export default function ArticlePage() {
    const localParams = useLocalSearchParams();
    const { article: articleId } = localParams;
    console.log('Article ID: ', articleId);
    const { width, height } = useWindowDimensions();
    const { colors } = useColorScheme();

    const [content, setContent] = React.useState<ContentBlock[] | null>(null);
    const [article, setArticle] = React.useState<any>(null);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setStatusBarStyle('light');

        // Get the artcle + its metadata
        const fetchedArticle = articles.find((article) => article.resourceId === articleId);
        setArticle(fetchedArticle);

        if (fetchedArticle) {
            // Load the content
            fetchContentById(fetchedArticle.resourceId)
                .then((content) => {
                    setContent(content);
                })
                .catch((error) => {
                    console.error('Error loading content:', error);
                    router.back();
                });
        }
    }, [articleId]);

    if (!article) {
        return (
            <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size={48} />
                {/* <Text variant="body" style={fontStyles.dmSansRegular}>Oops! Article not available!</Text> */}
            </View>
        );
    }

    const { title, image, tags, label, stats } = article;
    console.log('Details: ', title, tags, label), stats

    return (
        <View className='flex-1'>
            <Animated.ScrollView
                className='flex-1'
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* <TopAppBar /> */}
                <Image source={{ uri: image }} style={{ width, height: height * 0.4, position: "relative", zIndex: 1 }} className='object-cover' />

                <Pressable onPress={() => router.back()} style={{ position: "absolute", top: 40, left: 12, zIndex: 3, backgroundColor: 'rgba(205, 205, 205, 0.5)', borderRadius: 50 }} className='p-3 rounded-full'>
                    <Icon name="chevron-left" size={24} color="white" />
                </Pressable>

                <View style={{ width, marginTop: -height * 0.05, zIndex: 2, backgroundColor: colors.card }} className='rounded-t-3xl pt-6'>
                    <View className='flex-row items-center justify-between px-3'>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }} className='border-0 border-border p-1.5 rounded-xl'>
                            {tags.includes("TikTok") && <Ionicons name="logo-tiktok" size={16} color={colors.grey} style={{ marginRight: 4 }} />}
                            {tags.includes("Instagram") && <Ionicons name="logo-instagram" size={16} color={colors.grey} style={{ marginRight: 4 }} />}
                            {tags.includes("YouTube") && <Ionicons name="logo-youtube" size={16} color={colors.grey} style={{ marginRight: 4 }} />}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', display: "none" }} className='border-0 border-border p-1.5 rounded-xl'>
                            <Octicons name="star-fill" size={16} color={colors.grey} style={{ marginRight: 4 }} />
                            <Text variant="footnote" style={[fontStyles.dmSansMedium, { color: colors.grey3 }]}>
                                {label ? label : "Trending"}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }} className='border-0 border-border p-1.5 rounded-xl'>
                            <Ionicons name="stats-chart" size={15} color={colors.grey} style={{ marginRight: 4 }} />
                            <Text
                                variant="footnote"
                                style={[fontStyles.dmSansMedium, { color: colors.grey3 }]}
                                className='relative top-0.5 capitalize'>
                                {stats? stats : "unavailable"}
                            </Text>
                        </View>
                    </View>

                    {content ? (
                        <RichContentRenderer content={content} />
                    ) : (
                        <View className='flex-1 justify-center items-center'>
                            <ActivityIndicator size={48} />
                        </View>
                    )}
                </View>
            </Animated.ScrollView>
            <DiscoverFAB scrollY={scrollY} />
        </View>
    );
};