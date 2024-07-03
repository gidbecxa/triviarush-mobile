import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useLayoutEffect } from 'react';
import { Image, ScrollView, View, useWindowDimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { setStatusBarStyle } from 'expo-status-bar';

import { fontStyles } from '../_layout';
import { useColorScheme } from '~/lib/useColorScheme';
// import RichContentRenderer from '~/components/interface/RichContentRenderer';
import RichContentRenderer from '~/components/interface/NewRichContentRender';
import { ContentBlock } from '~/data/types';
import ARTICLES_DATA from '~/data/discovery';
import { fetchContentById, } from '~/data/utils/contentService';
import { Icon } from '@roninoss/icons';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

export default function ArticlePage() {
    const localParams = useLocalSearchParams();
    const { article: articleId } = localParams;
    console.log('Article ID: ', articleId);
    const { width, height } = useWindowDimensions();
    const { colors } = useColorScheme();

    const [content, setContent] = React.useState<ContentBlock[] | null>(null);
    const [article, setArticle] = React.useState<any>(null);

    useEffect(() => {
        setStatusBarStyle('light');

        // Get the artcle + its metadata
        const fetchedArticle = ARTICLES_DATA.find((article) => article.resourceId === articleId);
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

    const { tilte, image } = article;

    return (
        <ScrollView className='flex-1'>
            {/* <TopAppBar /> */}
            <Image source={{uri: image}} style={{ width, height: height * 0.4, position: "relative", zIndex: 1 }} className='object-cover' />

            <Link href="/discovery" style={{ position: "absolute", top: 40, left: 12, zIndex: 3, backgroundColor: 'rgba(205, 205, 205, 0.5)', borderRadius: 50 }} className='p-3 rounded-full'>
                {/* <Ionicons name="chevron-back" size={24} color="#FFF" /> */}
                <Icon name="chevron-left" size={24} color="white" />
            </Link>

            <View style={{ width, marginTop: -height * 0.05, zIndex: 2, backgroundColor: colors.card }} className='rounded-t-3xl pt-6'>
                <View className='flex-row items-center justify-between px-3'>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }} className='border-0 border-border p-1.5 rounded-xl'>
                        <Ionicons name="logo-tiktok" size={16} color={colors.grey} style={{ marginRight: 4 }} />
                        <Text variant="footnote" style={[fontStyles.dmSansMedium, { color: colors.grey3 }]}>TikTok</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', }} className='border-0 border-border p-1.5 rounded-xl'>
                        <Ionicons name="trophy" size={16} color={colors.grey} style={{ marginRight: 4 }} />
                        <Text variant="footnote" style={[fontStyles.dmSansMedium, { color: colors.grey3 }]}>#1 in June 2024</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }} className='border-0 border-border p-1.5 rounded-xl'>
                        <Ionicons name="people" size={16} color={colors.grey} style={{ marginRight: 4 }} />
                        <Text variant="footnote" style={[fontStyles.dmSansMedium, { color: colors.grey3 }]}>1.2M posts</Text>
                    </View>
                </View>

                {content ? (
                    <RichContentRenderer content={content} />
                ) : (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator size={48} />
                        {/* <Text variant="body" style={fontStyles.dmSansRegular}>Loading content...</Text> */}
                    </View>
                )}
            </View>

        </ScrollView>
    );
};