import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuthContext } from '~/store/ctx';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../_layout';

export default function Screen() {
  const { setColorScheme } = useColorScheme();

  React.useEffect(() => {
    setColorScheme('dark');
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
        <TouchableOpacity onPress={() => {router.push('/get-started'); console.log('Pressed!')}} className="px-12 py-3" style={{ borderColor: '#FFF', borderWidth: 1 }}>
          <Text variant="body" style={fontStyles.promptMedium}>
            Start
          </Text>
        </TouchableOpacity>
    </View>
  );
}
