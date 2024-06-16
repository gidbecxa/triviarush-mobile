// RichContentRenderer.tsx
import React from 'react';
import { Text, Image, TouchableOpacity, Linking, View } from 'react-native';
import { ContentBlock } from '~/data/types';

interface RichContentRendererProps {
    content: ContentBlock[];
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
    return (
        <View>
            {content.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return (
                            <Text
                                key={index}
                                style={{
                                    fontWeight: block.style?.fontWeight,
                                    fontStyle: block.style?.fontStyle,
                                    color: block.style?.color,
                                }}
                            >
                                {block.content}
                            </Text>
                        );
                    case 'image':
                        return <Image key={index} source={{ uri: block.content }} style={{ width: 100, height: 100 }} />;
                    case 'link':
                        return (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(block.href || '')}>
                                <Text style={{ color: block.style?.color }}>{block.content}</Text>
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
