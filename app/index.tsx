import * as React from 'react';
import { Icon } from '@roninoss/icons';
import { View, Pressable, useWindowDimensions, ImageSourcePropType } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Link, router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { cssInterop } from 'nativewind';
import SectionCard from '~/components/interface/cards/SectionCard';

import BffIllustration from '~/components/illustrations/Bff';
import MoneyIllustration from '~/components/illustrations/Money';
import VibesIllustration from '~/components/illustrations/Vibes';
import TechieIllustration from '~/components/illustrations/Techie';
import FamilyIllustration from '~/components/illustrations/Family';
import ShoppingIllustration from '~/components/illustrations/Shopping';
import TopAppBar from '~/components/interface/AppBar';

cssInterop(FlashList, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
});

export default function Screen() {
    return (
        <View className="flex-1">
            <TopAppBar />
            <FlashList
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                data={SECTIONS}
                estimatedItemSize={132}
                contentContainerClassName='py-0 android:pb-12'
                keyExtractor={keyExtractor}
                renderItem={({ item }) => <SectionCard section={item} />}
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

export interface SectionItem {
    id: string;
    title: string;
    href: string;
    description: string[];
    illustration?: React.ReactNode;
    image?: ImageSourcePropType; // OR { uri: string }
    label: string;
}

export interface Section {
    id: string;
    title: string;
    subtitle: string;
    href: string;
    items: SectionItem[];
}

const SECTIONS: Section[] = [
    {
        id: 'captions',
        title: 'Captions',
        subtitle: 'Browse tons of catchy captions curated for you', // Catchy captions to make your photos and videos viral
        href: '/captions',
        items: [
            {
                id: 'good-vibes',
                title: 'Good Vibes',
                href: '/captions/[category]', // OR /captions/good-vibes
                description: ['fun', 'happy', 'cheerful', 'vibes', 'entertainment'],
                illustration: <VibesIllustration width={66} height={66} />,
                label: 'Trending'
            },
            {
                id: 'bffs',
                title: 'BFFs',
                href: '/captions/[category]', // OR /captions/bffs
                description: ['friends', 'friendship', 'mate', 'bestie', 'squad'],
                illustration: <BffIllustration width={66} height={66} />,
                label: 'Most Used'
            },
            {
                id: 'money',
                title: 'Money',
                href: '/captions/[category]', // OR /captions/money
                description: ['finance', 'rich', 'spending'],
                illustration: <MoneyIllustration width={66} height={66} />,
                label: 'New for you'
            }
        ]
    },
    {
        id: 'hashtags',
        title: 'Hashtags',
        subtitle: 'Popular hashtags curated to boost your posts',
        href: '/hashtags',
        items: [
            {
                id: 'techie',
                title: 'Techie',
                href: '/hashtags/[category]', // OR /hashtags/techie
                description: ['Tech', 'TechTrends', 'Coding', 'TechLife', 'Innovation'],
                illustration: <TechieIllustration width={66} height={66} />,
                label: '24K Posts'
            },
            {
                id: 'family',
                title: 'Family',
                href: '/hashtags/[category]', // OR /hashtags/family
                description: ['FamilyLife', 'FamilyTime', 'FamilyLove', 'FamilyGoals'],
                illustration: <FamilyIllustration width={66} height={66} />,
                label: 'Popular'
            },
            {
                id: 'shopping',
                title: 'Shopping',
                href: '/hashtags/[category]', // OR /hashtags/shopping
                description: ['Shopaholic', 'ShopNow', 'BuyNow', 'ShopOnline',],
                illustration: <ShoppingIllustration width={66} height={66} />,
                label: 'New for you'
            }
        ]
    },
    {
        id: 'discovery',
        title: 'Discovery',
        subtitle: 'Explore what\'s trending and join the buzz', // Jump on the latest content trending on social media
        href: '/discovery',
        items: [
            {
                id: 'discovery-one',
                title: 'A TikTok Challenge',
                href: '/discovery/[content]', // OR /discovery/discovery-one
                description: ['This content is now trending content on TikTok...'],
                // illustration: <TechieIllustration width={66} height={66} />,
                label: 'Trending on TikTok',
                image: { uri: "https://cdn.pixabay.com/photo/2020/07/10/08/39/tiktok-5390055_1280.jpg" }
            },
            {
                id: 'discovery-two',
                title: 'An Instagram Challenge',
                href: '/discovery/[content]', // OR /discovery/discovery-two
                description: ['This content is now trending content on Instagram...'],
                // illustration: <FamilyIllustration width={66} height={66} />,
                label: 'Trending on Instagram',
                image: { uri: 'https://img.freepik.com/free-photo/creative-reels-composition_23-2149711505.jpg?t=st=1718263563~exp=1718267163~hmac=653841155c318521c5e36b8eba200cb41781760c527371bfc92250777c03847b&w=1060' }
            },
            {
                id: 'discovery-three',
                title: 'Latest Snapchat Filter',
                href: '/discovery/[content]', // OR /discovery/trending-three
                description: ['This content is now trending content on Snapchat...',],
                // illustration: <ShoppingIllustration width={66} height={66} />,
                label: 'Trending on Snapchat',
                image: { uri: 'https://images.unsplash.com/photo-1616041041954-5d9d57fc31cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c25hcGNoYXR8ZW58MHx8MHx8fDA%3D' }
            }
        ]
    },
    {
        id: 'templates',
        title: 'Viral Content Kits', // Content Templates
        subtitle: 'Templates to create content that spreads like wildfire',
        href: '/templates',
        items: [
            {
                id: 'meme-pack',
                title: 'Meme Lord Pack',
                href: '/templates/[theme]', // OR /templates/meme-pack
                description: ['Become a meme lord. Make your friends laugh out loud and share like crazy.'],
                // illustration: <TechieIllustration width={66} height={66} />,
                label: 'Popular',
                image: { uri: "https://img.freepik.com/free-photo/cheerful-adult-man-has-trauma-head-broken-nose-bruises-eyes_273609-48042.jpg?t=st=1718262953~exp=1718266553~hmac=2c1cefc102c7388bcd5c1dda6c8970136c5a617919a19a523fedb66008e43745&w=1060" }
            },
            {
                id: 'tiktok-kit',
                title: 'TikTok Takeover Kit',
                href: '/templates/[theme]', // OR /templates/tiktok-kit
                description: ['Trendy challenges, viral audio clips, and attention-grabbing effects'], // Conquer the TikTok game with our trendy dance challenges, viral audio clips, and attention-grabbing effects that will have you racking up views and followers in no time
                // illustration: <FamilyIllustration width={66} height={66} />,
                label: '119K Posts',
                image: { uri: 'https://cdn.pixabay.com/photo/2020/06/04/17/26/iphone-5259712_1280.jpg' }
            },
            {
                id: 'ig-essentials',
                title: 'Insta-Famous Essentials',
                href: '/templates/[theme]', // OR /templates/ig-essentials
                description: ['Eye-catching filters, stunning presets, and engaging caption prompts',], // Elevate your Instagram game with our collection of eye-catching filters, stunning presets, and engaging caption prompts that will make your feed pop and attract a loyal following.
                // illustration: <ShoppingIllustration width={66} height={66} />,
                label: 'Trending',
                image: { uri: 'https://cdn.pixabay.com/photo/2021/01/10/10/54/woman-5904731_1280.jpg' } // https://cdn.pixabay.com/photo/2017/03/22/22/26/instagram-2166645_1280.jpg
            }
        ]
    }
]