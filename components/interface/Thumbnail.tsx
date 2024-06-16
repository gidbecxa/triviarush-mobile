import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, ImageStyle } from 'react-native';
import { View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

interface RoundedImageProps {
    source: ImageSourcePropType;
    width: number;
    height: number;
    backgroundColor?: string;
}

const Thumbnail: React.FC<RoundedImageProps> = ({ source, width, height, backgroundColor }) => {

    return (
        <Image
            source={source}
            style={{
                // borderRadius: Math.min(width, height) / 4,
                width,
                height,
            }}
            className='overflow-hidden rounded-xl border-0 border-border'
            resizeMode="cover"
        />
    );
};

export default Thumbnail;

const styles = StyleSheet.create({
    image: {
        // resizeMode: 'center',
        overflow: 'hidden',
    },
});
