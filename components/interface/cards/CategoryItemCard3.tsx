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
import { LinearGradient } from "expo-linear-gradient";

const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

interface CategoryItemCardProps {
    item: SectionItem;
    onPress: () => void;
}

const CategoryItemCard: React.FC<CategoryItemCardProps> = ({ item, onPress }) => {
    const { colors, isDarkColorScheme } = useColorScheme();
    const { width, height } = useWindowDimensions();

    const gradientColors = [colors.secondary, colors.tertiary];
    const contentColor = colors.card;
    const hashtagColor = colors.foreground;

    return (
        <Pressable
            style={[styles.itemCard, { backgroundColor: "transparent", width: width * 0.7, }]}
            className="rounded-xl border border-border"
            onPress={onPress}
            accessibilityHint="Tap to view category details"
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0.55, y: 0.25 }}
                end={{ x: 0.25, y: 1 }}
                style={styles.gradientBackground}
            />
            <View className="flex-col" style={styles.content}>
                <Text
                    variant="caption1"
                    style={[fontStyles.dmSansMedium, { color: contentColor }]}
                    accessibilityLabel={`Category: ${item.label}`}
                >
                    <Fontisto name="hashtag" size={10} color={hashtagColor} />{" "}
                    {item.label}
                </Text>
                <Text
                    variant="body"
                    style={[
                        fontStyles.dmSansSemiBold,
                        styles.itemTitle,
                        { color: contentColor }
                    ]}
                    className="leading-loose">
                    {item.title}
                </Text>
                <Text
                    variant="caption1"
                    style={[fontStyles.dmSansRegular, { color: contentColor }]}
                >
                    {item.description.map((desc) => capitalizeWords(desc)).join(', ')}
                </Text>
            </View>

            <View style={[styles.illustrationContainer, { backgroundColor: "white" }]}>
                {item.illustration}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    itemCard: {
        marginRight: 12,
        paddingHorizontal: 8,
        paddingVertical: 16,
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        width: "70%",
        /* borderColor: "#CCC",
        borderWidth: 1, */
    },
    gradientBackground: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 12,
    },
    itemTitle: {
        lineHeight: 30,
    },
    illustrationContainer: {
        // borderWidth: 1,
        // borderColor: "#333",
        borderRadius: 100,
        padding: 4,
        position: "relative",
        left: -5

    }
});

export default CategoryItemCard;