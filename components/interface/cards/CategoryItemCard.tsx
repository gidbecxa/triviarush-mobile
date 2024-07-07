import React from 'react';
import { View, Pressable, FlatList, useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Text } from '../../nativewindui/Text';
import { Icon } from '@roninoss/icons';
import { SectionItem } from '~/data/types';
import { StyleSheet } from 'nativewind';
import { useColorScheme } from '~/lib/useColorScheme';
import { Fontisto } from '@expo/vector-icons';
import { fontStyles } from '~/app/_layout';
import { Card } from 'react-native-paper';
import ImageIllustration from '../ImageIllustration';

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

interface CategoryItemCardProps {
  item: SectionItem;
  onPress: () => void;
  accessibilityLabel: string;
}

const CategoryItemCard: React.FC<CategoryItemCardProps> = ({
  item,
  onPress,
  accessibilityLabel,
}) => {
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();

  return (
    <Card
      elevation={1}
      style={{
        backgroundColor: colors.card,
        width: width * 0.7,
        height: height * 0.16,
        borderWidth: 1.25,
        borderColor: colors.grey3,
        borderRadius: 15,
        marginRight: 12,
      }}
      contentStyle={styles.itemCard}
      onPress={onPress}
      accessibilityHint={`Tap to view ${accessibilityLabel}`}
      accessibilityLabel={`Browse ${item.title} ${accessibilityLabel}`}
      accessibilityRole="button">
      <View className="h-full border-0 border-border" style={styles.content}>
        <Text
          variant="caption1"
          style={[
            fontStyles.dmSansMedium,
            { color: colors.tertiary, position: 'absolute', top: 0 },
          ]}
          accessibilityLabel={`Category: ${item.label}`}>
          <Fontisto name="hashtag" size={10} color={colors.tertiary} /> {item.label}
        </Text>
        <Text
          variant="subhead"
          style={[fontStyles.dmSansSemiBold, styles.itemTitle, { color: colors.foreground }]}
          className="leading-tight">
          {item.title}
        </Text>
        <Text
          variant="caption1"
          style={[fontStyles.dmSansRegular, { marginTop: 4, color: colors.foreground }]}
          className="border-0 border-border leading-tight">
          {item.description}
        </Text>
      </View>

      <View
        style={[styles.illustrationContainer, { backgroundColor: '#FFF' }]}
        className="border-0 border-border">
        {<ImageIllustration source={{ uri: item?.illustration }} width={48} height={48} />}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    height: '100%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    /* borderColor: "#CCC",
        borderWidth: 1, */
  },
  itemTitle: {
    lineHeight: 30,
  },
  illustrationContainer: {
    // borderWidth: 1,
    // borderColor: "#333",
    borderRadius: 100,
    padding: 4,
  },
});

export default CategoryItemCard;
