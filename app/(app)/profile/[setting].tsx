import React from 'react';
import { Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import ChangeAvatar from '~/components/settings/ChangeAvatar';
import ChangeTopics from '~/components/settings/ChangeTopics';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AccountSecurity from '~/components/settings/AccountSecurity';
import SoundSettings from '~/components/settings/Sound';
import LanguageSettings from '~/components/settings/Language';
import SocialSettings from '~/components/settings/Social';
import EnablePlayOffline from '~/components/settings/PlayOffline';
import PrivacySettings from '~/components/settings/Privacy';
import DeleteAccount from '~/components/settings/DeleteAccount';

export default function SettingScreen() {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();
  const { setting, title } = useLocalSearchParams();
  console.log('Search params: Setting', setting);

  const navigation = useNavigation();

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
            {String(title)}
          </Text>
        </View>
      ),
      animation: "flip"
    });
  }, []);

  const settingComponent = COMPONENTS.find((c) => c.name === setting);

  return (
    <View className="flex-1">
      {settingComponent ? (
        <settingComponent.component />
      ) : (
        <Text
          variant="body"
          style={[fontStyles.promptLightItalic, { color: colors.grey }]}
          className="text-center">
          Setting not found
        </Text>
      )}
    </View>
  );
}

type ComponentItem = { name: string; component: React.FC };

const COMPONENTS: ComponentItem[] = [
  {
    name: 'avatar',
    component: () => <ChangeAvatar />,
  },
  {
    name: 'topics',
    component: () => <ChangeTopics />,
  },
  {
    name: 'security',
    component: () => <AccountSecurity />,
  },
  {
    name: 'sound',
    component: () => <SoundSettings />,
  },
  {
    name: 'language',
    component: () => <LanguageSettings />,
  },
  {
    name: 'social',
    component: () => <SocialSettings />,
  },
  {
    name: 'offline',
    component: () => <EnablePlayOffline />,
  },
  {
    name: 'privacy',
    component: () => <PrivacySettings />,
  },
  {
    name: 'delete',
    component: () => <DeleteAccount />,
  },
];
