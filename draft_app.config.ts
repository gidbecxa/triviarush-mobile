import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: "triviarush-game",
    name: "TriviaRush",
    platforms: ["ios", "android"],
    ios: {
        ...config.ios,
        bundleIdentifier: 'com.triviarush.mobile',
        buildNumber: '1.0.0'
    },
    android: {
        ...config.android,
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        package: 'com.triviarush.mobile',
        versionCode: 1
    },
    extra: {
        eas: {
            projectId: 'baafd255-7b10-4230-a086-62318555c317'
        }
    }
});

/**
 * android: {
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        appId: 'com.triviarush.mobile',
        projectName: 'TriviaRush'
    },
    expo: {
        extra: {
            eas: {
                projectId: 'baafd255-7b10-4230-a086-62318555c317'
            }
        }
    }
 */