import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { router, usePathname } from 'expo-router';
import { fontStyles } from '~/app/_layout';
import { UserProfile } from '~/data/types';

interface AppHeaderProps {
  profile: UserProfile;
}

const AppHeader: React.FC<AppHeaderProps> = ({ profile }) => {
  const { colors } = useColorScheme();
  const pathname = usePathname();
  const isHomeScreen = pathname === '/';
  const { promptMedium, promptRegular, promptSemiBold } = fontStyles;

  return (
    <View
      className="w-full justify-between border-0 border-white"
      style={{ flexDirection: 'row', padding: 8, alignItems: 'center' }}>
      {isHomeScreen ? (
        <TouchableOpacity
          className="rounded-full border-0 border-white bg-white/15 p-3"
          onPress={() => console.log('Game menu!')}>
          <AntDesign name="appstore1" size={24} color={colors.foreground} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="rounded-full border-0 border-white bg-white/15 p-2"
          onPress={() => console.log('Game menu!')}>
          <MaterialCommunityIcons name="arrow-up-thin" size={25} color={colors.primary} />
        </TouchableOpacity>
      )}

      <View className="flex-1 flex-row items-center justify-center border-0 border-white">
        {isHomeScreen ? (
          <>
            <Text variant="heading" style={[promptMedium, { position: 'relative', top: 1 }]}>
              {profile && profile.points}
              {'2,345'}{' '}
            </Text>
            <AntDesign name="star" size={20} color={colors.tertiary} />
          </>
        ) : (
          <Text
            variant="title3"
            style={[promptSemiBold, { position: 'relative', top: 1, left: '-8%' }]}>
            {profile && profile.username}
          </Text>
        )}
      </View>

      {isHomeScreen ? (
        <TouchableOpacity
          className="z-10 h-12 w-12 rounded-full"
          onPress={() => router.push('/profile')}>
          <Image
            source={{ uri: profile.avatar }}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            contentFit="cover"
            alt="Profile avatar"
            cachePolicy="memory-disk"
          />
          <View
            className="absolute bottom-0 right-0 z-20 h-3 w-3 rounded-full"
            style={{ backgroundColor: profile.isOnline ? colors.primary : colors.destructive }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="rounded-full border-0 border-white bg-white/0 p-3"
          onPress={() => console.log('Notifications!')}>
          <Ionicons name="notifications" size={24} color={colors.foreground} />
          <View
            className="absolute right-2 top-3 z-20 h-3 w-3 rounded-full"
            style={{ backgroundColor: colors.destructive }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppHeader;

/**
 * 
 */
