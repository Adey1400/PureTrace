// Demo-only frontend authentication.
// This is not intended for production security.

const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : ((typeof process !== 'undefined' && process.env) ? process.env : {});

export const DEMO_AUTH_EMAIL = (metaEnv.VITE_DEMO_AUTH_EMAIL || 'admin@puretrace.demo').trim();
export const DEMO_AUTH_PASSWORD = metaEnv.VITE_DEMO_AUTH_PASSWORD || 'PureTrace@123';
export const DEMO_STORAGE_KEY = 'puretrace_demo_authenticated';
