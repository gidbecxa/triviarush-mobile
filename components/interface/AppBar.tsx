import React from 'react';
import { View, Pressable } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import Hamburger from '~/components/illustrations/Hamburger';
import { Link, router, useGlobalSearchParams, useLocalSearchParams, usePathname, } from 'expo-router';
import { Icon } from '@roninoss/icons';

const TopAppBar = () => {
    const pathname = usePathname();
    const { colors } = useColorScheme();

    console.log('Route and params', pathname);
    const isIndexRoute = pathname === '/home';
    const isPlaygroundRoute = pathname === '/playground';

    return (
        <Appbar.Header style={{ backgroundColor: colors.card }} className='border-0 border-border'>
            <Pressable onPress={() => isIndexRoute ? router.push("/playground") : router.back()}>
                <Appbar.Action
                    icon={() =>
                        isIndexRoute ? (
                            <Hamburger width={24} height={24} stroke={colors.grey} />
                        ) : (
                            <Icon name="chevron-left" size={28} color={colors.grey} />
                        )
                    }
                />
            </Pressable>

            <Appbar.Content title="" />

            <Link href="/playground" asChild>
                {!isPlaygroundRoute && (
                    <Appbar.Action
                        icon={() => <AntDesign name="setting" size={24} color={colors.grey} />}
                    />
                )}
            </Link>
        </Appbar.Header>
    );
};

export default TopAppBar;
