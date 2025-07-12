"use client"

import type { OutlineCard } from "@/lib/type"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState, useId, useCallback } from "react"
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
  const dragImageRef = useRef<HTMLElement | null>(null)
  const listId = useId() // Unique ID for this list instance

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (dragImageRef.current && document.body.contains(dragImageRef.current)) {
        document.body.removeChild(dragImageRef.current)
      }
    }
  }, [])

  const generateUniqueId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${crypto.randomUUID()}`
  }, [])

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()

    if (!draggedItem) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const threshold = rect.height / 2

    const newDragOverIndex = y < threshold ? index : index + 1

    if (newDragOverIndex !== dragOverIndex) {
      setDragOverIndex(newDragOverIndex)
    }
  }

  const onAddCard = useCallback(
    (index?: number) => {
      const uniqueId = generateUniqueId()

      const newCard: OutlineCard = {
        id: uniqueId,
        title: editText || "New Card",
        order: 0,
      }

      let updatedCards: OutlineCard[]

      if (index !== undefined) {
        updatedCards = [...outlines.slice(0, index + 1), newCard, ...outlines.slice(index + 1)]
      } else {
        updatedCards = [...outlines, newCard]
      }

      // Update order property for all cards
      const reorderedCards = updatedCards.map((card, idx) => ({
        ...card,
        order: idx + 1,
      }))

      addMultipleOutlines(reorderedCards)
      setEditText("")
    },
    [outlines, editText, addMultipleOutlines, setEditText, generateUniqueId],
  )

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

    if (dragOverIndex === draggedIndex || dragOverIndex === draggedIndex + 1) {
      resetDragState()
      return
    }

    const updatedCards = [...outlines]
    const [removedCard] = updatedCards.splice(draggedIndex, 1)

    let insertIndex = dragOverIndex
    if (dragOverIndex > draggedIndex) {
      insertIndex = dragOverIndex - 1
    }

    insertIndex = Math.max(0, Math.min(insertIndex, updatedCards.length))
    updatedCards.splice(insertIndex, 0, removedCard)

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

  const onCardUpdate = useCallback(
    (id: string, newTitle: string) => {
      const updatedCards = outlines.map((card) => (card.id === id ? { ...card, title: newTitle } : card))
      addMultipleOutlines(updatedCards)
      setEditingCard(null)
      setSelectedCard(null)
      setEditText("")
    },
    [outlines, addMultipleOutlines, setEditingCard, setSelectedCard, setEditText],
  )

  const onCardDelete = useCallback(
    (id: string) => {
      const filteredCards = outlines.filter((card) => card.id !== id)
      const reorderedCards = filteredCards.map((card, index) => ({
        ...card,
        order: index + 1,
      }))

      addMultipleOutlines([...reorderedCards])

      if (editingCard === id) {
        setEditingCard(null)
        setEditText("")
      }
      if (selectedCard === id) {
        setSelectedCard(null)
      }
    },
    [outlines, addMultipleOutlines, editingCard, selectedCard, setEditingCard, setEditText, setSelectedCard],
  )

  const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
    setDraggedItem(card)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dragOffsetY.current = e.clientY - rect.top

    if (dragImageRef.current && document.body.contains(dragImageRef.current)) {
      document.body.removeChild(dragImageRef.current)
    }

    const draggedEl = e.currentTarget.cloneNode(true) as HTMLElement
    draggedEl.style.position = "absolute"
    draggedEl.style.top = "-1000px"
    draggedEl.style.opacity = "0.8"
    draggedEl.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`
    draggedEl.style.transform = "rotate(2deg)"
    document.body.appendChild(draggedEl)
    dragImageRef.current = draggedEl
    e.dataTransfer.setDragImage(draggedEl, 0, dragOffsetY.current)

    setTimeout(() => {
      if (dragImageRef.current && document.body.contains(dragImageRef.current)) {
        document.body.removeChild(dragImageRef.current)
        dragImageRef.current = null
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
      key={`card-list-${listId}`}
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
      <AnimatePresence mode="popLayout">
        {outlines.map((card, index) => (
          <motion.div
            key={`card-wrapper-${card.id}-${index}`} // Ensure unique wrapper key
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Card
              key={`card-${card.id}`} // Unique card key
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

            {!isDragging && (
              <AddCardButton
                key={`add-button-${card.id}-${index}`} // Unique add button key
                onAddCard={() => onAddCard(index)}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <div key={`drop-zone-end-${listId}`} style={getDropZoneStyle()}>
        {!isDragging && (
          <AddCardButton key={`add-button-end-${listId}`} onAddCard={() => onAddCard()} />
        )}
      </div>
    </motion.div>
  )
}

export default CardList
