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

  const orderedSlides = getOrderSlides();

  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [loading, setLoading] = useState(true);

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
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

    if (!isEditable) {
      return;
    }

    if (item.type === "layout") {
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

      addSlideAtIndex(newSlide, dropIndex);
    } else if (item.type === "SLIDE" && item.index !== undefined) {
      moveSlide(item.index, dropIndex);
    }
  };

  const handleDelete = (id: string) => {
    if (isEditable) {
      removeSlide(id);
    }
  };

  useEffect(() => {

    if (
      typeof currentSlide === "number" &&
      currentSlide >= 0 &&
      slideRefs.current[currentSlide]
    ) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlide]);

  useEffect(() => {
   // Set loading to false once slides are available
   if (slides && slides.length > 0) {
     setLoading(false);
   }
 }, [slides]);


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
                  isEditable={isEditable}
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
