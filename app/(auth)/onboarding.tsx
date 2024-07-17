import React, { useEffect, useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '../_layout';

export default function UserOnboarding() {
  const [username, setUsername] = useState('');
  const { colors, setColorScheme } = useColorScheme();

  React.useEffect(() => {
    setColorScheme('dark');
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        const fullName =  parsedUser.username || '';
        const firstName = fullName.split(' ')[0]; // We pick the first name
        setUsername(firstName || '');
      }
    };

    fetchUser();
  }, []);

  const storeUsername = async (newUsername: string) => {
    try {
      const user = await SecureStore.getItemAsync('profile');
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.username = newUsername;
        await SecureStore.setItemAsync('profile', JSON.stringify(parsedUser));
        console.log('New username stored!');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  const handleNext = () => {
    storeUsername(username);
  };

  return (
    <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: colors.background }}>
      <Text variant="title1" className="mb-2.5 text-center" style={fontStyles.promptSemiBold}>
        Choose your username
      </Text>
      
      <Text variant="callout" className="mb-2.5 text-center" style={fontStyles.promptRegular}>
        Hi, {username}!
      </Text>
      
      <Text variant="callout" className="mb-7 text-center" style={fontStyles.promptRegular}>
        Choose your username or let's keep it the current name. You can always change it later in your profile settings
      </Text>
      
      <TextInput
        className="w-full border border-white mb-4 px-2 py-3"
        placeholder="Enter your username"
        placeholderTextColor={colors.grey}
        value={username}
        onChangeText={setUsername}
        style={{
          borderColor: colors.grey,
          color: colors.foreground,
        }}
      />
      
      <TouchableOpacity
        onPress={handleNext}
        className="w-full items-center py-4"
        style={{ borderRadius: 0, backgroundColor: colors.primary }}>
        <Text variant="heading" className="text-text" style={fontStyles.promptMedium}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
