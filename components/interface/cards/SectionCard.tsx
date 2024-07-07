import React, { useEffect } from 'react';
import { View, Pressable, FlatList, useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Text } from '../../nativewindui/Text';
import { Icon } from '@roninoss/icons';
import { Section } from '~/app/home';
import { StyleSheet } from 'nativewind';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '~/app/_layout';
import SectionItemCard from './SectionItemCard';
import { SectionItem } from '~/data/types';

import articlesMetaData from '~/assets/content/articles.json';
import captionsCategories from '~/assets/content/categories-all.json';
import hashtagsTopics from '~/assets/content/hashtags.json';

interface SectionCardProps {
  section: Section;
}

function keyExtractor(item: SectionItem) {
  return String(item.id);
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();
  // console.log(`Items for section ${section.id}: `, section.items);

  const [data, setData] = React.useState<SectionItem[]>(section.items);

  useEffect(() => {
    if (section.id === 'discovery') {
      setData(articlesMetaData.slice(0, 4));
    } else if (section.id === 'captions') {
      const filtered = captionsCategories.filter(
        (category) =>
          category.label.toLowerCase() === 'for you' ||
          category.label.toLowerCase() === 'top choice'
      );
      setData(filtered);
    } else if (section.id === 'hashtags') {
      const topFourTopics = hashtagsTopics.slice(0, 4);
      setData(topFourTopics);
    }
  }, [section.id]);

  return (
    <View style={styles.sectionCard} className="border-t-0 border-border bg-card">
      <View style={{ paddingLeft: 16 }} className="flex-row items-center justify-between">
        <View className="flex-col">
          <Text variant="heading" style={fontStyles.dmSansMedium}>
            {section.title}
          </Text>
          <Text
            variant="footnote"
            className="tracking-tight"
            style={[fontStyles.dmSansRegular, { color: colors.grey2 }]}>
            {section.subtitle}
          </Text>
        </View>

        <Link href={section.href} asChild>
          <Pressable
            className="p-3 min-h-12 min-w-12 items-center justify-center"
            android_ripple={{
              color: colors.grey6,
              radius: 15
            }}
            accessibilityLabel={`Go to ${section.title}`}
            accessibilityRole="button">
            <Icon name="chevron-right" size={25} color={colors.grey} />
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <SectionItemCard item={item} section={section.id} />}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 4,
          paddingLeft: 16,
          paddingRight: 4,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    paddingVertical: 8,
    // paddingLeft: 16,
    paddingRight: 0,
  },
});

export default SectionCard;
