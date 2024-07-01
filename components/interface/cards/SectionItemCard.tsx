import React from "react";
import { Link, useRouter } from "expo-router";
import { SectionItem } from "~/data/types";
import TrendingItemCard from "./TrendingItemCard";
import CategoryItemCard from "./CategoryItemCard";
// import CategoryItemCard from "./CategoryItemCard3";
import TemplatesItemCard from "./TemplateItemCard";

interface SectionItemCardProps {
    item: SectionItem;
    section: string;
}

const SectionItemCard: React.FC<SectionItemCardProps> = ({ item, section }) => {
    const router = useRouter();
    // console.log(`Items for section ${section}: `, item);

    const handleItemPress = () => {
        if (section === 'captions') {
            router.push({ pathname: item.href, params: { category: item.id } })
        } else if (section === 'hashtags') {
            router.push({ pathname: item.href, params: { topic: item.id } })
        }
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