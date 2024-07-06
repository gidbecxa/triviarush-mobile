// components/CaptionCard.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Caption } from '~/data/types';
import { Card } from 'react-native-paper';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import * as Clipboard from 'expo-clipboard';

import { COLORS } from '~/theme/colors';
import categories from "~/assets/content/categories-all.json"
import { fontStyles } from '~/app/_layout';
import { router } from 'expo-router';

const CaptionCard = ({ caption, showSnackbar }) => {
    const { width, height } = useWindowDimensions();
    const { colors, colorScheme } = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';

    const tagColors = COLORS.tagColors;
    /* console.log('tag colors', tagColors); */

    const getTags = (subCategoryId: number) => {
        for (const category of categories) {
            const subCategory = category.subCategories.find((sub) => sub.id === subCategoryId);
            if (subCategory) {
                return subCategory.tags;
            }
        }
        return ['social'];
    };

    const getTagColor = (tag, theme) => {
        if (tagColors[tag]) {
            return tagColors[tag][theme];
        }
        return null;
    }

    const tags = getTags(caption.subCategoryId);
    const labels = tags ? tags : [];

    const capitalize = (str: string) => {
        return str.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    const handleCopy = async (caption: string) => {
        await Clipboard.setStringAsync(caption);
        showSnackbar('Caption copied to clipboard!');
    };

    return (
        <View className='px-4 mb-3'>
            <Card
                elevation={0}
                contentStyle={styles.card}
                style={{ minHeight: height * 0.155, backgroundColor: colors.card, borderColor: colors.grey3, borderWidth: 1.25, borderRadius: 15, }}
            >
                <View style={styles.labelContainer} className='flex-row'>
                    {labels.map((label, index) => (
                        <View key={index} className='px-2 py-1 rounded-full mr-2' style={{ backgroundColor: getTagColor(label, theme) || colors.primary, }}>
                            <Text variant="caption1" style={fontStyles.dmSansMedium} className='text-text'>{capitalize(label)}</Text>
                        </View>
                    ))}
                </View>
                <Text variant="subhead" className='leading-snug border-0 border-border relative top-0'>{caption.value}</Text>
                <View style={[styles.icons, { backgroundColor: colors.card }]} className='rounded-full border-0 border-border'>
                    <TouchableOpacity onPress={() => router.push("/playground")} style={styles.icon}>
                        <Ionicons name="bookmark-outline" size={20} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => handleCopy(caption.value)}>
                        <Ionicons name="copy-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: "100%",
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        position: "relative",
        bottom: 4,
        // right: 12
    },
    icon: {
        // marginLeft: 12,
    },
    labelContainer: {
        position: "relative",
        top: 6,
        // left: 12
    }
});

export default CaptionCard;
