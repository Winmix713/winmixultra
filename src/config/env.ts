// Safely access environment variables with proper fallbacks
const getEnv = () => {
  if (typeof import.meta === 'undefined' || !import.meta.env) {
    return {};
  }
  return import.meta.env;
};
const envVars = getEnv();
export const env = {
  mode: envVars.MODE || 'production',
  isDev: envVars.MODE === 'development',
  isProd: envVars.MODE === 'production',
  isTest: envVars.MODE === 'test',
  supabase: {
    projectId: envVars.VITE_SUPABASE_PROJECT_ID || '',
    url: envVars.VITE_SUPABASE_URL || '',
    anonKey: envVars.VITE_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY || ''
  },
  oddsApi: {
    key: envVars.VITE_ODDS_API_KEY || ''
  }
};

// Feature flags configuration
export const phaseFlags = {
  // Add your feature flags here
  // Example:
  // enableNewFeature: envVars.VITE_ENABLE_NEW_FEATURE === 'true',
  // showBetaFeatures: envVars.VITE_SHOW_BETA_FEATURES === 'true',
};

// Validation - warn if environment variables are missing
if (typeof window !== 'undefined' && !env.isTest) {
  const missing: string[] = [];
  if (!env.supabase.projectId) missing.push('VITE_SUPABASE_PROJECT_ID');
  if (!env.supabase.url) missing.push('VITE_SUPABASE_URL');
  if (!env.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY');
  if (missing.length > 0) {
    console.warn('⚠️ Missing Supabase environment variables:', missing.join(', '));
    console.warn('Please check your .env file and restart the development server.');
  } else {
    console.log('✓ Supabase environment variables loaded successfully');
  }

  // Optional: Warn about missing Odds API key (non-critical)
  if (!env.oddsApi.key) {
    console.warn('⚠️ VITE_ODDS_API_KEY not configured. Market integration features will use mock data.');
  }
}