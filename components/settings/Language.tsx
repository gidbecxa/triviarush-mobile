import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { RadioButton } from 'react-native-paper';
import { Modal, Button, Portal } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '~/app/_layout';
import { UserApi } from '~/api/api';
import * as SecureStore from 'expo-secure-store';

const fetchUserProfile = async () => {
  try {
    const localProfile = await SecureStore.getItemAsync('profile');
    return localProfile ? JSON.parse(localProfile) : null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

const fetchUserSettings = async () => {
  try {
    const localSettings = await SecureStore.getItemAsync('settings');
    return localSettings ? JSON.parse(localSettings) : null;
  } catch (error) {
    console.error("Error retrieving user's settings:", error);
    return null;
  }
};

const LanguageSettings = () => {
  const { colors } = useColorScheme();
  const { promptRegular, promptSemiBold, promptMedium } = fontStyles;

  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    { label: 'English', value: 'ENG' },
    { label: 'French', value: 'FRA' },
    { label: 'Spanish', value: 'SPA' },
    { label: 'German', value: 'GER' },
    { label: 'Chinese', value: 'CHI' },
    { label: 'Italian', value: 'ITA' },
    // Add more languages as needed
  ];

  useEffect(() => {
    const loadData = async () => {
      const profileData = await fetchUserProfile();
      const settingsData = await fetchUserSettings();
      if (profileData) setProfile(profileData);
      if (settingsData) {
        setSettings(settingsData);
        setSelectedLanguage(settingsData.language || 'ENG');
      }
    };
    loadData();
  }, []);

  const handleLanguageChange = async (language) => {
    if (language !== 'ENG') {
      setModalVisible(true);
    }

    // Update settings locally
    const updatedSettings = { ...settings, language };
    setSelectedLanguage(language);
    await SecureStore.setItemAsync('settings', JSON.stringify(updatedSettings));

    if (profile) {
      try {
        const data = { settings: updatedSettings };
        await UserApi.updateUser(data, profile.id);
        setSettings(updatedSettings);
      } catch (error) {
        console.error("Error updating user's language setting:", error);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: colors.background }}>
      <Text
        variant="title3"
        style={[promptSemiBold, { color: colors.foreground, marginBottom: 16, display: 'none' }]}>
        Select Language
      </Text>

      <Text variant="body" style={[promptRegular, { color: colors.grey, marginVertical: 10 }]}>
        Choose your preferred language. This setting will be applied to both the trivia games
        and the app interface.
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text variant="subhead" style={[promptMedium, { color: colors.primary, marginBottom: 8 }]}>
          Current Language
        </Text>
        <RadioButton.Group onValueChange={handleLanguageChange} value={selectedLanguage}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
            <RadioButton
              value={selectedLanguage}
              color={colors.primary}
              uncheckedColor={colors.grey2}
            />
            <Text
              variant="callout"
              style={[promptRegular, { color: colors.foreground, marginLeft: 8 }]}>
              {languages.find((lang) => lang.value === selectedLanguage)?.label}
            </Text>
          </TouchableOpacity>
        </RadioButton.Group>
      </View>

      <View>
        <Text variant="subhead" style={[promptMedium, { color: colors.grey, marginBottom: 8 }]}>
          Languages
        </Text>
        <RadioButton.Group onValueChange={handleLanguageChange} value={selectedLanguage}>
          {languages
            .filter((lang) => lang.value !== selectedLanguage)
            .map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => handleLanguageChange(lang.value)}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                <RadioButton
                  value={lang.value}
                  color={colors.primary}
                  uncheckedColor={colors.grey2}
                />
                <Text
                  variant="callout"
                  style={[promptRegular, { color: colors.foreground, marginLeft: 8 }]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
        </RadioButton.Group>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            padding: 16,
            backgroundColor: colors.grey5,
            margin: 16,
          }}>
          <View style={{ padding: 8, gap: 8, alignItems: 'flex-start' }}>
            <Text
              variant="title3"
              style={[fontStyles.promptRegular, { color: colors.foreground }]}>
              Language Unavailable
            </Text>
            <Text variant="body" style={fontStyles.promptLight}>
              The selected language is not available yet. We will notify you when it becomes available. For now, the app will continue in English.
            </Text>
            <Button
              theme={{ colors: { primary: colors.primary, onPrimary: colors.root } }}
              mode="contained"
              style={{alignSelf: "flex-end"}}
              onPress={() => setModalVisible(false)}>
              <Text variant="subhead" style={[fontStyles.promptMedium, { color: colors.card }]}>
                OK
              </Text>
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

export default LanguageSettings;
