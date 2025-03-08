declare namespace NodeJS {
    export interface ProcessEnv {
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: string;
      PORT?: string;  // این متغیر برای پورت قابل تنظیم است
      JWT_SECRET: string;
    }
  }