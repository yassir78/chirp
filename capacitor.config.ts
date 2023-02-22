import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.uga.chirp',
  appName: 'chirp',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "serverClientId": "835907456286-2gscevnq582r75s9fse4pjv29reheu1r.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true,
    }
  }
};

export default config;
