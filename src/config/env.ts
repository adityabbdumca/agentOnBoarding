type AppEnv = {
  VITE_APP_NAME: string;
  VITE_API_URL: string;
  VITE_EXCEL_URL: string;
  VITE_APP_BASE_PATH: string;
};

const env = (window as any).__ENV__ as AppEnv;
if (!env) {
  throw new Error('Runtime env not loaded');
}

export const APP_NAME = env.VITE_APP_NAME;
export const API_URL = env.VITE_API_URL;
export const EXCEL_URL = env.VITE_EXCEL_URL;
export const APP_BASE_PATH = env.VITE_APP_BASE_PATH;