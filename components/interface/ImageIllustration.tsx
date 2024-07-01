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

const ImageIllustration: React.FC<RoundedImageProps> = ({ source, width, height, backgroundColor }) => {
    const { colors, isDarkColorScheme } = useColorScheme();

    return (
        <View
            style={{
                // borderRadius: 0, // Math.min(width, height) / 2,
                backgroundColor: backgroundColor,
            }}
            className='overflow-hidden rounded-lg p-1.5 border-0 border-border'
        >
            <Image
                source={source}
                style={[
                    styles.image,
                    {
                        width,
                        height,
                    }
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

export default ImageIllustration;

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        borderColor: "#333",
        borderWidth: 1,
        // backgroundColor: 'white',

    },
    image: {
        resizeMode: 'center',
        // overflow: 'hidden',
    },
});
