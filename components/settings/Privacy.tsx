import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '~/app/_layout';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

const PrivacySettings = () => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
      {/* Lottie Animation */}
      <LottieView
        source={require('~/assets/lottie/Animation - 1725420630976.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />

      {/* Message */}
      <Text
        variant="title3"
        style={[
          fontStyles.promptSemiBold,
          { color: colors.foreground, textAlign: 'center', marginTop: 20 },
        ]}>
        Your Privacy Matters
      </Text>
      <Text
        variant="body"
        style={[
          fontStyles.promptRegular,
          { color: colors.grey, textAlign: 'center', marginVertical: 10 },
        ]}>
        We are working hard to bring you advanced privacy settings. Stay tuned for updates, and rest
        assured that your data is in safe hands.
      </Text>

      {/* Button to Privacy Policy */}
      <TouchableOpacity
        style={{
          width: '100%',
          marginTop: 20,
          backgroundColor: colors.primary,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => router.push('/profile/settings')}>
        <AntDesign name="infocirlceo" size={20} color={colors.card} />
        <Text
          variant="callout"
          style={[
            fontStyles.promptSemiBold,
            { color: colors.card, marginLeft: 10, textTransform: 'uppercase' },
          ]}>
          View Privacy Policy
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacySettings;
