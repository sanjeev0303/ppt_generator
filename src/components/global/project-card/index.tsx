"use client";

import { deleteProject, recoverProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import { JsonValue } from "@prisma/client/runtime/library";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AlertDialogBox from "../alert-dialog-box";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  isDelete?: boolean;
  slideDate?: JsonValue;
  themeName?: string;
};

const ProjectCard = ({
  projectId,
  title,
  createdAt,
  isDelete,
  slideDate,
  themeName,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { setSlides } = useSlideStore();
  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideDate)));
    router.push(`/presentation/${projectId}`);
  };

  const theme = themes.find((theme) => theme.name === themeName) || themes[0];

  const handleRecover = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Error", {
        description: "Project not found.",
      });

      return;
    }

    try {
        const res = await recoverProject(projectId)
        if (res.status !== 200 ) {
            toast.error("Oops!", {
                description: res.error || "Something went wrong."
            })
            return
        }

        setOpen(false)
        router.refresh()
        toast.success("Success", {
            description: "Project recovered successfully.",
        })

    } catch (error) {
        console.error("�� Error", error);
        toast.error("Failed to recover project", {
            description: "Please try again.",
        });
        setLoading(false);
    }
  };


  const handleDelete = async() => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast.error("Error", {
        description: "Project not found.",
      });

      return;
    }

    try {
        const res = await deleteProject(projectId)
        if (res.status !== 200 ) {
            toast.error("Oops!", {
                description: res.error || "Failed to delete project."
            })
            return
        }

        setOpen(false)
        router.refresh()
        toast.success("Success", {
            description: "Project deleted successfully.",
        })

    } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project", {
            description: "Please try again.",
        });
        setLoading(false)
    }
  }

const  itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      duration: 0.3,
      stiffness: 100,
    },
  },
};

  return (
    <motion.div
      variants={itemVariants}
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDelete && "hover:bg-muted/50"
      }`}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
        onClick={handleNavigation}
      >
        {/* <ThumnailPreview
          theme={theme}
          //   slide={JSON.parse(JSON.stringify(slideDate))?.[0]}
        /> */}
      </div>

      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title}
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>

            {isDelete ? (
            <AlertDialogBox
              description="This will recover your project and restore your data."
              className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
              loading={loading}
              open={open}
              onClick={handleRecover}
              handleOpen={() => setOpen(!open)}
            >
              <Button
                size={"sm"}
                variant={"ghost"}
                className="bg-background-80 dark:hover:bg-background-90"
                disabled={loading}
              >
                Recover
              </Button>
            </AlertDialogBox>
             ) : (
                <AlertDialogBox
                description="This will delete your project and send to trash"
                className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                loading={loading}
                open={open}
                onClick={handleDelete}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="bg-background-80 dark:hover:bg-background-90"
                  disabled={loading}
                >
                  Delete
                </Button>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
