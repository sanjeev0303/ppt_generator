import { OutlineCard } from "@/lib/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CreativeAIStore = {
  outlines: OutlineCard[] | [];
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  addOutline: (outline: OutlineCard) => void;
  currentAiPrompt: string
  setCurrentAiPrompt: (prompt: string) => void;
  resetOutlines: () => void;
};

export const useCreativeAIStore = create<CreativeAIStore>()(
  persist(
    (set) => ({
        currentAiPrompt: "",

        setCurrentAiPrompt: (prompt: string) => {
            set({ currentAiPrompt: prompt })
        },

      outlines: [],

      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set((state) => ({ outlines: [...state.outlines, ...outlines] }));
      },

      addOutline: (outline: OutlineCard) => {
        set((state) => ({ outlines: [...state.outlines, outline] }));
      },

      resetOutlines: () => {
        set({ outlines: [] })
      },
    }),
    {
      name: "creative-ai",
    }
  )
);
