import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

const renderSheetIcon = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { colors } = useColorScheme();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600, // Duration of the animation in milliseconds
      easing: Easing.out(Easing.exp), // Easing function for the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Start from below and move up to the desired position
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade in effect
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: '-10%',
        left: 0,
        zIndex: 99,
        width: '100%',
        alignItems: 'center',
        transform: [{ translateY }],
        opacity,
      }}>
      <AntDesign name="star" size={96} color={colors.tertiary} />
    </Animated.View>
  );
};
