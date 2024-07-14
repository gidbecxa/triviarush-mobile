import * as React from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, cssInterop } from 'nativewind';

import TopAppBar from '~/components/interface/AppBar';
import { SectionItem } from '~/data/types';
import { Button, Modal, Portal } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from './_layout';

cssInterop(FlashList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <TopAppBar />
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        data={SECTIONS}
        estimatedItemSize={132}
        contentContainerClassName="py-0 android:pb-12"
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          return (
            <View className="flex-row justify-between items-center px-4 py-2">
              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.title}</Text>
                <Text className="text-sm text-gray-500">{item.subtitle}</Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => {
                  Alert.alert('Pressed...');
                }}
              >
                View All
              </Button>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={<TopAppBar />}
        /**ItemSeparatorComponent={renderItemSeparator*/
      />
    </View>
  );
}

function renderItemSeparator() {
  return <View className="p-1" />;
}

function keyExtractor(item: Section) {
  return item.id;
}

export interface Section {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  href: string;
  items?: SectionItem[];
}

const SECTIONS: Section[] = [
  {
    id: 'captions',
    slug: 'captions-categories',
    title: 'Captions',
    subtitle: 'Browse tons of catchy captions curated for you', // Catchy captions to make your photos and videos viral
    href: '/captions',
    items: [
      {
        id: 1,
        categoryId: 'good-vibes',
        title: 'Good Vibes',
        href: '/captions/[category]', // OR /captions/good-vibes
        tags: ['fun', 'happy', 'cheerful', 'vibes', 'entertainment'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: 'Trending',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
      {
        id: 2,
        categoryId: 'bffs',
        title: 'BFFs',
        href: '/captions/[category]', // OR /captions/bffs
        tags: ['friends', 'friendship', 'mate', 'bestie', 'squad'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: 'Most Used',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
      {
        id: 3,
        categoryId: 'money',
        title: 'Money',
        href: '/captions/[category]', // OR /captions/money
        tags: ['finance', 'rich', 'spending'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: 'New for you',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
    ],
  },
  {
    id: 'hashtags',
    slug: 'hashtags-categories',
    title: 'Hashtags',
    subtitle: 'Popular hashtags curated to boost your posts',
    href: '/hashtags',
    items: [
      {
        id: 1,
        categoryId: 'techie',
        title: 'Techie',
        href: '/hashtags/[category]', // OR /hashtags/techie
        tags: ['Tech', 'TechTrends', 'Coding', 'TechLife', 'Innovation'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: '24K Posts',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
      {
        id: 2,
        categoryId: 'family',
        title: 'Family',
        href: '/hashtags/[category]', // OR /hashtags/family
        tags: ['FamilyLife', 'FamilyTime', 'FamilyLove', 'FamilyGoals'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: 'Popular',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
      {
        id: 3,
        categoryId: 'shopping',
        title: 'Shopping',
        href: '/hashtags/[category]', // OR /hashtags/shopping
        tags: ['Shopaholic', 'ShopNow', 'BuyNow', 'ShopOnline'],
        illustration:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
        label: 'New for you',
        image:
          'https://tykfitdqyvyygrnkykou.supabase.co/storage/v1/object/sign/sociagram-icons/rectangle-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpYWdyYW0taWNvbnMvcmVjdGFuZ2xlLXN2Z3JlcG8tY29tLnBuZyIsImlhdCI6MTcxODY4Mjk1NiwiZXhwIjoxNzUwMjE4OTU2fQ.44FfYU1yr-xEBCGYI8ZHuPcN-8IF-Z8LbBXHji4TE9M&t=2024-06-18T03%3A55%3A56.947Z',
      },
    ],
  },
  {
    id: 'discovery',
    title: 'Discovery',
    subtitle: "Explore what's trending and join the buzz", // Jump on the latest content trending on social media
    href: '/discovery',
    items: [
      {
        id: 1,
        resourceId: 'cottage-cheese-trend',
        title: 'Cottage cheese Trend',
        href: '/discovery/[article]', // OR /discovery/discovery-one
        description: 'Cottage cheese is taking the internet by storm, especially on TikTok!',
        image: 'https://cdn.pixabay.com/photo/2022/04/18/09/57/cottage-cheese-7140007_1280.jpg',
        tags: ['TikTok', 'Food', 'Trend'],
      },
      {
        id: 2,
        resourceId: 'sabrina-please-please-please',
        title: 'Please, Please, Please',
        href: '/discovery/[article]',
        description:
          'This trend is all about expressing creativity through dance, lip syncs, and fan edits.',
        image: 'https://i.scdn.co/image/ab67616d0000b273de84adf0e48248ea2d769c3e',
        tags: ['Instagram', 'Music', 'TikTok'],
      },
      {
        id: 3,
        title: 'Red Trend on TikTok 2024',
        resourceId: 'tiktok-red-trend',
        href: '/discovery/[article]', // OR /discovery/discovery-two
        description: 'Embrace the Red Revolution!',
        image:
          'https://images.pexels.com/photos/1267369/pexels-photo-1267369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        tags: ['TikTok', 'Fashion', 'Interior Design'],
      },
    ],
  },
  {
    id: 'templates',
    slug: 'templates-themes',
    title: 'Viral Content Kits', // Content Templates
    subtitle: 'Templates to create content that spreads like wildfire',
    href: '/templates',
    items: [
      {
        id: 1,
        categoryId: 'meme-pack',
        title: 'Meme Lord Pack',
        href: '/templates/[theme]', // OR /templates/meme-pack
        description: 'Become a meme lord. Make your friends laugh out loud and share like crazy.',
        label: 'Popular',
        image: 'https://cdn.pixabay.com/photo/2016/01/12/08/00/doge-meme-1134954_1280.jpg',
      },
      {
        id: 2,
        categoryId: 'tiktok-kit',
        title: 'TikTok Takeover Kit',
        href: '/templates/[theme]', // OR /templates/tiktok-kit
        description: 'Trendy videos, viral audio clips, and attention-grabbing effects', // Conquer the TikTok game with our trendy dance challenges, viral audio clips, and attention-grabbing effects that will have you racking up views and followers in no time
        label: '119K Posts',
        image: 'https://cdn.pixabay.com/photo/2020/06/04/17/26/iphone-5259712_1280.jpg',
      },
      {
        id: 3,
        categoryId: 'ig-essentials',
        title: 'Insta-Famous Essentials',
        href: '/templates/[theme]', // OR /templates/ig-essentials
        description: 'Eye-catching filters, stunning presets, and engaging caption prompts', // Elevate your Instagram game with our collection of eye-catching filters, stunning presets, and engaging caption prompts that will make your feed pop and attract a loyal following.
        label: 'Trending',
        image: 'https://cdn.pixabay.com/photo/2017/03/22/22/26/instagram-2166645_1280.jpg', // https://cdn.pixabay.com/photo/2017/03/22/22/26/instagram-2166645_1280.jpg
      },
    ],
  },
];
