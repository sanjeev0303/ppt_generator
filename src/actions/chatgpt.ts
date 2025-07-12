"use server";

import { client } from "@/lib/prisma";
import type { ContentItem, ContentType, Slide } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 } from "uuid";
import { onAuthenticateUser } from "./user";
import { existingLayouts } from "./data/existing-layout";

// Initialize Google GenAI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error(
    "GOOGLE_GENERATIVE_AI_API_KEY environment variable is required"
  );
}
// AI SDK Google model for primary operations
const geminiProModel = google("gemini-1.5-pro");

// Google GenAI model for fallback operations
const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

// Enhanced fallback function with both AI SDK and Google GenAI
async function generateWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4000
): Promise<
  | { success: true; text: string; modelUsed: string }
  | { success: false; error: string }
> {
  const errors: string[] = [];

  // First try: AI SDK Google Gemini 1.5 Pro
  try {
    console.log("🟡 Attempting generation with AI SDK Gemini 1.5 Pro...");
    const startTime = Date.now();

    const result = await generateText({
      model: geminiProModel,
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens,
    });

    const duration = Date.now() - startTime;

    if (result.text && result.text.trim()) {
      console.log(`🟢 Success with AI SDK Gemini 1.5 Pro (${duration}ms)`);
      return {
        success: true,
        text: result.text,
        modelUsed: "AI SDK Gemini 1.5 Pro",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`🔴 AI SDK Gemini 1.5 Pro failed: ${errorMessage}`);
    errors.push(`AI SDK Gemini 1.5 Pro: ${errorMessage}`);
  }

  // Second try: Google GenAI Gemini 2.0 Flash
  try {
    console.log(
      "🟡 Attempting generation with Google GenAI Gemini 2.0 Flash..."
    );
    const startTime = Date.now();

    const prompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
    const result = await geminiFlashModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const duration = Date.now() - startTime;

    if (text && text.trim()) {
      console.log(
        `🟢 Success with Google GenAI Gemini 2.0 Flash (${duration}ms)`
      );
      return {
        success: true,
        text: text,
        modelUsed: "Google GenAI Gemini 2.0 Flash",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`🔴 Google GenAI Gemini 2.0 Flash failed: ${errorMessage}`);
    errors.push(`Google GenAI Gemini 2.0 Flash: ${errorMessage}`);
  }

  console.log("🔴 All Gemini models failed");
  return {
    success: false,
    error: `All Gemini models failed. Errors: ${errors.join("; ")}`,
  };
}

export const generateCreativePrompt = async (userPrompt: string) => {
  const systemPrompt =
    "You are a helpful AI that generates outlines for presentations.";

  const finalPrompt = `Create a coherent and relevant outline for the following prompt: ${userPrompt}.

  The outline should consist of at least 6 points, with each point written as a single sentence. Ensure the outline is well-structured and directly related to the topic. Return the output in the following JSON format:

  {
    "outline": [
      "Point 1",
      "Point 2",
      "Point 3",
      "Point 4",
      "Point 5",
      "Point 6"
    ]
  }

  Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.`;

  try {
    const result = await generateWithFallback(systemPrompt, finalPrompt);

    if (!result.success) {
      return { status: 500, error: result.error };
    }

    const { text, modelUsed } = result;

    if (text) {
      // Remove code block markers if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      try {
        const jsonResponse = JSON.parse(cleanedText);
        console.log(`🟢 Outline generated successfully using ${modelUsed}`);
        return { status: 200, data: jsonResponse, modelUsed };
      } catch (error) {
        return { status: 500, error: "Invalid JSON format received from AI" };
      }
    }

    return { status: 400, error: "No content generated" };
  } catch (error) {
    console.log("🔴 Error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images: ContentItem[] = [];
  if (layout.type === "image") {
    images.push(layout);
  }

  if (Array.isArray(layout.content)) {
    layout.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem));
    });
  }
  return images;
};

const generateImageUrl = async (prompt: string): Promise<string> => {
  try {
    const improvedPrompt = `
    Create a highly realistic, professional image based on the following description. The image should look as if captured in real life, with attention to detail, lighting, and texture.

    Description: ${prompt}

    Important Notes:
    - The image must be in a photorealistic style and visually compelling.
    - Ensure all text, signs, or visible writing in the image are in English.
    - Pay special attention to lighting, shadows, and textures to make the image as lifelike as possible.
    - Avoid elements that appear abstract, cartoonish, or overly artistic. The image should be suitable for professional presentations.
    - Focus on accurately depicting the concept described, including specific objects, environment, mood and context. Maintain relevance to the description provided.

    Example Use Cases: Business presentations, educational slides, professional designs.
    `;

    // Try to generate image description with fallback models
    const result = await generateWithFallback(
      "You are an expert at creating detailed image descriptions for professional presentations.",
      `Create a detailed description for generating an image: ${improvedPrompt}`,
      500
    );

    if (!result.success) {
      console.error("Failed to generate image description:", result.error);
      return "https://via.placeholder.com/1024x1024?text=Placeholder+Image";
    }

    console.log(`🟢 Image description generated using ${result.modelUsed}`);

    // For now, return a placeholder. In a real implementation, you'd use an image generation service
    return "https://via.placeholder.com/1024x1024?text=Generated+Image";
  } catch (error) {
    console.error("Failed to generate image: ", error);
    return "https://via.placeholder.com/1024x1024?text=Placeholder+Image";
  }
};

const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content);
  console.log("Found image components: ", imageComponents.length);

  await Promise.all(
    imageComponents.map(async (component) => {
      console.log("🟢 Generating image for component: ", component.alt)
      component.content = await generateImageUrl(component.alt || "Placeholder Image")
    })
  )
}

export const generateLayoutsJson = async (outlines: string[]) => {
  const systemPrompt =
    "You are a highly creative AI that generates JSON-based layouts for presentations. Always return valid JSON format without any additional text or explanations.";

  const prompt = `
 You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline.

 ## Guidelines:
 1. Write layouts based on the specific outline provided.
 2. Use diverse and engaging designs, ensuring each layout is unique.
 3. Adhere to the structure of existing layouts but add new styles or components if needed.
 4. Fill placeholder data into content fields where required.
 5. Generate unique image placeholders for the 'content' property of image components and alt text according to the outline.
 6. Ensure proper formatting and schema alignment for the output JSON.

 ## Example Layouts:
 ${JSON.stringify(existingLayouts, null, 2)}

 ## Outline Array:
 ${JSON.stringify(outlines)}

 For each entry in the outline array, generate:
 - A unique JSON layout with creative designs.
 - Properly filled content, including placeholder for image components.
 - Clear and well-structured JSON data.
 For Images:
 - The alt text should describe the image clearly and concisely.
 - Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
 - Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
 - Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.

 Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.
 `;

  try {
    console.log("🟢 Generating the layouts with Gemini models...");

    const result = await generateWithFallback(systemPrompt, prompt, 6000);

    if (!result.success) {
      return { status: 500, error: result.error };
    }

    const { text, modelUsed } = result;

    if (!text) {
      return { status: 400, error: "No content generated" };
    }

    let jsonResponse;
    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      jsonResponse = JSON.parse(cleanedText);

      // Process images for each layout
      await Promise.all(jsonResponse.map(replaceImagePlaceholders));

      console.log(`🟢 Layouts generated successfully using ${modelUsed}`);
      return {
        status: 200,
        data: jsonResponse,
        modelUsed,
      };
    } catch (error) {
      console.log("🔴 JSON Parse Error: ", error);
      throw new Error("Invalid JSON format received from AI");
    }
  } catch (error) {
    console.error("🔴 Error: ", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    console.log("🔍 Generating layouts for project ID:", projectId);

    const user = await onAuthenticateUser();

    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }

    const userExist = await client.user.findUnique({
      where: { id: user.user?.id },
    });

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? "User does not have an active subscription"
          : "User not found in the database",
      };
    }

    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      return {
        status: 404,
        error: "Project not found",
      };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return {
        status: 400,
        error: "Project does not have any outlines",
      };
    }

    const layouts = await generateLayoutsJson(project.outlines);

    if (layouts.status !== 200) {
      return layouts;
    }

    await client.project.update({
      where: { id: projectId },
      data: {
        slides: layouts.data,
        themeName: theme,
      },
    });

    return {
      status: 200,
      data: layouts.data,
      message: "Layouts generated successfully",
    };
  } catch (error) {
    console.log("🔴 Error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

// Utility functions for monitoring and testing
export const checkGeminiAvailability = async () => {
  const models = [
    {
      name: "AI SDK Gemini 1.5 Pro",
      available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
    {
      name: "Google GenAI Gemini 2.0 Flash",
      available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    },
  ];

  console.log("🔍 Available Gemini Models:", models);
  return models;
};

export const testGeminiModels = async () => {
  const testPrompt = "Generate a simple greeting message.";
  const systemPrompt = "You are a helpful assistant.";

  const result = await generateWithFallback(systemPrompt, testPrompt, 100);

  if (result.success) {
    console.log(`✅ Gemini models working - Used: ${result.modelUsed}`);
    return {
      status: "success",
      modelUsed: result.modelUsed,
      response: result.text.substring(0, 100) + "...",
    };
  } else {
    console.log(`❌ All Gemini models failed: ${result.error}`);
    return {
      status: "failed",
      error: result.error,
    };
  }
};
