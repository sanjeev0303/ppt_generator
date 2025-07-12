"use client";

import { EnhancedEditor } from "@/components/Editor";
import { useSlideStore } from "@/store/useSlideStore";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Mock slide data for demonstration
const mockSlides = [
  {
    id: uuidv4(),
    slideName: "Welcome Slide",
    type: "title",
    slideOrder: 1,
    content: {
      id: uuidv4(),
      type: "heading1" as const,
      name: "Main Title",
      content: "Enhanced Presentation Editor",
      className: "text-4xl font-bold text-center py-20"
    }
  },
  {
    id: uuidv4(),
    slideName: "Features Overview",
    type: "content",
    slideOrder: 2,
    content: {
      id: uuidv4(),
      type: "text" as const,
      name: "Features Content",
      content: "Drag and drop elements, advanced editing tools, real-time collaboration, and much more!",
      className: "text-lg p-8"
    }
  }
];

const mockProject = {
  id: "demo-project-1",
  title: "Demo Presentation",
  createdAt: new Date(),
  updatedAt: new Date(),
  slides: mockSlides,
  userId: "demo-user",
  outlines: ["Introduction", "Features", "Demo"],
  isDeleted: false,
  isSellable: false,
  varientId: null,
  thumbnail: null,
  themeName: "light"
};

export default function DemoEditorPage() {
  const { setProject, setSlides, setCurrentTheme } = useSlideStore();

  useEffect(() => {
    // Initialize demo data
    setProject(mockProject);
    setSlides(mockSlides);
    setCurrentTheme({
      name: "Demo Theme",
      fontFamily: "'Inter', sans-serif",
      fontColor: "#333333",
      backgroundColor: "#f8fafc",
      slideBackgroundColor: "#ffffff",
      accentColor: "#3b82f6",
      type: "light"
    });
  }, [setProject, setSlides, setCurrentTheme]);

  return (
    <div className="h-screen w-full">
      <EnhancedEditor 
        presentationId="demo-presentation"
        isEditable={true}
      />
    </div>
  );
}