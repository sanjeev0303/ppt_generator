"use client";

import { LayoutSlides } from "@/lib/type";
import { cn } from "@/lib/utils";
import React from "react";
import { useDrop } from "react-dnd";

interface DropZoneProps {
  index: number;
  onDrop: (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => void;
  isEditable?: boolean;
  //   isDraggingOver?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  index,
  onDrop,
  isEditable = true,
}: DropZoneProps) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["SLIDE", "layout"],
    drop: (item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    }) => {
      if (isEditable) {
        onDrop(item, index);
      }
    },
    canDrop: (item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
    }) => (item.type === "SLIDE" || item.type === "layout") && isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  if (!isEditable) return null;

  return (
    <div
      className={cn(
        "h-4 my-2 rounded-md transition-all duration-200",
        isOver && canDrop ? "border-green-500 bg-green-100" : "border-gray-300",
        canDrop ? "border-blue-300" : ""
      )}
    >
      {isOver && canDrop && (
        <div className="h-full flex items-center justify-center text-green-600">
          Drop here
        </div>
      )}
    </div>
  );
};

export default DropZone;
