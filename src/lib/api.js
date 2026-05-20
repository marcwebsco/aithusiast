/**
 * AIthusiast API — Frontend-Only Version
 * All API calls now use local data instead of backend
 */

import {
  getTools,
  getTool,
  getSimilarTools,
  getToolsRanking,
  compareTools,
  getArticles,
  getArticle,
  getStacks,
  getStack,
  getSuggestions,
  performSearch,
} from '@/data';

/**
 * Route API calls to local data functions
 */
export const apiGet = async (path, params = {}) => {
  // Route to appropriate local data function
  if (path === '/tools') {
    return getTools(params);
  }
  
  if (path.startsWith('/tools/') && path.includes('/similar')) {
    const id = path.split('/')[2];
    return getSimilarTools(id);
  }
  
  if (path === '/tools/ranking') {
    return getToolsRanking(params);
  }
  
  if (path === '/tools/compare') {
    return compareTools(params.ids);
  }
  
  if (path.startsWith('/tools/')) {
    const id = path.split('/')[2];
    return getTool(id);
  }
  
  if (path === '/articles') {
    return getArticles(params);
  }
  
  if (path.startsWith('/articles/')) {
    const slug = path.split('/')[2];
    return getArticle(slug);
  }
  
  if (path === '/stacks') {
    return getStacks();
  }
  
  if (path.startsWith('/stacks/')) {
    const slug = path.split('/')[2];
    return getStack(slug);
  }
  
  if (path === '/suggestions') {
    return getSuggestions();
  }
  
  throw new Error(`Unknown API endpoint: ${path}`);
};

export const apiPost = async (path, body) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (path === '/search') {
    return performSearch(body.query);
  }
  
  throw new Error(`Unknown API endpoint: ${path}`);
};

export const CATEGORY_LABELS = {
  prompting: "Prompting",
  "image-generation": "Image Generation",
  productivity: "Productivity",
  coding: "Coding",
  design: "Design",
  video: "Video",
  research: "Research",
  voice: "Voice",
  "3d": "3D",
  automation: "Automation",
};

export const CATEGORY_ORDER = [
  "prompting",
  "image-generation",
  "video",
  "coding",
  "design",
  "productivity",
  "research",
  "voice",
  "3d",
  "automation",
];

export const formatCategory = (slug) => CATEGORY_LABELS[slug] || slug;

export const SITE = {
  name: "AIthusiast",
  tagline: "Discover the best AI for anything.",
  url: process.env.REACT_APP_SITE_URL || "https://aithusiast.com",
  email: "marcwebs.co@gmail.com",
};
