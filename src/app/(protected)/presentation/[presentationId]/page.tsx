"use client";

import { getProjectById } from "@/actions/project";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Navbar from "./_components/Navbar/Navbar";
import LayoutPreview from "./_components/editor-sidebar/left-sidebar/LayoutPreview";
import Editor from "./_components/editor/Editor";

const PresentationId = () => {
    // WIP: create the presentation view
    const params = useParams();
    const { setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const { setSlides, setProject, currentTheme,  } =
      useSlideStore();

  useEffect(() => {
    // iffe function
    (async () => {
        try {
            const res = await getProjectById(params.PresentationId as string)
            if (res.status !== 200 || !res.data) {
                toast.error("Error", {
                    description: "Unable to fetch project"
                })
                redirect("/dashboard")
            }

            const findTheme = themes.find((theme) => theme.name === res.data.themeName)

            setTheme(findTheme?.type === "dark"? "dark" : "light")
            if (typeof useSlideStore.getState().setCurrentTheme === "function") {
                useSlideStore.getState().setCurrentTheme(findTheme || themes[0]);
            }
            setProject(res.data)
            setSlides(JSON.parse(JSON.stringify(res.data.slides)))
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occured."
            })
        } finally {
            setIsLoading(false)
        }
    })()
  }, []);

  if (isLoading) {
    return(
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen flex flex-col">
            <Navbar presentationId={params.PresentationId as string} />

            <div className="flex-1 flex overflow-hidden pt-16"
            style={{
               color: currentTheme?.accentColor,
               fontFamily: currentTheme?.fontFamily,
                backgroundColor: currentTheme?.backgroundColor,
            }}
            >
               <LayoutPreview />
               <div className="flex-1 ml-64 pr-16">
                <Editor isEditable={true} />
               </div>
            </div>
        </div>
    </DndProvider>
  )
};

export default PresentationId;
