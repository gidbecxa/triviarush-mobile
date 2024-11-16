import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  BookText,
  Dices,
  EarthLock,
  MessageCircleQuestion,
  RotateCcw,
  ShieldCheck,
  UserRoundMinus,
  UsersRound,
  LockKeyhole,
  Coins,
  CircleUserRound,
  LibraryBig,
  Languages,
} from 'lucide-react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { StyleSheet } from 'nativewind';
import { AntDesign, Feather } from '@expo/vector-icons';
import { fontStyles } from '~/app/_layout';
import { Text } from '~/components/nativewindui/Text';
import { router, useNavigation } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { UserApi } from '~/api/api';
import { Button, Modal, Portal } from 'react-native-paper';

export default function SettingsScreen() {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            width,
            height: 96,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            gap: 8,
            paddingBottom: 16,
            elevation: 6,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="border-0 border-white p-2"
            style={{ position: 'relative', bottom: 0 }}>
            <AntDesign name="arrowleft" size={24} color={colors.foreground} />
            {/* <Ionicons name='arrow-back' size={24} color={colors.foreground} /> */}
          </TouchableOpacity>

          <Text
            variant="title3"
            className="p-2"
            style={[
              fontStyles.promptMedium,
              { color: colors.foreground, fontSize: 19, position: 'relative', top: 3 },
            ]}>
            {'Settings'}
          </Text>
        </View>
      ),
    });
  }, []);

  const DEFAULT_SETTINGS = {
    sound: {
      gameMusicEnabled: true,
      soundEffectsEnabled: true,
      preferredMusicStyle: 'Action',
    },
    security: {
      twoFactorEnabled: false,
      multipleDevicesAllowed: false,
    },
    notifications: {
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: false,
    },
    language: 'ENG',
    offlineMode: false,
  };

  const restoreDefaults = async () => {
    try {
      await SecureStore.setItemAsync('settings', JSON.stringify(DEFAULT_SETTINGS));

      // Get the user profile from SecureStore
      const localProfile = await SecureStore.getItemAsync('profile');
      if (localProfile) {
        const profile = JSON.parse(localProfile);

        // Sync default settings with the server
        await UserApi.updateUser({ settings: DEFAULT_SETTINGS }, profile.id);
        console.log('Settings restored to defaults.');
      }
    } catch (error) {
      console.error('Error restoring default settings:', error);
    }
    setShowRestoreModal(false);
  };

  const routeToSetting = (setting: string, title: string) => {
    router.push({
      pathname: `/profile/${setting}`,
      params: { title },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
        <Text
          variant="heading"
          className="mt-2"
          style={[fontStyles.promptMedium, { color: colors.primary, fontSize: 18 }]}>
          Account Settings
        </Text>

        {/* Change Avatar */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('avatar', 'Change Avatar')}>
          <CircleUserRound color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Change Avatar
          </Text>
        </TouchableOpacity>

        {/* Top up RushCoins */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => router.push('/profile/topup')}>
          <Coins color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Top up RushCoins
          </Text>
        </TouchableOpacity>

        {/* Game Boosters & Powerups */}
        <TouchableOpacity style={[styles.settingItem, { borderColor: colors.grey2 }]}>
          <Dices color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Game Boosters & Powerups
          </Text>
        </TouchableOpacity>

        {/* Account Security */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('security', 'Account Security')}>
          {/* <Ionicons name="lock-closed" size={24} color={colors.grey} /> */}
          <LockKeyhole color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 1,
              },
            ]}>
            Account Security
          </Text>
        </TouchableOpacity>

        {/* Social */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('social', 'Game Pals')}>
          <UsersRound color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 1,
              },
            ]}>
            Game Pals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 2 */}
      <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
        <Text
          variant="heading"
          className="mt-2"
          style={[fontStyles.promptMedium, { color: colors.primary, fontSize: 18 }]}>
          Game Preferences
        </Text>

        {/* Change Trivia Topics */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('topics', 'Change Trivia Topics')}>
          <LibraryBig color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Change Trivia Topics
          </Text>
        </TouchableOpacity>

        {/* Play Offline Mode */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('offline', 'Switch To Offline Mode')}>
          <Feather name="wifi-off" color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Enable Play Offline
          </Text>
        </TouchableOpacity>

        {/* App Language */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('language', 'Language')}>
          <Languages color={colors.grey} size={24} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Language
          </Text>
        </TouchableOpacity>

        {/* Sound */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('sound', 'Sound')}>
          <AntDesign name="sound" size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Sound
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 3 */}
      <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
        <Text
          variant="heading"
          className="mt-2"
          style={[fontStyles.promptMedium, { color: colors.primary, fontSize: 18 }]}>
          Account Management
        </Text>

        {/* Privacy Settings */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('privacy', 'Privacy Settings')}>
          <ShieldCheck size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Privacy Settings
          </Text>
        </TouchableOpacity>

        {/* Restore Default Settings */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => setShowRestoreModal(true)}>
          <RotateCcw size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Restore Default Settings
          </Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: colors.grey2 }]}
          onPress={() => routeToSetting('delete', 'Delete Account')}>
          <UserRoundMinus size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section 4 */}
      <View style={[styles.groupContainer, { backgroundColor: colors.card, marginBottom: 32 }]}>
        <Text
          variant="heading"
          style={[fontStyles.promptMedium, { color: colors.primary, fontSize: 18 }]}
          className="mt-2">
          Help & Support
        </Text>

        {/* Help & Support */}
        <TouchableOpacity style={[styles.settingItem, { borderColor: colors.grey2 }]}>
          <MessageCircleQuestion size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Help & Support
          </Text>
        </TouchableOpacity>

        {/* Terms of Service */}
        <TouchableOpacity style={[styles.settingItem, { borderColor: colors.grey2 }]}>
          <BookText size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Terms of Service
          </Text>
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity style={[styles.settingItem, { borderColor: 'transparent' }]}>
          <EarthLock size={24} color={colors.grey} />
          <Text
            variant="callout"
            style={[
              fontStyles.promptRegular,
              {
                color: colors.foreground,
                flex: 1,
                paddingHorizontal: 16,
                position: 'relative',
                top: 0,
              },
            ]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={showRestoreModal}
          onDismiss={() => setShowRestoreModal(false)}
          contentContainerStyle={{ padding: 16, backgroundColor: colors.grey5, margin: 16 }}>
          <View style={[styles.modalContent, { backgroundColor: colors.grey5 }]}>
            <Text
              variant="title3"
              style={[fontStyles.promptSemiBold, { color: colors.foreground }]}>
              Restore Default Settings
            </Text>
            <Text variant="body" className="mb-0" style={fontStyles.promptRegular}>
              Are you sure you want to restore default settings? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="text"
                className="relative top-1 mr-2"
                onPress={() => setShowRestoreModal(false)}>
                <Text
                  variant="body"
                  style={[fontStyles.promptMedium, { color: colors.destructive }]}>
                  Cancel
                </Text>
              </Button>
              <Button
                theme={{ colors: { primary: colors.primary, onPrimary: colors.root } }}
                mode="contained"
                onPress={restoreDefaults}>
                <Text variant="subhead" style={[fontStyles.promptMedium, { color: colors.card }]}>
                  Restore
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    // borderWidth: 1,
    // borderColor: '#ccc'
  },
  groupContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    // borderWidth: 1,
    // borderColor: '#ccc'
  },
  modalContent: {
    padding: 8,
    borderRadius: 0,
    gap: 8,
    alignItems: 'flex-start',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
