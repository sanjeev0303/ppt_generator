"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlideStore } from "@/store/useSlideStore";
import React, { useEffect, useState } from "react";
import DropZone from "./DropZone";
import { ContentType, LayoutSlides } from "@/lib/type";
import { v4 } from "uuid";
import DraggableSlide from "./DraggableSlide";

type Props = {
  isEditable?: boolean;
};

const Editor = ({ isEditable }: Props) => {
  const {
    getOrderSlides,
    currentSlide,
    removeSlide,
    addSlideAtIndex,
    reorderSlides,
    slides,
    project,
  } = useSlideStore();

  console.log("🎬 Editor component rendered");
  console.log("📊 Current slides count:", slides?.length || 0);

  const orderedSlides = getOrderSlides();
  console.log("📋 Ordered slides count:", orderedSlides?.length || 0);

  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    console.log(`🔄 Moving slide from ${dragIndex} to ${hoverIndex}`);
    if (isEditable) {
      reorderSlides(dragIndex, hoverIndex);
    }
  };

  const handleDrop = (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => {
    console.log("📥 Drop event:", { item, dropIndex });

    if (!isEditable) {
      console.log("⚠️ Editor not editable, ignoring drop");
      return;
    }

    if (item.type === "layout") {
      console.log("➕ Adding new slide from layout");

      // Fix: Ensure the slide object matches the Slide interface
      const newSlide = {
        id: v4(),
        slideOrder: dropIndex,
        slideName: item.component.slideName || `Slide ${dropIndex + 1}`,
        content:
          Array.isArray(item.component.content) &&
          item.component.content.length > 0
            ? item.component.content[0]
            : {
                id: v4(),
                type: "text" as ContentType,
                name: "Default Content",
                content: "",
              },
        className: item.component.className,
        type: item.component.type || item.layoutType,
      };

      console.log("🆕 New slide object:", newSlide);

      addSlideAtIndex(newSlide, dropIndex);
    } else if (item.type === "SLIDE" && item.index !== undefined) {
      console.log("🔄 Reordering existing slide");
      moveSlide(item.index, dropIndex);
    }
  };

  const handleDelete = (id: string) => {
    console.log("🗑️ Deleting slide with ID:", id);
    if (isEditable) {
      removeSlide(id);
    }
  };

  useEffect(() => {
    console.log("🎯 Current slide changed:", currentSlide);

    if (
      typeof currentSlide === "number" &&
      currentSlide >= 0 &&
      slideRefs.current[currentSlide]
    ) {
      console.log("📍 Scrolling to slide:", currentSlide);
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlide]);

  // Log when slides change
  useEffect(() => {
    console.log("📊 Slides updated in Editor:", {
      totalSlides: slides?.length || 0,
      orderedSlidesCount: orderedSlides?.length || 0,
      projectId: project?.id || "No project",
    });
  }, [slides, orderedSlides, project]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setLoading(false)
    }
  }, [])


  return (
    <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20">
      {loading ? (
        <div className="w-full px-4 flex flex-col space-y-6">
          <Skeleton className="h-52 w-full bg-gray-400 text-gray-400" />
          <Skeleton className="h-52 w-full bg-gray-400 text-gray-400" />
          <Skeleton className="h-52 w-full bg-gray-400 text-gray-400" />
        </div>
      ) : (
        <ScrollArea className="flex-1 mt-8">
          <div className="px-4 pb-4 space-y-4 pt-2">
            {isEditable && (
              <DropZone index={0} onDrop={handleDrop} isEditable={isEditable} />
            )}
            {orderedSlides.map((slide, index) => (
              <React.Fragment key={slide.id}>
                <DraggableSlide
                  slide={slide}
                  index={index}
                  moveSlide={moveSlide}
                  handleDelete={handleDelete}
                />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Editor;
