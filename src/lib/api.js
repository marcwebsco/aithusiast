import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiGet = async (path, params) => {
  const { data } = await axios.get(`${API}${path}`, { params });
  return data;
};
export const apiPost = async (path, body) => {
  const { data } = await axios.post(`${API}${path}`, body);
  return data;
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
  url: BACKEND_URL || "http://localhost:3000",
  email: "marcwebs.co@gmail.com",
};
