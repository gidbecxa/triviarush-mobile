// RichContentRenderer.tsx
import React from 'react';
import { Image, TouchableOpacity, Linking, View, Text as RNText, useWindowDimensions, Pressable } from 'react-native';
import { ContentBlock } from '~/data/types';
import { Text } from '../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { Link } from 'expo-router';
import { Icon } from '@roninoss/icons';
import { StyleSheet } from 'nativewind';

interface RichContentRendererProps {
    content: ContentBlock[];
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
    const { colors } = useColorScheme();
    const { width } = useWindowDimensions();

    const splitTextWithHashtags = (text: string) => {
        const regex = /(#\w+)/g;
        const parts = [];
        let lastIndex = 0;

        for (const match of text.matchAll(regex)) {
            const word = match[0];
            const index = match.index;
            if (index !== undefined && index !== lastIndex) {
                parts.push(text.slice(lastIndex, index));
            }
            parts.push(word);
            lastIndex = index! + word.length;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    const applyStyles = (blockStyle: any) => {
        let style: any = {};
        if (blockStyle) {
            // style.fontWeight = blockStyle.fontWeight || 'normal';
            style.color = blockStyle.color || colors.grey;
            style.fontSize = blockStyle.fontSize || undefined;
        }
        return style;
    };

    return (
        <View style={{ width }} className='flex-1 px-3 pb-12 border-0 border-border'>
            {content.map((block, index) => {
                const styles = applyStyles(block.style);

                switch (block.type) {
                    case 'title':
                        return (
                            <Text
                                key={`${block.type}-${index}`}
                                variant="title3"
                                style={[fontStyles.dmSansSemiBold, styles]}
                                className='leading-6 mt-4 mb-3'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'subtitle':
                        return (
                            <Text
                                key={`${block.type}-${index}`}
                                variant="heading"
                                style={[fontStyles.dmSansSemiBold, styles]}
                                className='leading-loose mt-1'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'paragraph':
                        const words = splitTextWithHashtags(block.content);
                        return (
                            <Text
                                key={`${block.type}-${index}`}
                                variant="callout"
                                style={[fontStyles.dmSansRegular, styles]}
                                className='leading-normal mb-1.5'
                            >
                                {words.map((word, i) =>
                                    word.startsWith('#') ? (
                                        <Text variant="subhead" key={i} style={[{ color: colors.tertiary }, fontStyles.dmSansSemiBold]}>
                                            {word}{" "}
                                        </Text>
                                    ) : (
                                        word
                                    )
                                )}
                            </Text>
                        );
                    case 'footnote':
                        return (
                            <Text
                                key={`${block.type}-${index}`}
                                variant="subhead"
                                style={[fontStyles.dmSansRegular, styles]}
                                className='leading-normal mb-2'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'image':
                        return <Image key={`${block.type}-${index}`} source={{ uri: block.content }} style={{ width: width - 20, height: 200, resizeMode: 'contain', marginBottom: 10 }} />;
                    case 'link':
                        return (
                            <Link
                                key={`${block.type}-${index}`}
                                href="#"
                                style={[{ width: width / 2, color: colors.primary, borderColor: colors.primary, }, otherStyles.link]}
                                className='flex-row items-center border-2 rounded-full py-2 box-border px-2'
                                asChild
                            >
                                <Pressable>
                                    <Text style={[fontStyles.dmSansMedium, styles, { color: colors.primary }]} className='border-0 border-border relative bottom-0.5'>
                                        {block.content}
                                    </Text>
                                    <Icon name="chevron-right" color={colors.primary} size={24} />
                                </Pressable>
                            </Link>
                        );
                    default:
                        return null;
                }
            })}
        </View>
    );
};

const otherStyles = StyleSheet.create({
    link: { alignSelf: "center", justifyContent: "space-evenly", marginTop: 20, marginBottom: 16 }
})

export default RichContentRenderer;
