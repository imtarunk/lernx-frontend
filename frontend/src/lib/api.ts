import axios from "axios";
import { startLoading, stopLoading } from "./loader";
import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Missing API_URL environment variable");
}

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  startLoading();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (e) {
    // Failed to get session, continue without token
    console.error("Failed to get session:", e);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

export default api;
