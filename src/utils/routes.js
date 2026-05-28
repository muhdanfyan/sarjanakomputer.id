// src/utils/routes.js
// Dynamic routing utility to resolve subdomain links and prevent double path bugs

import { isProd } from './config.js';

// Base domains
const prodDomain = "sarjanakomputer.id";
const devDomain = "sarjanakomputer.local:8080"; // Local proxy port

const baseDomain = isProd ? prodDomain : devDomain;
const protocol = isProd ? "https://" : "http://";

// Main Domain Pages
export const getHomeUrl = () => `${protocol}${baseDomain}/`;
export const getStrukturUrl = () => `${protocol}${baseDomain}/struktur-organisasi/`;

// Subdomain Roots
export const getProfilUrl = () => `${protocol}profil.${baseDomain}/`;
export const getAplikasiUrl = () => `${protocol}aplikasi.${baseDomain}/`;
export const getAcademyUrl = () => `${protocol}academy.${baseDomain}/`;
export const getAutomasiUrl = () => `${protocol}automasi.${baseDomain}/`;
export const getNewsUrl = () => `${protocol}news.${baseDomain}/`;

// News dynamic detail links
// In the news subdomain, the detail page is served directly at the root (e.g. news.domain.com/slug)
export const getNewsDetailUrl = (slug) => {
  return `${protocol}news.${baseDomain}/${slug}`;
};
