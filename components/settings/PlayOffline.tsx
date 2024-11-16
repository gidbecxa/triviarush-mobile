import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '~/components/nativewindui/Toggle';
import { Modal, Button, Portal } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '~/app/_layout';
import * as SecureStore from 'expo-secure-store';
import { UserApi } from '~/api/api';
import { UserProfile } from '~/data/types';

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
      return JSON.parse(localSettings);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving user's settings:", error);
    return null;
  }
};

const EnablePlayOffline = () => {
  const { colors } = useColorScheme();
  const [isOfflineModeOn, setIsOfflineModeOn] = useState(false);
  const [isOfflineModalVisible, setIsOfflineModalVisible] = useState(false);
  const [settings, setSettings] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  React.useEffect(() => {
    const initializeUserData = async () => {
      const profile = await fetchUserProfile();
      const settings = await fetchUserSettings();

      if (profile) {
        setProfile(profile);
      } else {
        console.log('No profile found');
      }

      if (settings) {
        setSettings(settings);
        setIsOfflineModeOn(settings?.offlineMode || false);
      }
    };

    initializeUserData();
  }, []);

  const handleToggleOfflineMode = () => {
    setIsOfflineModeOn(!isOfflineModeOn);
    updateOfflineMode(!isOfflineModeOn);
  };

  const updateOfflineMode = async (offlineMode: boolean) => {
    if (!settings) return;

    const updatedSettings = { ...settings, offlineMode };
    setSettings(updatedSettings);
    await SecureStore.setItemAsync('settings', JSON.stringify(updatedSettings));

    try {
      const data = { settings: updatedSettings };
      await UserApi.updateUser(data, profile.id).then((res) => {
        console.log("User's offline mode updated:", res);
      });
    } catch (error) {
      console.error("Error updating user's offline mode:", error);
    }
  };

  /* const hideOfflineModal = () => {
    setIsOfflineModalVisible(false);
    updateOfflineMode(true); // Confirm offline mode
  }; */

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text
        variant="title3"
        style={[fontStyles.promptMedium, { color: colors.foreground, fontSize: 18, display: 'none' }]}>
        Play Offline
      </Text>

      <Text
        variant="body"
        style={[fontStyles.promptRegular, { color: colors.grey, marginVertical: 10 }]}>
        Switch to offline mode and enjoy playing TriviaRush offline. In offline mode, you will be
        limited to solo play with a restricted set of trivia questions available offline.
      </Text>

      <Text
        variant="body"
        style={[fontStyles.promptRegular, { color: colors.grey, marginVertical: 10 }]}>
        For the full experience, such as multiplayer and special rush games, stay online.
      </Text>

      {/* Enable Play Offline */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Enable Play Offline
        </Text>
        <Toggle value={isOfflineModeOn} onValueChange={handleToggleOfflineMode} />
      </View>

      {/* Modal for Offline Mode Warning */}
      {/* <Portal>
        <Modal
          visible={isOfflineModalVisible}
          onDismiss={() => setIsOfflineModalVisible(false)}
          contentContainerStyle={{ padding: 16, backgroundColor: colors.grey5, margin: 16 }}>
          <View style={{ padding: 8, gap: 8 }}>
            <Text variant="title3" style={[fontStyles.promptMedium, { color: colors.foreground }]}>
              Switch to Offline Mode
            </Text>
            <Text variant="body" style={[fontStyles.promptRegular, { color: colors.grey }]}>
              In offline mode, you will be limited to solo play with a restricted set of trivia questions.
              For the full experience, including multiplayer and special rush modes, stay online.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button
                mode="text"
                onPress={() => setIsOfflineModalVisible(false)}
                style={{ marginRight: 8 }}>
                <Text variant="body" style={[fontStyles.promptRegular, { color: colors.destructive }]}>
                  Cancel
                </Text>
              </Button>
              <Button
                mode="contained"
                onPress={hideOfflineModal}
                style={{ backgroundColor: colors.primary }}>
                <Text variant="body" style={[fontStyles.promptRegular, { color: colors.card }]}>
                  Proceed
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal> */}
    </View>
  );
};

export default EnablePlayOffline;
