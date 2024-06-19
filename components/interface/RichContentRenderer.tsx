// RichContentRenderer.tsx
import React from 'react';
import { Image, TouchableOpacity, Linking, View, Text as RNText, useWindowDimensions } from 'react-native';
import { ContentBlock } from '~/data/types';
import { Text } from '../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';

interface RichContentRendererProps {
    content: ContentBlock[];
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
    const { colors } = useColorScheme();
    const {width, height} = useWindowDimensions();

    const splitTextWithHashtags = (text: string) => {
        const regex = /(#\w+)/g;
        const parts = [];
        let lastIndex = 0;

        for (const match of text.matchAll(regex)) {
            const word = match[0];
            const index = match.index;
            if (index !== lastIndex) {
                parts.push(text.slice(lastIndex, index));
            }
            parts.push(word);
            lastIndex = index + word.length;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    return (
        <View style={{ width, }} className='flex-1 px-3 pb-12 border-0 border-border'>
            {content.map((block, index) => {
                switch (block.type) {
                    case 'title':
                        return (
                            <Text
                                key={index}
                                variant="title3"
                                style={[
                                    fontStyles.dmSansSemiBold,
                                    {
                                        /* fontWeight: block.style?.fontWeight, */
                                        color: colors.foreground,
                                    }
                                ]}
                                className='leading-loose mt-2 mb-1'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'subtitle':
                        return (
                            <Text
                                key={index}
                                variant="heading"
                                style={[
                                    fontStyles.dmSansSemiBold,
                                    {
                                        // fontWeight: block.style?.fontWeight,
                                        color: colors.foreground,
                                    }
                                ]}
                                className='leading-loose mt-1'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'paragraph':
                        const words = splitTextWithHashtags(block.content);
                        return (
                            <Text
                                key={index}
                                variant="callout"
                                style={[
                                    fontStyles.dmSansRegular,
                                    {
                                        color: colors.grey2,
                                    }
                                ]}
                                className='leading-normal mb-1.5'
                            >
                                {words.map((word, i) =>
                                    word.startsWith('#') ? (
                                        <Text variant="callout" key={i} style={[{ color: colors.tertiary }, fontStyles.dmSansSemiBold]}>
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
                                key={index}
                                variant="subhead"
                                style={[
                                    fontStyles.dmSansRegular,
                                    {
                                        // fontWeight: block.style?.fontWeight,
                                        color: colors.grey3,
                                    }
                                ]}
                                className='leading-normal mb-2'
                            >
                                {block.content}
                            </Text>
                        );
                    case 'image':
                        return <Image key={index} source={{ uri: block.content }} style={{ width: 100, height: 100 }} />;
                    case 'link':
                        return (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(block.href || '')}>
                                <Text variant="heading" style={[{ color: colors.secondary }, fontStyles.dmSansMedium]} className='mt-2 mb-1'>
                                    {block.content}
                                </Text>
                            </TouchableOpacity>
                        );
                    default:
                        return null;
                }
            })}
        </View>
    );
};

export default RichContentRenderer;
