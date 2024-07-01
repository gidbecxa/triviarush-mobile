import React from 'react';
import { View, Pressable } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import Hamburger from '~/components/illustrations/Hamburger';
import { Link, useGlobalSearchParams, useLocalSearchParams, usePathname, } from 'expo-router';

const TopAppBar = () => {
    const pathname = usePathname();
    const { colors } = useColorScheme();

    console.log('Route and params', pathname);
    const isIndexRoute = pathname === '/';

    return (
        <Appbar.Header style={{ backgroundColor: colors.card }} className='border-0 border-border'>
            <Link href={isIndexRoute ? "/components-menu" : "/"} asChild>
                <Appbar.Action
                    icon={() => 
                        isIndexRoute ? (
                            <Hamburger width={24} height={24} stroke={colors.grey} />
                        ) : (
                            <FontAwesome5 name="long-arrow-alt-left" size={24} color={colors.grey} />
                        )
                    }
                />
            </Link>

            <Appbar.Content title="" />

            <Link href="/modal" asChild>
                <Appbar.Action
                    icon={() => <AntDesign name="setting" size={24} color={colors.grey} />}
                />
            </Link>
        </Appbar.Header>
    );
};

export default TopAppBar;
