/**
 * AIthusiast Local Data API — Frontend-Only Version
 * Replaces all backend API calls with local data operations
 */

import { TOOLS } from './tools';
import { ARTICLES } from './articles';
import { STACKS } from './stacks';

// Search suggestions for the search page
export const SEARCH_SUGGESTIONS = [
  "AI for writing essays",
  "best AI for video editing",
  "AI coding assistant",
  "AI for product photography",
  "create presentations with AI",
  "AI for podcast editing",
  "generate music with AI",
  "AI for logo design",
];

/**
 * Get tools with optional filters
 * @param {Object} params - { featured, category, limit, q }
 */
export function getTools(params = {}) {
  let results = [...TOOLS];
  
  // Filter by featured
  if (params.featured) {
    results = results.filter(t => t.featured);
  }
  
  // Filter by category
  if (params.category) {
    results = results.filter(t => t.category === params.category);
  }
  
  // Filter by search query
  if (params.q) {
    const query = params.q.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply limit
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return results;
}

/**
 * Get single tool by ID
 */
export function getTool(id) {
  const tool = TOOLS.find(t => t.id === id);
  if (!tool) throw new Error(`Tool ${id} not found`);
  return tool;
}

/**
 * Get similar tools (same category, excluding current)
 */
export function getSimilarTools(id) {
  const tool = getTool(id);
  return TOOLS
    .filter(t => t.category === tool.category && t.id !== id)
    .slice(0, 6);
}

/**
 * Get tools ranking (sorted by rank)
 */
export function getToolsRanking(params = {}) {
  const ranked = TOOLS
    .filter(t => t.trending && t.rank)
    .sort((a, b) => a.rank - b.rank);
  
  return params.limit ? ranked.slice(0, params.limit) : ranked;
}

/**
 * Compare multiple tools by IDs
 */
export function compareTools(ids) {
  const idList = typeof ids === 'string' ? ids.split(',') : ids;
  return idList.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
}

/**
 * Get all articles with optional filters
 * @param {Object} params - { featured, category, limit }
 */
export function getArticles(params = {}) {
  let results = [...ARTICLES];
  
  if (params.featured) {
    results = results.filter(a => a.featured);
  }
  
  if (params.category) {
    results = results.filter(a => a.category === params.category);
  }
  
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return results;
}

/**
 * Get single article by slug
 */
export function getArticle(slug) {
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) throw new Error(`Article ${slug} not found`);
  return article;
}

/**
 * Get all stacks
 */
export function getStacks() {
  return [...STACKS];
}

/**
 * Get single stack by slug
 */
export function getStack(slug) {
  const stack = STACKS.find(s => s.slug === slug);
  if (!stack) throw new Error(`Stack ${slug} not found`);
  return stack;
}

/**
 * Get search suggestions
 */
export function getSuggestions() {
  return { prompts: SEARCH_SUGGESTIONS };
}

/**
 * Perform AI search (frontend-only mock)
 * In a real backend, this would use an LLM to understand intent and rank tools
 * For V1 frontend-only, we do keyword matching + basic ranking
 */
export function performSearch(query) {
  const q = query.toLowerCase();
  
  // Simple keyword extraction
  const keywords = q.split(' ').filter(w => w.length > 2);
  
  // Find matching tools
  let matches = TOOLS.map(tool => {
    let score = 0;
    const searchText = `${tool.name} ${tool.tagline} ${tool.description} ${tool.category} ${tool.tags.join(' ')}`.toLowerCase();
    
    // Exact name match gets highest score
    if (tool.name.toLowerCase() === q) score += 100;
    
    // Name contains query
    if (tool.name.toLowerCase().includes(q)) score += 50;
    
    // Category match
    if (tool.category.toLowerCase().includes(q)) score += 30;
    
    // Keyword matches
    keywords.forEach(keyword => {
      if (searchText.includes(keyword)) score += 10;
    });
    
    // Tags match
    tool.tags.forEach(tag => {
      if (keywords.some(k => tag.toLowerCase().includes(k))) score += 15;
    });
    
    // Featured & trending tools get small boost
    if (tool.featured) score += 5;
    if (tool.trending) score += 3;
    
    return { tool, score };
  })
  .filter(m => m.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 12);
  
  // Generate simple intent message
  let intent = `Based on "${query}", here are AI tools that match your needs.`;
  
  if (q.includes('video')) {
    intent = `For video creation and editing, these AI tools offer the best capabilities.`;
  } else if (q.includes('code') || q.includes('coding') || q.includes('programming')) {
    intent = `For coding and development, these AI assistants will accelerate your workflow.`;
  } else if (q.includes('image') || q.includes('photo') || q.includes('design')) {
    intent = `For visual design and image generation, these tools lead the industry.`;
  } else if (q.includes('write') || q.includes('writing') || q.includes('essay')) {
    intent = `For writing assistance and content creation, these AI tools excel.`;
  } else if (q.includes('music') || q.includes('audio') || q.includes('voice')) {
    intent = `For audio and voice generation, these are the most capable AI tools.`;
  } else if (q.includes('research') || q.includes('paper')) {
    intent = `For research and academic work, these tools provide the best support.`;
  }
  
  // Extract filters (categories mentioned)
  const filters = [];
  const categories = ['prompting', 'image-generation', 'video', 'coding', 'design', 'productivity', 'research', 'voice', '3d', 'automation'];
  categories.forEach(cat => {
    if (q.includes(cat) || q.includes(cat.replace('-', ' '))) {
      filters.push(cat);
    }
  });
  
  return {
    intent,
    tools: matches.map(m => m.tool),
    recommendations: matches.map(m => ({
      tool_id: m.tool.id,
      why: `${m.tool.tagline} — Strong match based on your query.`
    })),
    filters,
    source: 'keyword', // Would be 'llm' if using real AI backend
    cached: false
  };
}

// Export all data for direct access if needed
export { TOOLS, ARTICLES, STACKS };
