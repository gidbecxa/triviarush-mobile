import React from "react";
import { View, Pressable, FlatList, useWindowDimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text } from "../../nativewindui/Text";
import { Icon } from "@roninoss/icons";
import { Section, SectionItem } from "~/app";
import { StyleSheet } from "nativewind";
import { useColorScheme } from "~/lib/useColorScheme";
import { fontStyles } from "~/app/_layout";
import SectionItemCard from "./SectionItemCard";

interface SectionCardProps {
    section: Section;
}

function keyExtractor(item: SectionItem) {
    return item.id;
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
    const router = useRouter();
    const { colors } = useColorScheme();
    const { width, height } = useWindowDimensions();

    return (
        <View style={styles.sectionCard} className="bg-card border-t-0 border-border">
            <View style={{ paddingLeft: 16 }} className="flex-row justify-between items-center">
                <View className="flex-col">
                    <Text variant="heading" style={fontStyles.dmSansMedium}>
                        {section.title}
                    </Text>
                    <Text variant="footnote" className="tracking-tight" style={[fontStyles.dmSansRegular, { color: colors.grey2 }]}>
                        {section.subtitle}
                    </Text>
                </View>

                {/* <Link href={`/${section.id}`}> */}
                <Link 
                href={section.href} 
                asChild>
                    <Pressable className="p-1">
                        <Icon name="chevron-right" size={25} color={colors.grey} />
                    </Pressable>
                </Link>
            </View>

            <FlatList
                data={section.items}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <SectionItemCard item={item} section={section.id} />}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 4, paddingLeft: 16, paddingRight: 4 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionCard: {
        paddingVertical: 8,
        // paddingLeft: 16,
        paddingRight: 0
    },
})

export default SectionCard;
