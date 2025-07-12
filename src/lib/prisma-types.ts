// Temporary type definitions for Prisma models
// These should be replaced with proper Prisma types once the client is working

export interface Project {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slides?: any;
  userId: string;
  outlines: string[];
  isDeleted: boolean;
  isSellable: boolean;
  varientId?: string | null;
  thumbnail?: string | null;
  themeName: string;
}

export interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  profileImage?: string | null;
  subscription?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  lemonSqueezyApiKey?: string | null;
  storeId?: string | null;
  webhookSecret?: string | null;
}