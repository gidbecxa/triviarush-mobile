import { useWindowDimensions, View, ImageBackground } from 'react-native';
import { Redirect, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { fontStyles } from '../_layout';
import { AuthApi } from '~/api/api';
import { useAuthContext } from '~/store/ctx';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  // console.log('User Info:', userInfo);
  return userInfo;
};

const storeUserData = async (accessToken: string, refreshToken: string, user: object) => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('profile', JSON.stringify(user));
  } catch (error) {
    console.log('Error storing user data:', error);
  }
};

export default function SignInOptions() {
  const { setIsNewUser, setIsLoggedIn, setIsFirstLaunch } = useAuthContext();

  const { width, height } = useWindowDimensions();
  const { colors } = useColorScheme();

  const redirectTest = () => {
    return router.replace('/onboarding');
  };

  const handleGoogleSignin = () => {
    signInWithGoogle()
      .then((userInfo) => {
        const { idToken } = userInfo;
        return AuthApi.signInWithGoogle({ idToken });
      })
      .then(async ({ accessToken, refreshToken, user, newUser }) => {
        console.log('User successfully signed in: ', user);
        await storeUserData(accessToken, refreshToken, user);
        setIsLoggedIn(true);
        setIsFirstLaunch(false);
        if (!newUser) {
          console.log('Welcome back!');
          setIsNewUser(false);
          return router.replace('/');
        } else {
          console.log('Welcome, new user!');
          return router.replace('/onboarding');
        }
      })
      .catch((error) => {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Operation in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play Services not available or outdated');
            break;
          default:
            console.log('Login error:', error);
        }
      });
  };

  return (
    <ImageBackground
      className="flex-1"
      style={{ width }}
      source={require('~/assets/graphics/ImageBackground01.png')}
      imageStyle={{ resizeMode: 'cover', backgroundColor: colors.background }}
      alt="Background graphic">
      <View
        className="flex-1 items-center justify-end"
        style={{ backgroundColor: 'rgba(18, 18, 19, 0.8)' }}>
        <View
          style={{ width, height: height * 0.45, backgroundColor: 'transparent' }}
          className="justify-center border-0 border-border px-5 pb-12">
          <Text
            variant="heading"
            className="mb-2.5 text-center"
            style={[fontStyles.promptRegular, { color: colors.primary }]}>
            Continue with
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityHint="Press button to sign in via e-mail"
            className="mb-2 min-h-12 w-full items-center py-3"
            style={{ borderRadius: 0, backgroundColor: colors.grey4 }}
            onPress={redirectTest}>
            <Text variant="callout" style={fontStyles.promptRegular}>
              Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityHint="Press button to sign in via phone"
            className="mb-2 min-h-12 w-full items-center py-3"
            style={{ borderRadius: 0, backgroundColor: colors.grey4 }}
            onPress={handleGoogleSignin}>
            <Text variant="callout" style={fontStyles.promptRegular}>
              Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityHint="Press button to sign in via facebook"
            className="min-h-12 w-full items-center py-3"
            style={{ borderRadius: 0, backgroundColor: colors.grey4 }}>
            <Text variant="callout" style={fontStyles.promptRegular}>
              Facebook
            </Text>
          </TouchableOpacity>
          <Text
            variant="footnote"
            className="mt-2.5 text-center leading-5"
            style={fontStyles.promptRegular}>
            Or get started{' '}
            <Text variant="footnote" style={{ color: colors.primary }}>
              without signing up
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
