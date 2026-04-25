import type { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'Hercules',
  slug: 'hercules',
  owner: 'kuli_s',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: false,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#06110f',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kuli.hercules',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#06110f',
    },
    package: 'com.kuli.hercules',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  updates: {
    url: 'https://u.expo.dev/41dafb2e-9afc-4c59-9e42-8e31786c448c',
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  extra: {
    eas: {
      projectId: '41dafb2e-9afc-4c59-9e42-8e31786c448c',
    },
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    EXPO_PUBLIC_HERCULES_AI_URL: process.env.EXPO_PUBLIC_HERCULES_AI_URL || '',
    EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  },
};

export default config;
