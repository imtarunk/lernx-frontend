import { create } from "zustand";
import api from "@/lib/api";
import type { Course } from "@/types";

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: false,
  error: null,
  async fetchCourses() {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/courses");
      set({ courses: data });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load courses" });
    } finally {
      set({ loading: false });
    }
  },
}));
