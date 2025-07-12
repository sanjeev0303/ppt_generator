"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return { status: 403, error: "No user found" }
    }

    if (!user.id) {
      return { status: 400, error: "User ID is missing" }
    }

    if (!user.emailAddresses || user.emailAddresses.length === 0) {
      return { status: 400, error: "User email is missing" }
    }

    const userExist = await client.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      include: {
        PurchasedProjects: {
          select: {
            id: true,
          },
        },
      },
    })

    if (userExist) {
      return {
        status: 200,
        user: userExist,
      }
    }

    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
        profileImage: user.imageUrl,
      },
    })

    if (newUser) {
      return {
        status: 201,
        user: newUser,
      }
    }

    return { status: 400, error: "Failed to create user" }
  } catch (error) {
    console.error("🔴 onAuthenticateUser ERROR:", error)
    return { status: 500, error: "Internal Server Error" }
  }
}
