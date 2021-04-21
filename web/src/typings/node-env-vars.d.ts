declare global {
  interface ImportMeta {
    env: {
      VITE_APP_URL: string;
      VITE_API_URL: string;
      VITE_LOCAL_HOSTNAME: string;
      VITE_FIREBASE_PROJECT_ID: string;
      VITE_FIREBASE_API_KEY: string;
      VITE_FIREBASE_AUTH_DOMAIN: string;
      VITE_FIREBASE_APP_ID: string;
      VITE_FIREBASE_EMULATOR_AUTH_HOST: string;
      VITE_FIREBASE_EMULATOR_FIRESTORE_PORT: string;
      VITE_FIREBASE_EMULATOR_DATABASE_HOST: string;
    };
  }
}
