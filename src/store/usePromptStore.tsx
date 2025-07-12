import { OutlineCard } from "@/lib/type";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type Page = "create" | "creative-ai" | "create-scratch";
type Prompt = {
    outlines: OutlineCard[];
    id: string
    createdAt: string
    title: string
    prompts: OutlineCard | []
}

type PromptStore = {
  page: Page;
  setPage: (page: Page) => void;
  prompts: Prompt[] | []
  addPrompt: (prompt: Prompt) => void
  removePrompt: (id: string) => void
};

export const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create",
        setPage: (page: Page) => set({ page }),
      prompts: [],
      addPrompt: (prompt: Prompt) => {
        set((state: PromptStore) => ({
          prompts: [prompt, ...state.prompts]
        }));
      },
      removePrompt: (id: string) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt: Prompt) => prompt.id!== id)
        }));
      }
    }),
      { name: "prompts" }
    )
  )
);
