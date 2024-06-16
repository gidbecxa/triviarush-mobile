import React from "react";
import { View, Pressable, FlatList, useWindowDimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text } from "../../nativewindui/Text";
import { Icon } from "@roninoss/icons";
import { SectionItem } from "~/app";
import { StyleSheet } from "nativewind";
import { useColorScheme } from "~/lib/useColorScheme";
import { Fontisto } from "@expo/vector-icons";
import { fontStyles } from "~/app/_layout";
import TrendingItemCard from "./TrendingItemCard";
import CategoryItemCard from "./CategoryItemCard";
// import CategoryItemCard from "./CategoryItemCard3";
import TemplatesItemCard from "./TemplateItemCard";

const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

interface SectionItemCardProps {
    item: SectionItem;
    section: string;
}

const SectionItemCard: React.FC<SectionItemCardProps> = ({ item, section }) => {
    const router = useRouter();
    const { colors } = useColorScheme();
    const { width, height } = useWindowDimensions();

    const handleItemPress = () => {
        router.push({ pathname: item.href, params: { category: item.id } })
    };

    return (
        <>
            {section === 'discovery' ? (
                <TrendingItemCard item={item} onPress={handleItemPress} />
            ) : section === 'templates' ? (
                <TemplatesItemCard item={item} onPress={handleItemPress} />
            ) : (
                <CategoryItemCard item={item} onPress={handleItemPress} />
            )}
        </>
    );
};

export default SectionItemCard;