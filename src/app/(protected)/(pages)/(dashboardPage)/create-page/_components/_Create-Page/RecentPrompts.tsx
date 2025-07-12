"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { useCreativeAIStore } from "@/store/useCreativeAiStore";
import { usePromptStore } from "@/store/usePromptStore";

// Ensure Prompt type includes outlines
type Prompt = {
  id: string;
  title: string;
  createdAt: string | Date;
  outlines: any[]; // outlines property is required for this component
};
import { motion } from "motion/react";
import React from "react";
import { toast } from "sonner";

type Props = {};

const RecentPrompts = (props: Props) => {
  const { prompts, setPage } = usePromptStore();
  const { addMultipleOutlines, setCurrentAiPrompt } = useCreativeAIStore();

  const handleEdit = (id: string) => {
    const prompt = prompts.find((prompt) => prompt?.id === id)

    if (prompt) {
        setPage('creative-ai')
        addMultipleOutlines(prompt?.outlines)
        setCurrentAiPrompt(prompt?.title)
    } else {

        toast.error("Error", {
            description: "Prompt not found"
        })
    }
  }

  return (
    <motion.div variants={containerVariants} className="space-y-4 !mt-20">
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-semibold text-center"
      >
        Your Recent Prompts
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="space-y-2 w-full lg:max-w-[80%] mx-auto"
      >
        {prompts.map((prompt, index) => (
        <motion.div
            key={index}
          variants={itemVariants}
        >
          <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors duration-300">
            <div className="max-w-[70%]">
              <h3 className="font-semibold text-xl line-clamp-1">
                {prompt?.title}
              </h3>

              <p className="font-semibold text-sm text-muted-foreground">
                {timeAgo(prompt?.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-vivid">Creative AI</span>

              <Button
                variant={"default"}
                size={"sm"}
                className="rounded-xl bg-slate-600 dark:hover:bg-gray-700 hover:bg-gray-200 text-primary"
                onClick={() => handleEdit(prompt?.id)}
              >
                Edit
              </Button>
            </div>
          </Card>
        </motion.div>
     ))}
      </motion.div>
    </motion.div>
  );
};

export default RecentPrompts;
