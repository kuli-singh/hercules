import * as Updates from 'expo-updates';

const inlinePublicEnv: Record<string, string> = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '',
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '',
  EXPO_PUBLIC_HERCULES_AI_URL: process.env.EXPO_PUBLIC_HERCULES_AI_URL?.trim() || '',
  EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() || '',
};

const getExpoExtra = (): Record<string, unknown> => {
  const manifestExtra = (Updates.manifest as { extra?: Record<string, unknown> } | null)?.extra;
  if (manifestExtra && typeof manifestExtra === 'object') {
    const extraRecord = manifestExtra as Record<string, unknown>;
    const expoClientExtra = extraRecord.expoClient;

    if (expoClientExtra && typeof expoClientExtra === 'object') {
      return {
        ...extraRecord,
        ...(expoClientExtra as Record<string, unknown>),
      };
    }

    return extraRecord;
  }

  return {};
};

const readEnv = (name: string) => {
  const processValue = inlinePublicEnv[name];
  if (processValue) {
    return processValue;
  }

  const extraValue = getExpoExtra()[name];
  return typeof extraValue === 'string' ? extraValue.trim() : '';
};

const getMissingPublicEnv = () => (
  ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'].filter((name) => !readEnv(name))
);

export const getPublicEnvError = () => {
  const missing = getMissingPublicEnv();
  if (missing.length === 0) {
    return null;
  }

  return `Missing required runtime config: ${missing.join(', ')}. Rebuild the APK with these EXPO_PUBLIC_* values set in EAS.`;
};

const requirePublicEnv = (name: string) => {
  const value = readEnv(name);
  if (!value) {
    throw new Error(getPublicEnvError() || `Missing required environment variable: ${name}`);
  }
  return value;
};

export const publicEnv = {
  get supabaseUrl() {
    return requirePublicEnv('EXPO_PUBLIC_SUPABASE_URL');
  },
  get supabaseAnonKey() {
    return requirePublicEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  },
  get herculesAiUrl() {
    return readEnv('EXPO_PUBLIC_HERCULES_AI_URL');
  },
  get insecureOpenAiKey() {
    return readEnv('EXPO_PUBLIC_OPENAI_API_KEY');
  },
};

const getDefaultAiFunctionUrl = () => (
  `${publicEnv.supabaseUrl.replace(/\/+$/, '')}/functions/v1/openai`
);

export const assertSecureAiConfiguration = () => {
  if (publicEnv.insecureOpenAiKey) {
    throw new Error(
      'Remove EXPO_PUBLIC_OPENAI_API_KEY. Expo public env vars ship inside the app bundle. Route AI requests through a server or Supabase Edge Function and set EXPO_PUBLIC_HERCULES_AI_URL instead.'
    );
  }

  return publicEnv.herculesAiUrl || getDefaultAiFunctionUrl();
};

export const getAiFunctionHeaders = (includeJsonContentType = true): Record<string, string> => {
  const headers: Record<string, string> = {
    apikey: publicEnv.supabaseAnonKey,
    Authorization: `Bearer ${publicEnv.supabaseAnonKey}`,
  };

  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};
