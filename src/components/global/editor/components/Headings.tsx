"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useCallback } from "react"

interface HeadingProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  styles?: React.CSSProperties
  isPreview?: boolean
}

const createHeading = (displayName: string, defaultClassName: string, previewClassName: string, ariaLevel: number) => {
  const Heading = React.forwardRef<HTMLTextAreaElement, HeadingProps>(
    ({ children, styles, isPreview = false, className, ...props }, ref) => {
      const textareaRef = useRef<HTMLTextAreaElement>(null)

      const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current
        if (textarea && !isPreview) {
          textarea.style.height = "auto"
          textarea.style.height = `${Math.max(textarea.scrollHeight, 40)}px`
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

      const combinedClassName = isPreview ? previewClassName : defaultClassName

      return (
        <textarea
          className={cn(
            "w-full bg-transparent font-semibold text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-transparent",
            "resize-none overflow-hidden leading-tight transition-colors duration-200",
            "border-none p-0 m-0",
            combinedClassName,
            className,
          )}
          style={{
            color: "inherit",
            boxSizing: "content-box",
            minHeight: isPreview ? "auto" : "40px",
            ...styles,
          }}
          ref={(el) => {
            textareaRef.current = el
            if (typeof ref === "function") ref(el)
            else if (ref) ref.current = el
          }}
          readOnly={isPreview}
          role="textbox"
          aria-level={ariaLevel}
          aria-multiline="true"
          spellCheck="true"
          {...props}
        />
      )
    },
  )
  Heading.displayName = displayName
  return Heading
}

// Enhanced heading components with better typography and preview scaling
export const Heading1 = createHeading("Heading1", "text-4xl font-bold", "text-lg font-bold", 1)
export const Heading2 = createHeading("Heading2", "text-3xl font-bold", "text-base font-bold", 2)
export const Heading3 = createHeading("Heading3", "text-2xl font-semibold", "text-sm font-semibold", 3)
export const Heading4 = createHeading("Heading4", "text-xl font-semibold", "text-xs font-semibold", 4)
export const Title = createHeading("Title", "text-5xl font-black", "text-xl font-black", 1)
