"use client"
import type { OutlineCard } from "@/lib/type"
import { motion, AnimatePresence } from "motion/react"
import React, { useRef, useState } from "react"
import Card from "./Card"
import AddCardButton from "./AddCardButton"

type Props = {
  outlines: OutlineCard[]
  editingCard: string | null
  selectedCard: string | null
  editText: string
  addOutline?: (card: OutlineCard) => void
  onEditChange: (value: string) => void
  onCardSelect: (id: string) => void
  onCardDoublClick: (id: string, title: string) => void
  setEditText: (value: string) => void
  setEditingCard: (id: string | null) => void
  setSelectedCard: (id: string | null) => void
  addMultipleOutlines: (card: OutlineCard[]) => void
}

const CardList = ({
  outlines,
  editingCard,
  selectedCard,
  editText,
  addOutline,
  onEditChange,
  onCardSelect,
  onCardDoublClick,
  setEditText,
  setEditingCard,
  setSelectedCard,
  addMultipleOutlines,
}: Props) => {
  const [draggedItem, setDraggedItem] = useState<OutlineCard | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetY = useRef<number>(0)

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()

    if (!draggedItem) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const threshold = rect.height / 2

    // Improved drag-over calculation
    const newDragOverIndex = y < threshold ? index : index + 1

    // Only update if the index actually changed
    if (newDragOverIndex !== dragOverIndex) {
      setDragOverIndex(newDragOverIndex)
    }
  }

  const onAddCard = (index?: number) => {
    // Generate a truly unique ID using timestamp + random string
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCard: OutlineCard = {
      id: uniqueId,
      title: editText || "New Card",
      order: 0, // Will be set correctly below
    }

    let updatedCards: OutlineCard[]

    if (index !== undefined) {
      // Insert after the specified index
      updatedCards = [...outlines.slice(0, index + 1), newCard, ...outlines.slice(index + 1)]
    } else {
      // Add to the end
      updatedCards = [...outlines, newCard]
    }

    // Update order property for all cards - this is the key fix
    const reorderedCards = updatedCards.map((card, idx) => ({
      ...card,
      order: idx + 1,
    }))

    addMultipleOutlines(reorderedCards)
    setEditText("")
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem || dragOverIndex === null) {
      resetDragState()
      return
    }

    const draggedIndex = outlines.findIndex((card) => card.id === draggedItem.id)

    if (draggedIndex === -1) {
      resetDragState()
      return
    }

    // Don't do anything if dropping in the same position
    if (dragOverIndex === draggedIndex || dragOverIndex === draggedIndex + 1) {
      resetDragState()
      return
    }

    const updatedCards = [...outlines]
    const [removedCard] = updatedCards.splice(draggedIndex, 1)

    // Calculate the correct insertion index
    let insertIndex = dragOverIndex
    if (dragOverIndex > draggedIndex) {
      insertIndex = dragOverIndex - 1
    }

    // Ensure insertIndex is within bounds
    insertIndex = Math.max(0, Math.min(insertIndex, updatedCards.length))

    updatedCards.splice(insertIndex, 0, removedCard)

    // Update order property for all cards - critical for proper indexing
    const reorderedCards = updatedCards.map((card, index) => ({
      ...card,
      order: index + 1,
    }))

    addMultipleOutlines(reorderedCards)
    resetDragState()
  }

  const resetDragState = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
    setIsDragging(false)
  }

  const onCardUpdate = (id: string, newTitle: string) => {
    const updatedCards = outlines.map((card) => (card.id === id ? { ...card, title: newTitle } : card))

    addMultipleOutlines(updatedCards)

    setEditingCard(null)
    setSelectedCard(null)
    setEditText("")
  }

  const onCardDelete = (id: string) => {
    const filteredCards = outlines.filter((card) => card.id !== id)

    // Update order property for remaining cards - this ensures proper indexing after deletion
    const reorderedCards = filteredCards.map((card, index) => ({
      ...card,
      order: index + 1,
    }))

    addMultipleOutlines(reorderedCards)

    // Clear any editing state if the deleted card was being edited
    if (editingCard === id) {
      setEditingCard(null)
      setEditText("")
    }
    if (selectedCard === id) {
      setSelectedCard(null)
    }
  }

  const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
    setDraggedItem(card)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffsetY.current = e.clientY - rect.top

    // Create drag image
    const draggedEl = e.currentTarget.cloneNode(true) as HTMLElement
    draggedEl.style.position = "absolute"
    draggedEl.style.top = "-1000px"
    draggedEl.style.opacity = "0.8"
    draggedEl.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`
    draggedEl.style.transform = "rotate(2deg)"
    document.body.appendChild(draggedEl)
    e.dataTransfer.setDragImage(draggedEl, 0, dragOffsetY.current)

    setTimeout(() => {
      if (document.body.contains(draggedEl)) {
        document.body.removeChild(draggedEl)
      }
    }, 0)
  }

  const onDragEnd = () => {
    resetDragState()
  }

  const getDragOverStyle = (cardIndex: number) => {
    if (dragOverIndex === null || draggedItem === null || !isDragging) {
      return {}
    }

    const draggedIndex = outlines.findIndex((card) => card.id === draggedItem.id)

    // Don't show drop indicator on the dragged item itself
    if (cardIndex === draggedIndex) {
      return { opacity: 0.5 }
    }

    if (cardIndex === dragOverIndex) {
      return {
        borderTop: "3px solid #3b82f6",
        marginTop: "0.75rem",
        transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }
    } else if (dragOverIndex !== null && cardIndex === dragOverIndex - 1) {
      return {
        borderBottom: "3px solid #3b82f6",
        marginBottom: "0.75rem",
        transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }
    }

    return {}
  }

  const getDropZoneStyle = () => {
    if (dragOverIndex === outlines.length && isDragging) {
      return {
        borderTop: "3px solid #3b82f6",
        marginTop: "0.75rem",
        paddingTop: "0.75rem",
      }
    }
    return {}
  }

  return (
    <motion.div
      className="space-y-2 -my-2"
      layout
      onDragOver={(e) => {
        e.preventDefault()
        if (isDragging && (outlines.length === 0 || e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20)) {
          setDragOverIndex(outlines.length)
        }
      }}
      onDrop={onDrop}
    >
      <AnimatePresence>
        {outlines.map((card, index) => (
          <React.Fragment key={`card-fragment-${card.id}`}>
            <Card
              key={`card-${card.id}`}
              onDragOver={(e) => onDragOver(e, index)}
              card={card}
              isEditing={editingCard === card.id}
              isSelected={selectedCard === card.id}
              editText={editText}
              onEditChange={onEditChange}
              onEditBlur={() => onCardUpdate(card.id, editText)}
              onEditKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCardUpdate(card.id, editText)
                }
                if (e.key === "Escape") {
                  setEditingCard(null)
                  setEditText("")
                }
              }}
              onCardClick={() => onCardSelect(card.id)}
              onCardDoubleClick={() => onCardDoublClick(card.id, card.title)}
              onDeleteClick={() => onCardDelete(card.id)}
              draagHandlers={{
                onDragStart: (e) => onDragStart(e, card),
                onDragEnd: onDragEnd,
              }}
              dragOverStyles={getDragOverStyle(index)}
            />

            {/* Only show AddCardButton when not dragging to avoid interference */}
            {!isDragging && (
              <AddCardButton
                key={`add-button-${card.id}-${index}`}
                onAddCard={() => onAddCard(index)}
              />
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Drop zone at the end */}
      <div key="drop-zone-end" style={getDropZoneStyle()}>
        {/* Add card button at the end - always visible when not dragging */}
        {!isDragging && (
          <AddCardButton
            key="add-button-end"
            onAddCard={() => onAddCard()}
          />
        )}
      </div>
    </motion.div>
  )
}

export default CardList
