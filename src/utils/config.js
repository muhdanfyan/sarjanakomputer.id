// src/utils/config.js
// Configuration file to store global variables

export const isProd = import.meta.env.PROD;

// PocketBase API URL
// In production: uses the secure Traefik domain
// In development: uses the local container port
export const PB_URL = isProd 
  ? 'https://cms.sarjanakomputer.id' 
  : 'http://127.0.0.1:8095';
