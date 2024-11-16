import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '../nativewindui/Toggle';
import { Modal, Button, Portal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Sheet, useSheetRef } from '../nativewindui/Sheet';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { StyleSheet } from 'nativewind';
import { UserApi } from '~/api/api';
import { UserProfile } from '~/data/types';

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const localProfile = await SecureStore.getItemAsync('profile');
    if (localProfile) {
      const profile = JSON.parse(localProfile);
      return profile;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

const AccountSecurity = () => {
  const { colors } = useColorScheme();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [is2FAToggleOn, setIs2FAToggleOn] = useState(false);
  const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);
  const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
  const sheetRef = useSheetRef();
  const [newEmail, setNewEmail] = useState('');

  const { promptMedium, promptRegular, promptSemiBold, promptLight } = fontStyles;

  React.useEffect(() => {
    const setProfileData = async () => {
      const profile = await fetchUserProfile();
      if (profile) {
        // console.log('Profile found:', profile);
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    setProfileData();
  }, []);

  const handleToggle2FA = () => {
    setIs2FAToggleOn(!is2FAToggleOn);
    if (!is2FAToggleOn) {
      setIs2FAModalVisible(true);
    }
  };

  const hideToggle2FAModal = () => {
    setIs2FAModalVisible(false);
    setIs2FAToggleOn(!is2FAToggleOn);
  };

  const handleDeviceLogout = () => {
    setIsDeviceModalVisible(true);
  };

  const handleRequestEmailChange = () => {
    sheetRef.current?.present();
  };

  const handleDevicesUpdate = async () => {
    if (!profile) {
      console.log('Cannot update users setting');
      return;
    }

    const updatedProfile = { ...profile, multipleDevicesAllowed: !profile.multipleDevicesAllowed };
    await SecureStore.setItemAsync('profile', JSON.stringify(updatedProfile));
    const data = { multipleDevicesAllowed: !profile.multipleDevicesAllowed };
    try {
      console.log('User data:', data);
      await UserApi.updateUser(data, profile.id).then((res) => {
        console.log("User's setting updated:", res);
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating user's setting:", error);
    }
  };

  const deviceModalContent = profile?.multipleDevicesAllowed ? (
    <>
      <Text variant="body" className="mb-0" style={promptLight}>
        {'Are you sure you want to disable sign-in via other devices?'}
      </Text>
    </>
  ) : (
    <>
      <Text variant="body" className="mb-0" style={promptLight}>
        {
          'Enabling sign-in via other devices will allow you to access your account from multiple devices. '
        }
      </Text>
      <Text variant="body" className="mb-0" style={promptLight}>
        <Ionicons name="warning" size={16} color={colors.destructive} />{' '}
        {'Make sure to log out from any shared or public devices to keep your account secure.'}
      </Text>
    </>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      {/* Enable 2FA */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Enable 2FA
        </Text>
        <Toggle value={is2FAToggleOn} onValueChange={handleToggle2FA} />
      </View>

      {/* Device */}
      <TouchableOpacity
        onPress={handleDeviceLogout}
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Enable sign-in on other devices
        </Text>
        <Text
          variant="callout"
          style={[
            fontStyles.promptRegular,
            { color: profile?.multipleDevicesAllowed ? colors.primary : colors.grey },
          ]}>
          {profile?.multipleDevicesAllowed ? 'On' : 'Off'}
        </Text>
      </TouchableOpacity>

      {/* Request Email Change */}
      <TouchableOpacity
        onPress={handleRequestEmailChange}
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
        <Text variant="callout" style={[fontStyles.promptRegular, { color: colors.foreground }]}>
          Request E-mail change
        </Text>
      </TouchableOpacity>

      {/* Modal for 2FA */}
      <Portal>
        <Modal
          visible={is2FAModalVisible}
          onDismiss={hideToggle2FAModal}
          contentContainerStyle={{ padding: 16, backgroundColor: colors.grey5, margin: 16 }}>
          <View style={[styles.modalContent, { backgroundColor: colors.grey5 }]}>
            <Text variant="title3" style={[promptRegular, { color: colors.foreground }]}>
              2FA Coming Soon
            </Text>
            <Text variant="body" className="mb-0" style={promptLight}>
              {'The 2FA feature will be available soon. Stay tuned!'}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                theme={{ colors: { primary: colors.primary, onPrimary: colors.root } }}
                mode="contained"
                onPress={hideToggle2FAModal}>
                <Text variant="subhead" style={[promptMedium, { color: colors.card }]}>
                  OK
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Modal for Device */}
      <Portal>
        <Modal
          visible={isDeviceModalVisible}
          onDismiss={() => setIsDeviceModalVisible(false)}
          contentContainerStyle={{ padding: 16, backgroundColor: colors.grey5, margin: 16 }}>
          <View style={[styles.modalContent, { backgroundColor: colors.grey5 }]}>
            <Text variant="title3" style={[promptRegular, { color: colors.foreground }]}>
              Sign-in via other devices
            </Text>
            {deviceModalContent}
            <View style={styles.modalButtons}>
              <Button
                mode="text"
                className="relative top-1 mr-2"
                onPress={() => setIsDeviceModalVisible(false)}>
                <Text variant="body" style={[promptMedium, { color: colors.destructive }]}>
                  No
                </Text>
              </Button>
              <Button
                theme={{ colors: { primary: colors.primary, onPrimary: colors.root } }}
                mode="contained"
                onPress={() => {
                  {
                    setIsDeviceModalVisible(false);
                    handleDevicesUpdate();
                  }
                }}>
                <Text variant="subhead" style={[promptMedium, { color: colors.card }]}>
                  Yes
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Bottom Sheet for Email Change */}
      <Sheet
        ref={sheetRef}
        snapPoints={[296, 560]}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore">
        <View className="px-4">
          <Text variant="title3" style={[fontStyles.promptSemiBold, { color: colors.foreground }]}>
            Change Email
          </Text>

          <TextInput
            className="my-4 w-full p-2"
            placeholder="Enter new email"
            placeholderTextColor={colors.grey}
            value={newEmail}
            onChangeText={setNewEmail}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
              color: colors.foreground,
              fontFamily: 'Prompt-Regular',
              fontSize: 16,
            }}
          />

          <View className="flex-row gap-2">
            <Ionicons name="information-circle-outline" size={20} color={colors.grey} />
            <Text variant="footnote" style={[fontStyles.promptRegular, { color: colors.grey }]}>
              You can't change your email at the moment because 2FA is disabled.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => null}
            style={{ backgroundColor: colors.primary }}
            className="my-4 flex-row items-center justify-center gap-2 p-3">
            <Text variant="callout" style={promptMedium} className="text-text uppercase">
              {'Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </Sheet>
    </View>
  );
};

export default AccountSecurity;

const styles = StyleSheet.create({
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
