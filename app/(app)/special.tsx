import React from 'react';
import { View, Pressable, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { TriviaSpecial, UserProfile } from '~/data/types';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'nativewind';
import { fontStyles } from '../_layout';
import { Ionicons } from '@expo/vector-icons';

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await SecureStore.getItemAsync('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

export default function SpecialFrontPage() {
  const { colors } = useColorScheme();
  const { special } = useLocalSearchParams();
  const specialData: TriviaSpecial = JSON.parse(special as string);
  const { promptSemiBold, promptMedium, promptRegular } = fontStyles;
  const { width: vw, height: vh } = useWindowDimensions();

  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        // console.log('Profile:', profile);
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    fetchProfile();
  }, []);

  const width = vw * 0.9; // avatar width
  const height = vh * 0.525; // avatar height

  return (
    <ImageBackground
      style={styles.container}
      cachePolicy="memory-disk"
      contentFit="cover"
      contentPosition="center"
      source={{ uri: specialData.avatar }}>
      <BlurView
        className="flex-1 items-center border-0 border-white py-4"
        intensity={60}
        tint="systemChromeMaterialDark"
        experimentalBlurMethod="dimezisBlurView">
        <View style={styles.header}>
          <TouchableOpacity
            className="absolute left-2 top-3 rounded-full bg-white/0 p-4"
            onPress={() => router.dismiss()}>
            <Ionicons name="chevron-back" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <Text variant="heading" className="flex-1 text-center tracking-wide" style={promptRegular}>
            Special Rush
          </Text>
        </View>

        {/* The special trivia's avatar */}
        <View style={[styles.avatarContainer, { width, height }]}>
          <View style={[styles.avatarShadow, { width, height }]} />
          <Image
            style={styles.avatar}
            contentFit="cover"
            contentPosition="center"
            // className="rounded-3xl"
            source={specialData.avatar}
            alt={`Avatar for ${specialData.title}`}
            cachePolicy="memory-disk"
          />
          <View style={{position: 'absolute', left: 12, bottom: 12}}>
          <Text
            variant="footnote"
            className="rounded-full text-center capitalize"
            style={[{ backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 6 }, fontStyles.promptMedium]}>
            {specialData.gameStatus}
          </Text>
        </View>
        </View>

        {/* The content section */}
        <View style={[styles.contentWrapper, {width}]}>
        <Text variant="title3" className="text-center tracking-wide mb-1" style={promptSemiBold}>
            {specialData.title}
          </Text>
          <Text variant="footnote" className="text-center tracking-normal mb-4" style={promptRegular}>
            {specialData.caption}
          </Text>
          <Text variant="subhead" numberOfLines={5} className="tracking-normal leading-5" style={promptRegular}>
            {specialData.description}
          </Text>
          <TouchableOpacity
                onPress={()=>null}
                className="w-full items-center py-4 mt-4"
                style={{ borderRadius: 0, backgroundColor: colors.primary }}>
                <Text
                  variant="heading"
                  className="text-text uppercase"
                  style={fontStyles.promptSemiBold}>
                  Next
                </Text>
              </TouchableOpacity>
        </View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    padding: 24,
  },
  avatarContainer: {
    alignSelf: 'center',
    // alignItems: 'center'
  },
  avatarShadow: {
    borderRadius: 60,
    backgroundColor: 'transparent',
    position: 'absolute',
    shadowColor: '#2b3c50',
    shadowOffset: { width: 20, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20, // For Android shadow
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentWrapper: {
    flex:1,
    alignItems: 'center',
    paddingVertical: 12,
    // justifyContent: 'center',
    // borderColor: "#ccc",
    // borderWidth: 2,
  },
});
