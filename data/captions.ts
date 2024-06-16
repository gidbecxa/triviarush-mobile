import { ImageSourcePropType } from "react-native";

export interface Caption {
    key: string;
    value: string;
}

export interface CaptionCategory {
    id: string;
    title: string;
    href: string;
    description: string[];
    illustration: ImageSourcePropType;
    captions: Caption[];
}

export const captionsData: CaptionCategory[] = [
    {
        id: 'good-vibes',
        title: 'Good Vibes',
        href: '/captions/[category]', // '/captions/good-vibes',
        description: ['fun', 'happy', 'cheerful', 'vibes', 'entertainment'],
        illustration: require('~/assets/illustrations/good-vibes.png'),
        captions: [
            { key: 'goodVibes1', value: 'Spreading positive vibes, one smile at a time!' },
            { key: 'goodVibes2', value: 'Life is too short to be anything but happy!' },
            { key: 'goodVibes3', value: 'Happiness is a choice, choose wisely!' },
            { key: 'goodVibes4', value: 'Vibing high on life and good times!' },
            { key: 'goodVibes5', value: 'Positive vibes only, negativity has no place here!' },
        ],
    },
    {
        id: 'bffs',
        title: 'BFFs',
        href: '/captions/[category]', // '/captions/bffs',
        description: ['friends', 'friendship', 'mate', 'bestie', 'squad'],
        illustration: require('~/assets/illustrations/balloons.png'),
        captions: [
            { key: 'bffs1', value: 'Friends that slay together, stay together!' },
            { key: 'bffs2', value: 'My squad, my ride or dies!' },
            { key: 'bffs3', value: 'Besties for life, no matter what!' },
            { key: 'bffs4', value: 'Friends are the family we choose!' },
            { key: 'bffs5', value: 'Friendship is the purest form of love!' },
        ],
    },
    {
        id: 'money',
        title: 'Money',
        href: '/captions/[category]', // '/captions/money',
        description: ['finance', 'rich', 'spending'],
        illustration: require('~/assets/illustrations/money-bag.png'),
        captions: [
            { key: 'money1', value: 'Money talks, but wealth whispers!' },
            { key: 'money2', value: 'Invest in your future, not your lifestyle!' },
            { key: 'money3', value: 'Money can\'t buy happiness, but it can buy a jet ski!' },
            { key: 'money4', value: 'Wealth is the ability to fully experience life!' },
            { key: 'money5', value: 'Money is a tool, use it wisely!' },
        ],
    },
];
