import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orabank.mentorat',
  appName: 'Orabank Mentorat',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;