// src/utils/config.js
// Configuration file to store global variables

export const isProd = import.meta.env.PROD;

// PocketBase API URL
// Pointing to remote CMS by default to ensure data is always available
export const PB_URL = 'https://cms.sarjanakomputer.id';

// Use this for local development if needed:
// export const PB_URL = isProd ? 'https://cms.sarjanakomputer.id' : 'http://127.0.0.1:8095';

