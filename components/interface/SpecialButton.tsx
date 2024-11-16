import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

const SpecialButton = ({ onPress }) => {
  const { colors } = useColorScheme();
  const [scale] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: colors.primary,
          padding: 15,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        }}>
        <Ionicons name="sparkles-outline" size={24} color={colors.tertiary} />
        <Text variant="callout" style={{ color: colors.card, marginTop: 5 }}>
          Open Settings
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SpecialButton;
