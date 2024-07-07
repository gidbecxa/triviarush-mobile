import React from 'react';
import { View, Pressable } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import Hamburger from '~/components/illustrations/Hamburger';
import {
  Link,
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
} from 'expo-router';
import { Icon } from '@roninoss/icons';

const TopAppBar = () => {
  const pathname = usePathname();
  const { colors, isDarkColorScheme } = useColorScheme();

  console.log('Route and params', pathname);
  const isIndexRoute = pathname === '/home';
  const isPlaygroundRoute = pathname === '/playground';

  return (
    <Appbar.Header style={{ backgroundColor: colors.card }} className="border-0 border-border">
      <Appbar.Action
        size={48}
        rippleColor="transparent"
        onPress={() => (isIndexRoute ? router.push('/playground') : router.back())}
        icon={() =>
          isIndexRoute ? (
            <Pressable
              accessibilityHint="Tap to view menu"
              disabled
              className="h-12 w-12"
              style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Hamburger
                width={24}
                height={24}
                stroke={isDarkColorScheme ? colors.foreground : colors.grey}
              />
            </Pressable>
          ) : (
            <Pressable
              accessibilityHint="Tap to go back"
              disabled
              className="h-12 w-12"
              style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Icon
                name="chevron-left"
                size={28}
                color={isDarkColorScheme ? colors.foreground : colors.grey}
              />
            </Pressable>
          )
        }
      />

      <Appbar.Content title="" />

      <Link href="/playground" asChild>
        {!isPlaygroundRoute && (
          <Appbar.Action
            size={48}
            rippleColor="transparent"
            icon={() => (
              <Pressable
                accessibilityHint="Tap to go to app settings"
                disabled
                className="h-12 w-12"
                style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                <AntDesign
                  name="setting"
                  size={24}
                  color={isDarkColorScheme ? colors.foreground : colors.grey}
                />
              </Pressable>
            )}
          />
        )}
      </Link>
    </Appbar.Header>
  );
};

export default TopAppBar;
