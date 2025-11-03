import { create } from "zustand";
import api from "@/lib/api";
import type { Question } from "@/types";

interface QuestionsState {
  byCourseId: Record<string, Question[]>;
  loading: boolean;
  error: string | null;
  currentIndexByCourse: Record<string, number>;
  fetchQuestions: (courseId: string) => Promise<void>;
  setCurrentIndex: (courseId: string, index: number) => void;
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  byCourseId: {},
  loading: false,
  error: null,
  currentIndexByCourse: {},
  async fetchQuestions(courseId: string) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/courses/${courseId}/questions`);
      set((state) => ({
        byCourseId: { ...state.byCourseId, [courseId]: data },
      }));
    } catch (e: any) {
      set({ error: e?.message || "Failed to load questions" });
    } finally {
      set({ loading: false });
    }
  },
  setCurrentIndex(courseId, index) {
    set((state) => ({
      currentIndexByCourse: {
        ...state.currentIndexByCourse,
        [courseId]: index,
      },
    }));
  },
}));
