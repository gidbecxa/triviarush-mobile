import React from 'react';
import { View, ImageBackground, Pressable, Image, useWindowDimensions } from 'react-native';
import { SectionItem } from '~/data/types';
import { Text } from '../../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { Fontisto } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'nativewind';

interface TemplatesItemCardProps {
  item: SectionItem;
  onPress: () => void;
}

const TemplatesItemCard: React.FC<TemplatesItemCardProps> = ({ item, onPress }) => {
  const { colors, isDarkColorScheme } = useColorScheme();
  const { width, height } = useWindowDimensions();

  const truncatedDescription = item.description[0].length > 28 ? `${item.description[0].slice(0, 28)}...` : item.description[0];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, width: width * 0.55, shadowColor: colors.grey3 }]}
      className='p-1.5 rounded-xl'
      accessibilityHint="Tap to view category details"
    >
      <Image source={{ uri: item.image }} style={styles.image} className='rounded-lg' />
      <Text variant="caption1" style={[fontStyles.dmSansMedium, styles.label, { color: colors.foreground, backgroundColor: colors.cardalpha1 }]} className='py-1 px-2 rounded-full'>
        <Fontisto name="hashtag" size={10} color={colors.tertiary} />
        {" "}{item.label}
      </Text>
      <View className='mt-1'>
        <Text variant="subhead" style={[fontStyles.dmSansSemiBold, styles.title, { color: colors.foreground }]} className="leading-loose">{item.title}</Text>
        <Text numberOfLines={1} variant="caption1" style={[fontStyles.dmSansRegular, { color: colors.foreground }]}>{item.description}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  label: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  title: {
    lineHeight: 30,
  },
});

export default TemplatesItemCard;
