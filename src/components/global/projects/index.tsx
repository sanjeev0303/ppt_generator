import { Project } from "@prisma/client";
import React from "react";
import { motion } from "motion/react";
import { containerVariants } from "@/lib/constants";
import ProjectCard from "../project-card";

type Props = {
  projects: Project[];
};

const Projects = ({ projects }: Props) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, id) => (
        <ProjectCard key={id}
        projectId={project?.id}
        title={project?.title}
        createdAt={project?.createdAt.toString()}
        isDelete={project?.isDeleted}
        slideDate={project?.slides}
        themeName={project?.themeName}
        />
      ))}
    </motion.div>
  );
};

export default Projects;
