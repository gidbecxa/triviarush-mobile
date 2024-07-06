import React from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { Feather } from '@expo/vector-icons';

import TopAppBar from '~/components/interface/AppBar';
import { fontStyles } from './_layout';

const Playground = () => {
    const route = useRouter();
    const { width, height } = useWindowDimensions();
    const { colors } = useColorScheme();

    return (
        <View className='flex-1'>
            <TopAppBar />
            <View className='flex-1 px-4 items-center justify-center'>
                <View className='p-6 rounded-2xl items-center justify-center relative -top-4' style={[styles.messageContainer, { backgroundColor: colors.card }]}>
                    <Feather name="clock" size={64} color={colors.primary} />
                    <Text variant="heading" style={[styles.heading, { color: colors.foreground }]}>
                        Coming Soon!
                    </Text>
                    <Text style={[styles.message, { color: colors.foreground }]}>
                        We're working hard to bring you new features. Stay tuned for our next release!
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    messageContainer: {
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    heading: {
        fontSize: 24,
        marginTop: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
    },
});

export default Playground;
