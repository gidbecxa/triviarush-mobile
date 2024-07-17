import { Icon } from '@roninoss/icons';
import { Image, useWindowDimensions, View, StyleSheet, ImageBackground } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Link, router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { fontStyles } from './_layout';
import React from 'react';

export default function GetStarted() {
  const { setColorScheme } = useColorScheme();

  const { width } = useWindowDimensions();
  const { colors } = useColorScheme();

  React.useEffect(() => {
    setColorScheme('dark');
  }, []);

  return (
    <View className="flex-1">
      <ImageBackground
        className="flex-1"
        style={{ width }}
        source={require('~/assets/graphics/ImageBackground01.png')}
        imageStyle={{ resizeMode: 'cover', backgroundColor: colors.background }}
        alt="Background graphic">
        <View className="flex-1 items-center justify-center px-5 pb-12">
          <View
            className="mb-4 items-center justify-center rounded-full p-2"
            style={{
              width: width * 0.25,
              height: width * 0.25,
              backgroundColor: colors.grey5,
            }}>
            <Image
              source={require('~/assets/graphics/rocket.png')}
              alt="TriviaRush Rocket"
              style={{
                resizeMode: 'contain',
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>

          <Text variant="title1" className="mb-2.5 text-center" style={fontStyles.promptSemiBold}>
            Welcome to TriviaRush!
          </Text>

          <Text variant="callout" className="mb-7 text-center" style={fontStyles.promptRegular}>
            Fastest Finger First! Challenge yourself to answer trivia questions as fast as possible
            and earn great rewards.{' '}
            <Text variant="callout" className="font-medium">
              Ready to rush?
            </Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.replace('/signin');
            }}
            className="w-full items-center py-4"
            style={{ borderRadius: 0, backgroundColor: colors.primary }}>
            <Text variant="heading" className="text-text" style={fontStyles.promptMedium}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
