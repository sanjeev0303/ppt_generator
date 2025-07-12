"use client";

import { getProjectById } from "@/actions/project";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EnhancedEditor } from "@/components/Editor";

const PresentationId = () => {
    const params = useParams();
    const { setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const { setSlides, setProject, currentTheme, setCurrentTheme } = useSlideStore();

  useEffect(() => {
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
            if (setCurrentTheme) {
                setCurrentTheme(findTheme || themes[0]);
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
  }, [params.PresentationId, setTheme, setProject, setSlides, setCurrentTheme]);

  if (isLoading) {
    return(
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="h-screen">
      <EnhancedEditor 
        presentationId={params.PresentationId as string}
        isEditable={true}
      />
    </div>
  )
};

export default PresentationId;
