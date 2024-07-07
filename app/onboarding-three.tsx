import { Icon } from '@roninoss/icons';
import {
  Image,
  Pressable,
  useWindowDimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import * as NavigationBar from 'expo-navigation-bar';
import { useLayoutEffect } from 'react';
import { Link, router } from 'expo-router';

export default function OnboardingThree() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const vh = height - headerHeight - insets.bottom - insets.top;
  const { colors } = useColorScheme();

  useLayoutEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setPositionAsync('relative');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  function Card({
    children,
    title,
    caption,
  }: {
    children: React.ReactNode;
    title: string;
    caption: string;
  }) {
    return (
      <View style={[styles.cardContainer, { height: vh / 2, width }]} className="px-0">
        <View
          style={[styles.card, { paddingBottom: insets.bottom }]}
          className="h-full flex-col items-center justify-center rounded-3xl bg-background px-4 pt-8 shadow-sm shadow-black/10 dark:shadow-none">
          <Text
            style={styles.cardTitle}
            className="tracking-loose text-center text-3xl font-semibold leading-relaxed">
            {title}
          </Text>
          <Text
            style={styles.cardCaption}
            variant="body"
            className="my-1 text-center font-semibold tracking-normal opacity-60">
            {caption}
          </Text>
          {children}
        </View>
      </View>
    );
  }

  const content = {
    title: 'Create Winning Content',
    caption:
      "From eye-catching captions to trending hashtags, we've got everything you need. Start your journey to online fame!",
  };

  return (
    <View style={[styles.container, { width }]} className="flex-1 flex-col">
      <View className="relative z-0 h-2/3 w-full">
        <Image
          source={require('~/assets/kaboompics_teenagers-young-girls.jpg')}
          alt="Teenager girls take a selfie Photo by Kaboompics"
          className="h-full w-full object-cover"
        />
      </View>
      {/* <View style={styles.header} className="w-full flex flex-row items-center justify-between px-4">
                <Text variant="largeTitle" style={[styles.welcomeText, { color: colors.secondary }]} className="text-center">Welcome!</Text>
                <Text variant="subhead" style={{fontFamily: "Imprima", color: colors.foreground}} className="text-center bg-background rounded-xl px-2">Skip</Text>
            </View> */}
      <Card title={content.title} caption={content.caption}>
        <View
          style={[
            styles.buttonContainer,
            { width: width / 5, height: width / 5, top: (vh / 2) * 0.05 },
          ]}
          className="items-center justify-center self-center rounded-full bg-transparent">
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary, width: width / 5, height: width / 5 },
            ]}
            className="h-full w-full items-center justify-center rounded-full"
            onPress={() => {
              console.log('Pass to 2');
              router.replace('/get-started');
            }}>
            <Icon name="arrow-right" size={24} color={colors.root} />
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  header: {
    position: 'absolute',
    top: 24,
  },
  welcomeText: {
    fontFamily: 'Borel',
    lineHeight: 72,
  },
  cardContainer: {
    opacity: 1,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Alegreya-Med',
  },
  cardCaption: {
    fontFamily: 'Imprima',
    opacity: 0.6,
  },
  buttonContainer: {
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
