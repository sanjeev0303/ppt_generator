import { OutlineCard } from "@/lib/type"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"


type OutlineStore = {
    outlines: OutlineCard[]
    resetOutlines: () => void
    addOutline: (outline: OutlineCard) => void
    addMultipleOutlines: (outline: OutlineCard[]) => void
}


 export const useScratchStore = create<OutlineStore>()(devtools(
    persist(
        (set) => ({
            outlines: [],

            resetOutlines: () => set({ outlines: [] }),

            addOutline: (outline: OutlineCard) => {
                set((state) => ({ outlines: [...state.outlines, outline] }));
            },

            addMultipleOutlines: (outlines: OutlineCard[]) => {
                set((state) => ({ outlines: [...state.outlines, ...outlines] }));
            },
        }),
        { name: "scratch" }
    )
))
