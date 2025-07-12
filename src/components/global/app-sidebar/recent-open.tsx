"use client"

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSlideStore } from "@/store/useSlideStore";
import type { Project } from "@/lib/prisma-types";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner"

type Props = {
  recentProjects: Project[];
};

const RecentOpen = ({ recentProjects }: Props) => {

const router = useRouter()
const { setSlides } = useSlideStore()

    const handleClick = (projectId: string, slides: JsonValue ) => {

        if (!projectId || !slides) {
            toast.error("Project not found", {
                description: "Please try again"
            })

        }

        setSlides(JSON.parse(JSON.stringify(slides)))
        router.push(`/presentation/${projectId}`)

    }

  return recentProjects.length > 0 ? (
    <SidebarGroup>
      <SidebarGroupLabel className="text-2xl font-semibold">Recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects.length > 0
          ? recentProjects.map((item, index) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`hover:bg-primary-80`}
                >
                  <Button
                    variant={"link"}
                    className={`text-xs items-center justify-start`}
                    onClick={() => handleClick(item.id, item.slides)}
                  >
                    <span>{item.title}</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : ""}
      </SidebarMenu>
    </SidebarGroup>
  ) : (
    ""
  );
};

export default RecentOpen;
