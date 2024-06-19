import React from 'react';
import { View, ImageBackground, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { SectionItem } from '~/data/types';
import { Text } from '../../nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { Fontisto } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

interface TrendingCardProps {
  item: SectionItem;
  onPress: () => void;
}

const TrendingItemCard: React.FC<TrendingCardProps> = ({ item, onPress }) => {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();

  return (
    <Pressable onPress={onPress} style={[styles.container, { width: width * 0.75 }]}>
      <ImageBackground source={{ uri: item?.image }} style={styles.image} imageClassName='rounded-xl'>
        {/* <View style={styles.contentContainer}> */}
        <LinearGradient colors={['rgba(0, 0, 0, 0.6)', 'transparent']} style={styles.contentContainer} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
          <Text variant="caption1" style={[fontStyles.dmSansMedium, styles.label, { color: colors.foreground, backgroundColor: colors.cardalpha1 }]} className='py-1 px-2 rounded-full'>
            <Fontisto name="hashtag" size={10} color={colors.tertiary} />
            {" "}{item.label}
          </Text>
          <Text variant="body" style={[fontStyles.dmSansSemiBold, styles.title, { color: "white", verticalAlign: "top", height: 46 }]} className="leading-tight border-0 border-border" numberOfLines={2}>{item.title}</Text>
          <Text variant="caption1" style={[fontStyles.dmSansRegular, { color: "white" }]} numberOfLines={1}>{item.description}</Text>
        </LinearGradient>
        {/* </View> */}
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginRight: 10,
    borderRadius: 20,
    elevation: 2
  },
  image: {
    width: '100%',
    height: 160,
  },
  contentContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: 10
  },
  title: {
    lineHeight: 30,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    position: "absolute",
    top: 12,
    left: 6,
  },
});

export default TrendingItemCard;
