import React from "react";
import { View, Pressable, FlatList, useWindowDimensions } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text } from "../../nativewindui/Text";
import { Icon } from "@roninoss/icons";
import { SectionItem } from "~/data/types";
import { StyleSheet } from "nativewind";
import { useColorScheme } from "~/lib/useColorScheme";
import { Fontisto } from "@expo/vector-icons";
import { fontStyles } from "~/app/_layout";
import { Card } from "react-native-paper";
import ImageIllustration from "../ImageIllustration";

const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

interface CategoryItemCardProps {
    item: SectionItem;
    onPress: () => void;
}

const CategoryItemCard: React.FC<CategoryItemCardProps> = ({ item, onPress }) => {
    const { colors } = useColorScheme();
    const { width, height } = useWindowDimensions();

    return (
        <Card
            elevation={1}
            style={{ backgroundColor: colors.card, width: width * 0.7, borderWidth: 1.25, borderColor: colors.grey3, borderRadius: 15, marginRight: 12 }}
            contentStyle={styles.itemCard}
            // className="mr-3"
            onPress={onPress}
            accessibilityHint="Tap to view category details"
        >
            <View className="flex-col border-0 border-border" style={styles.content}>
                <Text variant="caption1" style={[fontStyles.dmSansMedium, {color:colors.tertiary}]} accessibilityLabel={`Category: ${item.label}`}>
                    <Fontisto name="hashtag" size={10} color={colors.tertiary} />
                    {" "}{item.label}
                </Text>
                <Text variant="body" style={[fontStyles.dmSansSemiBold, styles.itemTitle]} className="leading-loose">{item.title}</Text>
                <Text variant="caption1" style={fontStyles.dmSansRegular} className="border-0 border-border">
                    {item.tags?.map((desc) => capitalizeWords(desc)).join(', ')}
                </Text>
            </View>

            <View style={[styles.illustrationContainer, { backgroundColor: "#FFF" }]} className="border-0 border-border">
                {<ImageIllustration source={{uri: item?.image}} width={48} height={48} />}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    itemCard: {
        paddingHorizontal: 8,
        paddingVertical: 16,
        /* shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, */
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        width: "70%",
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
        /* position: "relative",
        left: -5 */

    }
});

export default CategoryItemCard;