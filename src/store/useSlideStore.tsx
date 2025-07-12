import type { ContentItem, Slide, Theme } from "@/lib/type";
import type { Project } from "@prisma/client";
import { v4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

interface SlideState {
  slides: Slide[];
  project: Project | null;
  setProject: (project: Project) => void; // Fixed parameter name
  setSlides: (slides: Slide[]) => void;
  currentSlide: number;
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void; // Fixed typo in method name
  getOrderSlides: () => Slide[];
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  addSlide: (slide: Slide) => void;
  removeSlide: (slideId: string) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  clearSlides: () => void;
  initializeSlides: (slides: Slide[]) => void;
  addSlideAtIndex: (slide: Slide, index: number) => void;
  setCurrentSlide: (index: number) => void;
  updateContentItem: (
    slideId: string,
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  addComponentInSlide: (
    slideId: string,
    item: ContentItem,
    parentId: string,
    index: number
  ) => void;
}

const defaultTheme: Theme = {
  name: "Default",
  fontFamily: "'Inter', sans-serif",
  fontColor: "#333333",
  backgroundColor: "#f0f0f0",
  slideBackgroundColor: "#ffffff",
  accentColor: "#3b82f6",
  type: "light",
};

export const useSlideStore = create<SlideState>()(
  devtools(
    persist(
      (set, get) => ({
        slides: [],
        project: null,
        currentTheme: defaultTheme,

        setProject: (project: Project) => {
          console.log("🏗️ Setting project:", project?.id || "null");
          set({ project }, false, "setProject");
        },

        setSlides: (slides: Slide[]) => {
          console.log("📋 Setting slides - Count:", slides?.length || 0);
          console.log("📋 Slides data:", slides);

          if (!slides || !Array.isArray(slides)) {
            console.error(
              "❌ setSlides: Invalid slides data - not an array:",
              slides
            );
            return;
          }

          // Ensure each slide has a proper slideOrder
          const processedSlides = slides.map((slide, index) => {
            const processedSlide = {
              ...slide,
              slideOrder: slide.slideOrder ?? index + 1,
            };
            console.log(`📄 Processing slide ${index + 1}:`, {
              id: processedSlide.id,
              slideOrder: processedSlide.slideOrder,
              title: processedSlide.slideName || "No title",
            });
            return processedSlide;
          });

          set({ slides: processedSlides }, false, "setSlides");
          console.log(
            "✅ Slides set successfully - Total:",
            processedSlides.length
          );
        },

        setCurrentTheme: (theme: Theme) => {
          console.log("🎨 Setting theme:", theme?.name || "Unknown theme");
          set({ currentTheme: theme }, false, "setCurrentTheme");
        },

        getOrderSlides: () => {
          const state = get();
          console.log("🔍 getOrderSlides called");
          console.log("📊 Current state slides:", state.slides);
          console.log("📈 Slides count in state:", state.slides?.length || 0);

          // Ensure slides is always an array
          if (!state.slides) {
            console.warn("⚠️ state.slides is null/undefined");
            return [];
          }

          if (!Array.isArray(state.slides)) {
            console.error(
              "❌ state.slides is not an array:",
              typeof state.slides
            );
            return [];
          }

          const slides = state.slides;

          if (slides.length === 0) {
            console.log("📭 No slides found in store");
            return [];
          }

          console.log("🔄 Sorting slides by slideOrder...");
          const orderedSlides = [...slides].sort((a, b) => {
            const orderA = a.slideOrder ?? 0;
            const orderB = b.slideOrder ?? 0;
            console.log(`🔢 Comparing slide orders: ${orderA} vs ${orderB}`);
            return orderA - orderB;
          });

          console.log(
            "✅ Ordered slides result:",
            orderedSlides.map((s) => ({
              id: s.id,
              slideOrder: s.slideOrder,
              title: s.slideName || "No title",
            }))
          );

          return orderedSlides;
        },

        reorderSlides: (fromIndex: number, toIndex: number) => {
          console.log(
            `🔄 Reordering slides from index ${fromIndex} to ${toIndex}`
          );

          const state = get();
          if (!state.slides || state.slides.length === 0) {
            console.warn("⚠️ Cannot reorder: No slides available");
            return;
          }

          if (fromIndex < 0 || fromIndex >= state.slides.length) {
            console.error(
              `❌ Invalid fromIndex: ${fromIndex} (slides length: ${state.slides.length})`
            );
            return;
          }

          if (toIndex < 0 || toIndex >= state.slides.length) {
            console.error(
              `❌ Invalid toIndex: ${toIndex} (slides length: ${state.slides.length})`
            );
            return;
          }

          set(
            (state) => {
              const newSlides = [...state.slides];
              const [removed] = newSlides.splice(fromIndex, 1);
              newSlides.splice(toIndex, 0, removed);

              const reorderedSlides = newSlides.map((slide, index) => ({
                ...slide,
                slideOrder: index + 1,
              }));

              console.log("✅ Slides reordered successfully");
              console.log(
                "📋 New order:",
                reorderedSlides.map((s) => ({
                  id: s.id,
                  slideOrder: s.slideOrder,
                  title: s.slideName || "No title",
                }))
              );

              return { slides: reorderedSlides };
            },
            false,
            "reorderSlides"
          );
        },

        addSlide: (slide: Slide) => {
          console.log("➕ Adding new slide:", slide.id);
          set(
            (state) => {
              const newSlideOrder =
                Math.max(...state.slides.map((s) => s.slideOrder || 0), 0) + 1;
              const newSlide = {
                ...slide,
                slideOrder: slide.slideOrder ?? newSlideOrder,
              };

              const updatedSlides = [...state.slides, newSlide];
              console.log(
                "✅ Slide added - Total slides:",
                updatedSlides.length
              );

              return { slides: updatedSlides };
            },
            false,
            "addSlide"
          );
        },

        removeSlide: (slideId: string) => {
          console.log("🗑️ Removing slide:", slideId);
          set(
            (state) => {
              const filteredSlides = state.slides.filter(
                (slide) => slide.id !== slideId
              );

              // Reorder remaining slides
              const reorderedSlides = filteredSlides.map((slide, index) => ({
                ...slide,
                slideOrder: index + 1,
              }));

              console.log(
                "✅ Slide removed - Remaining slides:",
                reorderedSlides.length
              );
              return { slides: reorderedSlides };
            },
            false,
            "removeSlide"
          );
        },

        updateSlide: (slideId: string, updates: Partial<Slide>) => {
          console.log("📝 Updating slide:", slideId, updates);
          set(
            (state) => {
              const updatedSlides = state.slides.map((slide) =>
                slide.id === slideId ? { ...slide, ...updates } : slide
              );

              console.log("✅ Slide updated successfully");
              return { slides: updatedSlides };
            },
            false,
            "updateSlide"
          );
        },

        clearSlides: () => {
          console.log("🧹 Clearing all slides");
          set({ slides: [] }, false, "clearSlides");
        },

        initializeSlides: (slides: Slide[]) => {
          console.log("🚀 Initializing slides with data:", slides?.length || 0);

          if (!slides || !Array.isArray(slides)) {
            console.error("❌ initializeSlides: Invalid slides data");
            return;
          }

          // Process slides with proper ordering
          const processedSlides = slides.map((slide, index) => ({
            ...slide,
            slideOrder: slide.slideOrder ?? index + 1,
          }));

          set({ slides: processedSlides }, false, "initializeSlides");
          console.log("✅ Slides initialized successfully");
        },

        addSlideAtIndex: (slide: Slide, index: number) => {
          console.log(`➕ Adding slide at index ${index}:`, slide.id);
          set(
            (state) => {
              if (index < 0 || index > state.slides.length) {
                console.error(
                  `❌ Invalid index: ${index} (slides length: ${state.slides.length})`
                );
                return state;
              }

              const newSlides = [...state.slides];
              newSlides.splice(index, 0, { ...slide, id: v4() });
              newSlides.forEach((s, i) => {
                s.slideOrder = i;
              });

              console.log(
                "✅ Slide added at index - Total slides:",
                newSlides.length
              );
              return { slides: newSlides, currentSlide: index };
            },
            false,
            "addSlideAtIndex"
          );
        },
        currentSlide: 0,

        setCurrentSlide: (index: number) => {
          set({ currentSlide: index });
        },

        updateContentItem: (
          slideId: string,
          contentId: string,
          newContent: string | string[] | string[][]
        ) => {
          set((state) => {
            const updateContRecursively = (item: ContentItem): ContentItem => {
              if (item.id === contentId) {
                return {
                  ...item,
                  content: newContent,
                };
              }
              if (
                Array.isArray(item.content) &&
                item.content.every((i) => typeof i !== "string")
              ) {
                return {
                  ...item,
                  content: item.content.map((subItem) => {
                    if (typeof subItem !== "string") {
                      return updateContRecursively(subItem as ContentItem);
                    }
                    return subItem;
                  }) as ContentItem[],
                };
              }
              return item;
            };
            {
              return {
                slides: state.slides.map((slide) =>
                  slide.id === slideId
                    ? {
                        ...slide,
                        content: updateContRecursively(slide.content),
                      }
                    : slide
                ),
              };
            }
          });
        },

        addComponentInSlide: (
          slideId: string,
          item: ContentItem,
          parentId: string,
          index: number
        ) => {
          set((state) => {
            const updatedSlides = state.slides.map((slide) => {
              if (slide.id === slideId) {
                const updatedContentRecursively = (
                  content: ContentItem
                ): ContentItem => {
                  if (
                    content.id === parentId &&
                    Array.isArray(content.content)
                  ) {
                    const updatedContent = [...content.content];
                    updatedContent.splice(index, 0, item);

                    return {
                      ...content,
                      content: updatedContent as unknown as string[],
                    };
                  }
                  return content;
                };
                return {
                  ...slide,
                  content: updatedContentRecursively(slide.content),
                };
              }
              return slide;
            });
            return { slides: updatedSlides };
          });
        },
      }),
      {
        name: "slides-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          console.log("💾 Store rehydrated from localStorage");
          if (state?.slides) {
            console.log("📋 Rehydrated slides count:", state.slides.length);
          }
        },
        partialize: (state) => ({
          slides: state.slides,
          project: state.project,
          currentTheme: state.currentTheme,
        }),
      }
    ),
    {
      name: "slide-store",
    }
  )
);
