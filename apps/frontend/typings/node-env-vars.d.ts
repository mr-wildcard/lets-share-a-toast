declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    API_URL: string;
    REAL_TIME_APP_BASE_URL: string;
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_DATABASE_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
  }
}
