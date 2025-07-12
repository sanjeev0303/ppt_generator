"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useId } from "react"
import { usePromptStore } from "@/store/usePromptStore"
import { CreatePage } from "./_Create-Page/CreatePage"
import CreateAI from "./_GenerativeAI/CreateAI"
import ScratchPage from "./_Scratch/ScratchPage"

const RenderPage = () => {
  const router = useRouter()
  const { page, setPage } = usePromptStore()
  const componentId = useId() // Generate unique ID for this component

  const handleBack = () => {
    setPage("create")
  }

  const handleSelectOption = (option: string) => {
    if (option === "template") {
      router.push("/templates")
    } else if (option === "create-scratch") {
      setPage("create-scratch")
    } else {
      setPage("creative-ai")
    }
  }

  const renderStep = () => {
    switch (page) {
      case "create":
        return <CreatePage key={`create-page-${componentId}`} onSelectionOption={handleSelectOption} />
      case "creative-ai":
        return <CreateAI key={`creative-ai-page-${componentId}`} onBack={handleBack} />
      case "create-scratch":
        return <ScratchPage key={`scratch-page-${componentId}`} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${page}-${componentId}`} // Ensure unique key combination
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  )
}

export default RenderPage
