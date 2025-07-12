"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreativeAIStore } from "@/store/useCreativeAiStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CardList from "../_Common/CardList";
import { usePromptStore } from "@/store/usePromptStore";
import RecentPrompts from "../_Create-Page/RecentPrompts";
import { toast } from "sonner";
import { generateCreativePrompt } from "@/actions/chatgpt";
import { OutlineCard } from "@/lib/type";
import { v4 } from "uuid";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

const CreateAI = ({ onBack }: Props) => {
  const router = useRouter();

  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    resetOutlines,
    addMultipleOutlines,
    addOutline,
  } = useCreativeAIStore();
  const { setProject } = useSlideStore()
  const [noOfCards, setNoOfCards] = useState(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { prompts, addPrompt } = usePromptStore();

  const handleBack = () => {
    onBack();
  };

  const resetCards = () => {
    setEditingCard(null);
    setSelectedCard(null);
    setEditText("");

    setCurrentAiPrompt("");
    resetOutlines();
  };

  const generateOutline = async () => {
    if (currentAiPrompt === "") {
      toast.error("Error", {
        description: "Please enter a prompt to generate an outline.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateCreativePrompt(currentAiPrompt);

      // Updated to match the correct response structure
      if (res.status === 200 && res?.data?.outline) {
        const cardsData: OutlineCard[] = [];

        // Changed from res.data.outlines to res.data.outline
        res.data.outline.map((outline: string, idx: number) => {
          const newCard = {
            id: v4(),
            title: outline,
            order: idx + 1,
          };
          cardsData.push(newCard);
        });

        addMultipleOutlines(cardsData);
        setNoOfCards(cardsData.length);
        toast.success("Success", {
          description: "Outline generated successfully.",
        });
      } else {
        console.error("API Error:", res);
        toast.error("Error", {
          description:
            res.error || "Failed to generate outline. Please try again.",
        });
      }
    } catch (error) {
      console.error("Generate outline error:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please add at least on card to generate slides",
      });
      return;
    }
    try {
      const res = await createProject(
        currentAiPrompt,
        outlines.slice(0, noOfCards)
      );

      if (res.status !== 200 || !res.data) {
        throw new Error("Unagle to create project")
      }

      router.push(`/presentation/${res.data.id}/select-theme`)
      setProject(res.data)

      addPrompt({
        id: v4(),
        title: currentAiPrompt || outlines?.[0]?.title,
        outlines: outlines,
        createdAt: new Date().toISOString(),
        prompts: outlines.length === 1 ? outlines[0] : []
      })

      toast.success("Success", {
        description: "Project created successfully!"
      })

      setCurrentAiPrompt("")
      resetOutlines()
    } catch (error) {
        console.log(error);
        toast.error("Error", {
            description: "Failed to create project"
        })
    } finally {
        setIsGenerating(false)
    }
  };

  useEffect(() => {
    setNoOfCards(outlines.length);
  }, [outlines.length]);

  return (
    <motion.div
      variants={containerVariants}
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 "
      initial="hidden"
      animate="visible"
    >
      <Button variant={"outline"} onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Generate with <span className="text-vivid">Creative AI</span>
        </h1>

        <p className="text-secondary">What would you like to create today?</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-primary/10 p-4 rounded-xl"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            placeholder="Enter Prompt and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
            required
            value={currentAiPrompt || ""}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Select
              value={noOfCards.toString()}
              onValueChange={(value) => setNoOfCards(parseInt(value))}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    No cards
                  </SelectItem>
                ) : (
                  Array.from(
                    { length: outlines.length },
                    (_, idx) => idx + 1
                  ).map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="font-semibold"
                    >
                      {num} {num === 1 ? "Card" : "Cards"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              variant={"destructive"}
              onClick={resetCards}
              size={"icon"}
              aria-label="Reset cards"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex gap-2 items-center"
          onClick={generateOutline}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            "Generate Outline"
          )}
        </Button>
      </div>

      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={setEditText}
        onCardSelect={setSelectedCard}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        onCardDoublClick={(id, title) => {
          setEditingCard(id);
          setEditText(title);
        }}
      />

      {outlines.length > 0 && (
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      )}

      {prompts?.length > 0 && <RecentPrompts />}
    </motion.div>
  );
};

export default CreateAI;
