import React, { useEffect, useState } from "react";
import { Animated, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { StyleSheet } from "nativewind";
import { Text } from "../nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface FABProps {
    scrollY: Animated.Value;
}

const DiscoverFAB: React.FC<FABProps> = ({ scrollY }) => {
    const { colors } = useColorScheme();
    const { width } = useWindowDimensions();

    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
            setShowText(value < 50);
        });
        return () => {
            scrollY.removeListener(listenerId);
        }
    }, [scrollY]);

    const animatedWidth = scrollY.interpolate({
        inputRange: [0, 25],
        outputRange: [width * 0.4, 56],
        extrapolate: "clamp"
    });

    const animatedPadding = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [12, 14],
        extrapolate: "clamp"
    })

    const textOpacity = scrollY.interpolate({
        inputRange: [0, 25],
        outputRange: [1, 0],
        extrapolate: "clamp"
    });

    const scale = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0.8],
        extrapolate: "clamp"
    });

    const fabStyles = {
        backgroundColor: colors.primary,
        width: animatedWidth,
        paddingVertical: animatedPadding,
        maxHeight: 56,
    };

    const navigateTo = (screen: string) => {
        router.push(`/${screen}`)
    }

    return (
        <Animated.View style={[styles.container, fabStyles]} className='rounded-xl flex-row items-center justify-center'>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ justifyContent: showText ? 'flex-start' : 'center' }}
                className="px-4 items-center flex-row gap-1"
                onPress={() => navigateTo("playground")}
            >
                <Ionicons name="play" size={24} color={"#FFF"} />
                {showText && <Animated.Text className="text-white" style={{ opacity: textOpacity }}>See Videos</Animated.Text>}
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 64,
        right: 20,
        shadowColor: "#3498db",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    icon: {
        color: "#fff",
        fontSize: 20,
    },
});

export default DiscoverFAB;