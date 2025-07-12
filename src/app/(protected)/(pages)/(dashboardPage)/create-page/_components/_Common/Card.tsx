"use client"

import type { OutlineCard } from "@/lib/type"
import type React from "react"
import { useRef, useEffect, useId } from "react"
import { motion } from "framer-motion"
import { Card as UICard } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"

type Props = {
  card: OutlineCard
  isEditing: boolean
  isSelected: boolean
  editText: string
  onEditChange: (value: string) => void
  onEditBlur: () => void
  onEditKeyDown: (e: React.KeyboardEvent) => void
  onCardClick: () => void
  onCardDoubleClick: () => void
  onDeleteClick: () => void
  draagHandlers: {
    onDragStart: (e: React.DragEvent) => void
    onDragEnd: () => void
  }
  onDragOver: (e: React.DragEvent) => void
  dragOverStyles: React.CSSProperties
}

const Card = ({
  card,
  isEditing,
  isSelected,
  editText,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onCardClick,
  onCardDoubleClick,
  onDeleteClick,
  draagHandlers,
  onDragOver,
  dragOverStyles,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const cardId = useId() // Generate unique ID for this card instance

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  return (
    <motion.div
      key={`card-motion-${card.id}-${cardId}`} // Ensure unique motion key
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
      className="relative"
    >
      <div draggable={!isEditing} style={dragOverStyles} onDragOver={onDragOver} {...draagHandlers}>
        <UICard
          className={`p-4 cursor-grab active:cursor-grabbing bg-primary-90 transition-all duration-200 ${
            isEditing || isSelected ? "border-primary bg-transparent ring-2 ring-primary/20" : ""
          } ${dragOverStyles.opacity ? "opacity-50" : ""}`}
          onClick={onCardClick}
          onDoubleClick={onCardDoubleClick}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical className="h-4 w-4" />
              </div>

              <span
                className={`text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary min-w-[2rem] text-center ${
                  isEditing || isSelected ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {card.order}
              </span>

              <div className="flex-1">
                {isEditing ? (
                  <Input
                    key={`input-${card.id}-${cardId}`} // Unique input key
                    ref={inputRef}
                    value={editText}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onEditBlur}
                    onKeyDown={onEditKeyDown}
                    className="text-base sm:text-lg border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent"
                    placeholder="Enter card title..."
                  />
                ) : (
                  <span className="text-base sm:text-lg font-medium">{card.title}</span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick()
              }}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label={`Delete card ${card.order}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </UICard>
      </div>
    </motion.div>
  )
}

export default Card
