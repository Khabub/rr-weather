/// <reference types="vite/client" />

// to be able to use API KEY from .env
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@jamescoyle/vue-icon";
