"use client";

import { ContentItem } from "@/lib/type";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Heading1, Heading2, Heading3, Heading4, Title } from "@/components/global/editor/components/Headings";
import { cn } from "@/lib/utils";
import DropZoneContent from "./DropZoneContent";
import Paragraph from "@/components/global/editor/components/Paragraph";

type Props = {
  content: ContentItem;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isPreview: boolean;
  isEditable?: boolean;
  slideId: string;
  index?: number;
};

export const ContentRenderer: React.FC<Props> = React.memo(
  ({
    content,
    onContentChange,
    isPreview,
    isEditable,
    slideId,
    index,
  }: Props) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value);
      },
      [content.id, onContentChange]
    );

    const commonProps = {
      placeholder: content.placeholder,
      value: content.content as string,
      onChange: handleChange,
      isPreview: isPreview,
    };

    const animationProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeInOut" },
    };

    switch (content.type) {
      case "heading1":
        return (
          <motion.div className="w-full h-full">
            <Heading1 {...commonProps} />
          </motion.div>
        );
      case "heading2":
        return (
          <motion.div className="w-full h-full">
            <Heading2 {...commonProps} />
          </motion.div>
        );
      case "heading3":
        return (
          <motion.div className="w-full h-full">
            <Heading3 {...commonProps} />
          </motion.div>
        );
      case "heading4":
        return (
          <motion.div className="w-full h-full">
            <Heading4 {...commonProps} />
          </motion.div>
        );
      case "title":
        return (
          <motion.div className="w-full h-full text-black">
            <Title {...commonProps} />
          </motion.div>
        );
      case "paragraph":
        return (
          <motion.div className="w-full h-full text-black">
            <Paragraph {...commonProps} />
          </motion.div>
        );

      case "column":
        if (Array.isArray(content.content)) {
          return (
            <motion.div
              className={cn("w-full h-full flex flex-col", content.className)}
            >
              {content.content.length > 0 ? (
                (content.content as ContentItem[]).map(
                  (subItem: ContentItem, subIndex: number) => (
                    <React.Fragment key={subItem.id || `item=${subItem}`}>
                      {!isPreview &&
                        !subItem.restrictToDrop &&
                        subIndex === 0 &&
                        isEditable && (
                          <DropZoneContent
                            index={0}
                            parentId={content.id}
                            slideId={slideId}
                          />
                        )}
                      <MasterRecursiveComponent
                        content={subItem}
                        onContentChange={onContentChange}
                        isPreview={isPreview}
                        slideId={slideId}
                        index={subIndex}
                        isEditable={isEditable}
                      />
                      {!isPreview && !subItem.restrictToDrop && isEditable && (
                        <DropZoneContent
                          index={subIndex + 1}
                          parentId={content.id}
                          slideId={slideId}
                        />
                      )}
                    </React.Fragment>
                  )
                )
              ) : isEditable ? (
                <DropZoneContent
                  index={0}
                  parentId={content.id}
                  slideId={slideId}
                />
              ) : null}
            </motion.div>
          );
        }
        return null;
      default:
        return null;
    }
  }
);

ContentRenderer.displayName = "ContentRenderer";

export const MasterRecursiveComponent: React.FC<Props> = React.memo(
  ({
    content,
    onContentChange,
    isPreview = false,
    isEditable = true,
    slideId,
    index,
  }: Props) => {
    // Handle different cases based on isPreview
    if (isPreview) {
      return (
        <ContentRenderer
          content={content}
          onContentChange={onContentChange}
          isPreview={isPreview}
          isEditable={isEditable}
          slideId={slideId}
          index={index}
        />
      );
    }

    // Return different component or null when not in preview mode
    return (
      <React.Fragment>
        <ContentRenderer
          content={content}
          onContentChange={onContentChange}
          isPreview={isPreview}
          isEditable={isEditable}
          slideId={slideId}
          index={index}
        />
      </React.Fragment>
    );
  }
);

MasterRecursiveComponent.displayName = "MasterRecursiveComponent";
