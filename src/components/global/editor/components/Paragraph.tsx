import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface ParagraphProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  style?: React.CSSProperties;
  isPreview?: boolean;
}

const Paragraph = React.forwardRef<HTMLTextAreaElement, ParagraphProps>(
  ({ className, style, isPreview = false, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea && !isPreview) {
        const adjustHeight = () => {
          textarea.style.height = "0";
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        textarea.addEventListener("input", adjustHeight);
        adjustHeight();
        return () => textarea.removeEventListener("input", adjustHeight);
      }
    }, [isPreview]);

    return (
      <textarea
        className={cn(
          "w-full bg-transparent font-normal text-gray-900 placeholder:text-gray-300 focus:outline-none resize-none overflow-hidden leading-tight",
          `${isPreview ? "text-[0.5rem]" : "text-lg"}`,
          className
        )}
        style={{
            padding: 0,
            margin: 0,
            color: 'inherit',
            boxSizing: "content-box",
            lineHeight: '1.5rem',
            minHeight: "1.5rem",
            ...style,
        }}
        ref={(el) => {
            (textareaRef.current as HTMLTextAreaElement | null) = el

            if (typeof ref === "function") return ref(el)
                else if (ref) ref.current = el
        }}
        readOnly={isPreview}
        {...props}
      />
    );
  }
);

Paragraph.displayName = 'Paragraph'
export default Paragraph;
