"use client"

import { useState, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Props = {
  onAddCard: () => void
  index?: number // Add index to make each button unique
}

const AddCardButton = ({ onAddCard, index }: Props) => {
  const [showGap, setShowGap] = useState(false)
  const uniqueId = useId() // Generate unique ID for this component instance

  return (
    <motion.div
      key={`add-card-button-${index}-${uniqueId}`} // Ensure unique key
      className="w-full relative overflow-hidden"
      initial={{ height: "0.5rem" }}
      animate={{
        height: showGap ? "2.5rem" : "0.5rem",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      onHoverStart={() => setShowGap(true)}
      onHoverEnd={() => setShowGap(false)}
    >
      <AnimatePresence>
        {showGap && (
          <motion.div
            key={`gap-${index}-${uniqueId}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[90%] flex items-center justify-center relative">
              {/* Line */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[2px] bg-primary/30 rounded-full" />
              </div>

              {/* Button */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 bg-background border-primary/50 hover:bg-primary hover:text-primary-foreground shadow-md z-10"
                onClick={onAddCard}
                aria-label="Add new card"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AddCardButton
