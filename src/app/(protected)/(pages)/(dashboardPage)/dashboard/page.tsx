"use client"

import { getAllProjects } from "@/actions/project"
import NotFound from "@/components/global/not-found"
import Projects from "@/components/global/projects"
import { UserButton } from "@clerk/nextjs"
import { Suspense, useEffect, useState } from "react"

type Project = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slides: any; // Replace 'any' with 'JsonValue' if you have that type imported
  userId: string;
  outlines: string[];
  isDeleted: boolean;
  isSellable: boolean;
  varientId: string | null;
  thumbnail: string | null;
  themeName: string;
};

type ProjectsResponse =
  | { status: number; error: string; data?: undefined }
  | { status: number; error: string; data: never[] }
  | { status: number; data: Project[]; error?: undefined };

const Dashboard = () => {
  const [projects, setProjects] = useState<ProjectsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const allProjects = await getAllProjects()
        setProjects(allProjects)
      } catch (err) {
        console.error("Dashboard error:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleRetry = () => {
    setError(null)
    setProjects(null)
    setLoading(true)

    getAllProjects()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            There was an error loading your projects. Please try again later.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Handle different response statuses
  if (projects?.status === 403) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please log in to view your projects.
          </p>
        </div>
      </div>
    )
  }

  if (projects?.status === 500) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Server Error
          </h1>
          <p className="text-gray-600">
            There was an error loading your projects. Please try again later.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">All of your work in one place</p>
        </div>
        <UserButton />
      </div>

      <Suspense fallback={<div>Loading projects...</div>}>
        {projects?.data && projects.data.length > 0 ? (
          <Projects projects={projects.data} />
        ) : (
          <NotFound />
        )}
      </Suspense>
    </div>
  )
}

export default Dashboard
