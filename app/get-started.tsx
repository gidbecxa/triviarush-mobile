import { Icon } from "@roninoss/icons";
import {
    Image,
    Pressable,
    useWindowDimensions,
    View,
    StyleSheet,
    ImageBackground
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";
import * as NavigationBar from 'expo-navigation-bar';
import { useLayoutEffect, useState } from "react";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "~/components/nativewindui/ActivityIndicator";
// import GoogleIcon from "~/components/interface/GoogleIcon";

export default function GetStarted() {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const vh = height - headerHeight - insets.bottom - insets.top;
    const { colors } = useColorScheme();

    const [loading, setLoading] = useState(false);

    const load = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    useLayoutEffect(() => {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setPositionAsync('relative');
        NavigationBar.setBehaviorAsync('overlay-swipe');
    }, [])

    return (
        <ImageBackground
            className="flex-1"
            style={{ width }}
            source={require('~/assets/pexels-blue-bird-selfie.jpg')}
            imageStyle={{ resizeMode: "cover", }}
            alt="Photo by Blue Bird" //: https://www.pexels.com/photo/happy-ethnic-woman-taking-selfie-on-smartphone-in-town-7243117/
        >
            <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flexDirection: "column", justifyContent: "space-between" }} className="flex-1 pb-3">
                <View style={{ height: height * 0.45, flexDirection: "row", alignItems: "flex-end" }} className="justify-center">
                    <Text style={[styles.borel, { color: colors.background }]} variant={"largeTitle"} className="text-center tracking-tighter">Soociagram</Text>
                </View>

                {loading && (
                    <ActivityIndicator size={64} />
                )}

                <View style={[styles.buttonsContainer, { height: height * 0.4 }]} className="gap-3">
                    <Text variant={"subhead"} style={{ color: colors.background }} className="font-medium text-center">Sign In</Text>
                    <TouchableOpacity style={[styles.button, { elevation: 3, }]} className="bg-background flex-row gap-1" onPress={load}>
                        <View style={{ width: 20, height: 20 }} className="flex items-center justify-center">
                            <Image source={require('~/assets/google_g_icon.png')} className="w-full h-full" resizeMode="center" />
                        </View>
                        <Text variant="subhead" className="text-black">{" "}Sign In With Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { elevation: 3, }]} className="bg-foreground flex-row gap-1" onPress={load}>
                        <Icon name="apple" size={20} color="#FFF" />
                        <Text variant="subhead" style={{ color: colors.background }}>{" "}Sign In With Apple</Text>
                    </TouchableOpacity>
                    <Link href="/home" style={styles.button} asChild>
                        <TouchableOpacity style={{ backgroundColor: colors.cardalpha2, paddingVertical: 10, }} className="flex-row border-2 border-border">
                            <Text variant="subhead" className="text-background font-semibold">Get Started Without Sign In</Text>
                        </TouchableOpacity>
                    </Link>

                    <Text variant="footnote" style={{ color: colors.background }} className="text-center px-6 py-3">By signing up you agree to our Terms and conditions and Privacy Policy</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: "column",
        justifyContent: "space-between"
    },
    buttonsContainer: {
        /* borderColor: "#FFF",
        borderWidth: 1, */
        paddingHorizontal: 24,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
    },
    borel: {
        fontFamily: "Borel",
        lineHeight: 72,
    }
});

/** alt="Photo by Armin Rimoldi" //: https://www.pexels.com/photo/positive-woman-sitting-in-garden-armchair-and-using-smartphone-5269502/ */
