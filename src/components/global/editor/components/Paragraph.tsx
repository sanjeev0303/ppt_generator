"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useCallback } from "react"

interface ParagraphProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  style?: React.CSSProperties
  isPreview?: boolean
}

const Paragraph = React.forwardRef<HTMLTextAreaElement, ParagraphProps>(
  ({ className, style, isPreview = false, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && !isPreview) {
        textarea.style.height = "auto"
        textarea.style.height = `${Math.max(textarea.scrollHeight, 60)}px`
      }
    }, [isPreview])

    useEffect(() => {
      const textarea = textareaRef.current
      if (textarea && !isPreview) {
        textarea.addEventListener("input", adjustHeight)
        adjustHeight()
        return () => textarea.removeEventListener("input", adjustHeight)
      }
    }, [isPreview, adjustHeight])

    return (
      <textarea
        className={cn(
          "w-full bg-transparent font-normal text-gray-800 dark:text-gray-200",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-transparent",
          "resize-none overflow-hidden leading-relaxed transition-colors duration-200",
          "border-none p-0 m-0",
          isPreview ? "text-xs leading-tight" : "text-base leading-relaxed",
          className,
        )}
        style={{
          color: "inherit",
          boxSizing: "content-box",
          minHeight: isPreview ? "auto" : "60px",
          lineHeight: isPreview ? "1.3" : "1.6",
          ...style,
        }}
        ref={(el) => {
          textareaRef.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) ref.current = el
        }}
        readOnly={isPreview}
        role="textbox"
        aria-multiline="true"
        spellCheck="true"
        {...props}
      />
    )
  },
)

Paragraph.displayName = "Paragraph"
export default Paragraph
