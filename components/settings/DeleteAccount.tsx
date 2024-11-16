import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import { Button, Modal, Portal } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { UserApi } from '~/api/api';
import { useAuthContext } from '~/store/ctx';

export default function DeleteAccount() {
  const { colors } = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const { setIsLoggedIn } = useAuthContext();

  const handleDeleteAccount = async () => {
    try {
      const localProfile = await SecureStore.getItemAsync('profile');
      if (localProfile) {
        const profile = JSON.parse(localProfile);

        await UserApi.deleteUser(profile.id);
        await SecureStore.deleteItemAsync('profile');
        await SecureStore.deleteItemAsync('settings');
        setIsLoggedIn(false);
        Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'There was an issue deleting your account. Please try again later.');
    }
    setShowModal(false);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text
        variant="title3"
        style={[
          fontStyles.promptSemiBold,
          { color: colors.foreground, marginBottom: 16, display: 'none' },
        ]}>
        Delete Your Account
      </Text>
      <Text
        variant="body"
        style={[fontStyles.promptRegular, { color: colors.foreground, marginBottom: 16 }]}>
        Deleting your account will permanently erase all your data, including your progress,
        settings, and achievements. This action cannot be undone.
      </Text>
      <Text
        variant="body"
        style={[fontStyles.promptRegular, { color: colors.foreground, marginBottom: 16 }]}>
        If you are facing issues or have any concerns, please contact our support team before
        proceeding.
      </Text>
      <Button
        mode="contained"
        onPress={() => setShowModal(true)}
        style={{ backgroundColor: colors.destructive, borderRadius: 0, padding: 4 }}>
        <Text
          variant="callout"
          style={[fontStyles.promptSemiBold, { color: colors.card, textTransform: 'uppercase' }]}>
          Delete Account
        </Text>
      </Button>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={{ padding: 16, backgroundColor: colors.grey5, margin: 16 }}>
          <View style={{ padding: 8, borderRadius: 0, gap: 8, alignItems: 'flex-start' }}>
            <Text
              variant="title3"
              style={[fontStyles.promptSemiBold, { color: colors.foreground }]}>
              Confirm Account Deletion
            </Text>
            <Text
              variant="body"
              style={[fontStyles.promptRegular, { color: colors.foreground, marginBottom: 16 }]}>
              Are you sure you want to delete your account? This action is irreversible.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
              <Button mode="text" onPress={() => setShowModal(false)} style={{ marginRight: 8 }}>
                <Text
                  variant="body"
                  style={[fontStyles.promptMedium, { color: colors.destructive }]}>
                  Cancel
                </Text>
              </Button>
              <Button
                mode="contained"
                onPress={handleDeleteAccount}
                style={{ backgroundColor: colors.destructive }}>
                <Text variant="subhead" style={[fontStyles.promptMedium, { color: colors.card }]}>
                  Delete
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
