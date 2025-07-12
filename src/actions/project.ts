"use server";

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./user";
import type { OutlineCard } from "@/lib/type";

export const getAllProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User Not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (projects.length === 0) {
      return { status: 404, error: "No Project Found", data: [] };
    }

    return { status: 200, data: projects };
  } catch (error) {
    console.error("🔴 getAllProjects Error:", error);
    return { status: 500, error: "Internal Server Error", data: [] };
  }
};

export const getRecentProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User Not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    if (projects.length === 0) {
      return { status: 404, error: "No recent projects available", data: [] };
    }

    return { status: 200, data: projects };
  } catch (error) {
    console.error("🔴 getRecentProjects Error:", error);
    return { status: 500, error: "Internal Server Error", data: [] };
  }
};

export const recoverProject = async (projectId: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User Not Authenticated" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
        userId: checkUser.user.id, // Ensure user owns the project
      },
      data: {
        isDeleted: false,
        updatedAt: new Date(),
      },
    });

    if (!updatedProject) {
      return { status: 404, error: "Project not found or failed to recover" };
    }

    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("🔴 recoverProject Error:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User Not Authenticated" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
        userId: checkUser.user.id, // Ensure user owns the project
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    if (!updatedProject) {
      return { status: 404, error: "Project not found or failed to delete" };
    }

    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("🔴 deleteProject Error:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const createProject = async (title: string, outlines: OutlineCard[]) => {
  try {
    if (!title || !outlines || outlines.length === 0) {
      return { status: 400, error: "Title and outlines are required." };
    }

    const allOutlines = outlines.map((outline) => outline.title);

    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const project = await client.project.create({
      data: {
        title,
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: checkUser.user.id,
      },
    });

    if (!project) {
      return { status: 500, error: "Failed to create project" };
    }

    return { status: 200, data: project };
  } catch (error) {
    console.error("🔴 createProject Error:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: checkUser.user.id, // Ensure user owns the project
        isDeleted: false, // Only return non-deleted projects
      },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    return { status: 200, data: project };
  } catch (error) {
    console.error("🔴 getProjectById Error:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};
