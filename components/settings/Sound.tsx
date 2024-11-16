import React, { useState } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '../nativewindui/Toggle';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { UserApi } from '~/api/api';
import { UserProfile } from '~/data/types';
import { Picker, PickerItem } from '../nativewindui/Picker';
import { Icon } from '@roninoss/icons';
import { Menu } from 'react-native-paper';

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const localProfile = await SecureStore.getItemAsync('profile');
    if (localProfile) {
      return JSON.parse(localProfile);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

const fetchUserSettings = async (): Promise<any | null> => {
  try {
    const localSettings = await SecureStore.getItemAsync('settings');
    if (localSettings) {
    //   console.log("User's settings:", localSettings);
      return JSON.parse(localSettings);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving user's settings:", error);
    return null;
  }
};

const SoundSettings = () => {
  const { colors } = useColorScheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSoundEffectsEnabled, setIsSoundEffectsEnabled] = useState(true);
  const [selectedMusicStyle, setSelectedMusicStyle] = useState('action');
  const [menuVisible, setMenuVisible] = useState(false);

  const musicStyles = ['Action', 'Chill', 'Epic', 'Funky', 'Retro'];

  React.useEffect(() => {
    const initializeUserData = async () => {
      const profile = await fetchUserProfile();
      const settings = await fetchUserSettings();

      if (profile) {
        setProfile(profile);
      } else {
        console.log('No profile found');
      }

      if (settings && settings.sound) {
        // console.log("User's sound settings:", settings);
        setSettings(settings);
        setIsMusicEnabled(settings.sound.gameMusicEnabled);
        setIsSoundEffectsEnabled(settings.sound.soundEffectsEnabled);
        setSelectedMusicStyle(settings.sound.preferredMusicStyle);
      } else {
        console.log('No settings found');
      }
    };

    initializeUserData();
  }, []);

  const saveSoundSettings = async (updatedSettings: any) => {
    try {
      await SecureStore.setItemAsync('settings', JSON.stringify(updatedSettings));

      // Sync with the server
      if (profile) {
        try {
          await UserApi.updateUser({ settings: updatedSettings }, profile.id);
          console.log("User's sound settings updated on the server.");
        } catch (error) {
          console.error('An error occoured while updating setthings');
        }
      }
    } catch (error) {
      console.error("Error updating user's sound settings:", error);
    }
  };

  const handleToggleMusic = () => {
    const updatedSettings = {
      ...settings,
      sound: {
        ...settings?.sound,
        gameMusicEnabled: !isMusicEnabled,
      },
    };
    setIsMusicEnabled(!isMusicEnabled);
    saveSoundSettings(updatedSettings);
  };

  const handleToggleSoundEffects = () => {
    const updatedSettings = {
      ...settings,
      sound: {
        ...settings?.sound,
        soundEffectsEnabled: !isSoundEffectsEnabled,
      },
    };
    setIsSoundEffectsEnabled(!isSoundEffectsEnabled);
    saveSoundSettings(updatedSettings);
  };

  const handleMusicStyleChange = async (style: string) => {
    const updatedSettings = {
      ...settings,
      sound: {
        ...settings?.sound,
        preferredMusicStyle: style,
      },
    };
    setSelectedMusicStyle(style);
    setMenuVisible(false);
    saveSoundSettings(updatedSettings);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      {/* Enable Game Music */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Enable Game Music
        </Text>
        <Toggle value={isMusicEnabled} onValueChange={handleToggleMusic} />
      </View>

      {/* Enable Sound Effects */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Enable Sound Effects
        </Text>
        <Toggle value={isSoundEffectsEnabled} onValueChange={handleToggleSoundEffects} />
      </View>

      {/* Choose Preferred Music Style */}
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 15,
          paddingRight: 12,
          //   borderWidth: 1,
          //   borderColor: colors.grey2,
        }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchorPosition="bottom"
          style={{
            borderWidth: 0,
            borderColor: '#ccc',
            width: '100%',
            paddingTop: 40,
            alignItems: 'flex-end',
            paddingEnd: 0,
          }}
          contentStyle={{
            borderWidth: 0,
            borderColor: '#ccc',
            backgroundColor: colors.grey5,
            width: 200,
          }}
          elevation={3}
          anchor={
            <Pressable
              onPress={() => setMenuVisible(true)}
              className="w-full flex-row items-center justify-between border-0 border-white">
              <Text
                variant="callout"
                style={[fontStyles.promptRegular, { color: colors.foreground }]}>
                Choose Music Style
              </Text>
              <Text
                variant="callout"
                className="capitalize"
                style={[fontStyles.promptRegular, { color: colors.grey }]}>
                {selectedMusicStyle}
              </Text>
            </Pressable>
          }>
          {musicStyles.map((option) => (
            <Menu.Item
              key={option}
              rippleColor="rgba(48, 209, 88, 0.25)"
              onPress={() => handleMusicStyleChange(option)}
              title={
                <Text variant="callout" style={fontStyles.promptRegular}>
                  {option}
                </Text>
              }
            />
          ))}
        </Menu>
      </View>
    </View>
  );
};

export default SoundSettings;
