import { Icon } from "@roninoss/icons";
import {
    Image,
    useWindowDimensions,
    View,
    StyleSheet,
    ImageBackground
} from "react-native";
import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";
import * as NavigationBar from 'expo-navigation-bar';
import { useLayoutEffect, useState } from "react";
import { Link, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "~/components/nativewindui/ActivityIndicator";
// import GoogleIcon from "~/components/interface/GoogleIcon";

import { useAppContext } from "~/store/AppContext";
import { Sheet, useSheetRef } from "~/components/nativewindui/Sheet";
import { fontStyles } from "./_layout";

export default function GetStarted() {
    const { setIsFirstLaunch } = useAppContext();

    const { width, height } = useWindowDimensions();
    const { colors } = useColorScheme();

    const [loading, setLoading] = useState(false);
    const bottomSheetModalRef = useSheetRef();
    const sheetPoints = [400];

    const handleOpenSheet = () => {
        bottomSheetModalRef.current?.present();
    }

    const handleSheetClose = () => {
        setIsFirstLaunch(false);
        setLoading(true);
        bottomSheetModalRef.current?.close();
        setTimeout(() => {
            setLoading(false);
            router.replace("/");
        }, 3000);
    };

    const handleGetStartedNoSignIn = () => {
        setIsFirstLaunch(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace("/");
        }, 3000);
    }

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
                    <Text style={[styles.borel, { color: colors.background }]} variant={"largeTitle"} className="text-center tracking-tighter">Sociagram</Text>
                </View>

                {loading && (
                    <ActivityIndicator size={64} />
                )}

                <View style={[styles.buttonsContainer, { height: height * 0.4 }]} className="gap-3">
                    <Text variant={"subhead"} style={{ color: colors.background }} className="font-medium text-center">Sign In</Text>
                    <TouchableOpacity style={[styles.button, { elevation: 3, }]} className="bg-background flex-row gap-1" onPress={handleOpenSheet}>
                        <View style={{ width: 20, height: 20 }} className="flex items-center justify-center">
                            <Image source={require('~/assets/google_g_icon.png')} className="w-full h-full" resizeMode="center" />
                        </View>
                        <Text variant="subhead" className="text-black">{" "}Sign In With Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { elevation: 3, }]} className="bg-foreground flex-row gap-1" onPress={handleOpenSheet}>
                        <Icon name="apple" size={20} color="#FFF" />
                        <Text variant="subhead" style={{ color: colors.background }}>{" "}Sign In With Apple</Text>
                    </TouchableOpacity>
                    {/* <Link href="#" style={styles.button} asChild> */}
                    <TouchableOpacity onPress={handleGetStartedNoSignIn} style={[styles.button, { backgroundColor: colors.cardalpha2, paddingVertical: 10, }]} className="flex-row border-2 border-border">
                        <Text variant="subhead" className="text-background font-semibold">Get Started Without Sign In</Text>
                    </TouchableOpacity>
                    {/* </Link> */}

                    <Text variant="footnote" style={{ color: colors.background }} className="text-center px-6 py-3">By signing in you agree to our Terms of Service and Privacy Policy</Text>
                </View>
            </View>

            <Sheet
                ref={bottomSheetModalRef}
                snapPoints={sheetPoints}
                handleIndicatorStyle={{ backgroundColor: colors.primary }}
            >
                <View className="flex-1 items-center justify-around px-8">
                    <Text variant="title3" className="text-center mb-2" style={fontStyles.dmSansMedium}>
                        We're currently working on the Sign-in feature.
                    </Text>
                    <Text variant="callout" className="text-center mb-4" style={fontStyles.dmSansRegular}>
                        In the meantime, you can explore and enjoy the app's features without signing in. The sign-in and other exciting features will be available in our next release.
                    </Text>
                    <TouchableOpacity onPress={handleSheetClose} className="p-3 rounded-lg w-full items-center" style={{ backgroundColor: colors.primary }}>
                        <Text variant="heading" style={[{ color: "#FFF" }, fontStyles.dmSansMedium]}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </Sheet>
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
