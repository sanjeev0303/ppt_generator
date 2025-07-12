# Technical Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  React 19 + Next.js 15 (App Router)                                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                    │
│  │   Dashboard     │ │   Create Page   │ │   Editor        │                    │
│  │   Components    │ │   Components    │ │   Components    │                    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                    │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        UI Component Layer                                   │ │
│  │  Radix UI + Tailwind CSS + Custom Components                               │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 API LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Next.js Server Actions                                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                    │
│  │   User Actions  │ │ Project Actions │ │  AI Actions     │                    │
│  │   - Auth        │ │ - CRUD          │ │ - Generate      │                    │
│  │   - Profile     │ │ - Management    │ │ - Fallback      │                    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                     │                                │
                     ▼                                ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│         AUTH LAYER              │    │         AI LAYER                │
├─────────────────────────────────┤    ├─────────────────────────────────┤
│  Clerk Authentication           │    │  Google Gemini Models           │
│  ┌─────────────────────────────┐ │    │  ┌─────────────────────────────┐ │
│  │ - User Management           │ │    │  │ - Gemini 1.5 Pro (Primary) │ │
│  │ - Subscription Control     │ │    │  │ - Gemini 2.0 Flash (Backup)│ │
│  │ - Route Protection         │ │    │  │ - Fallback System           │ │
│  │ - Dark Theme Integration   │ │    │  │ - Content Generation        │ │
│  └─────────────────────────────┘ │    │  └─────────────────────────────┘ │
└─────────────────────────────────┘    └─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  PostgreSQL + Prisma ORM                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                    │
│  │   User Model    │ │  Project Model  │ │  Relations      │                    │
│  │   - Profile     │ │  - Slides JSON  │ │  - User → Proj  │                    │
│  │   - Subscription│ │  - Outlines     │ │  - Many-to-Many │                    │
│  │   - Clerk ID    │ │  - Themes       │ │  - Ownership    │                    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow
```
User Login Request
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Clerk Auth    │────│  Next.js API    │────│   Database      │
│   - OAuth       │    │  - Validation   │    │   - User Model  │
│   - JWT Token   │    │  - Session      │    │   - Profile     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Token Stored           Route Protection        User Record
   in Client             Middleware Applied       Created/Updated
```

### 2. Presentation Creation Flow
```
User Prompt Input
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Create Page    │────│   AI Service    │────│   Database      │
│  - Form Input   │    │   - Outline Gen │    │   - Project     │
│  - Validation   │    │   - Layout Gen  │    │   - Outlines    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
  User Customization     AI Processing           Data Persistence
        │                   (Fallback)                  │
        ▼                       │                       ▼
┌─────────────────┐            ▼                ┌─────────────────┐
│  Theme Selection│    ┌─────────────────┐     │  Slide Editor   │
│  - Visual Style │    │  Generated JSON │     │  - Drag & Drop  │
│  - Color Scheme │    │  - Slide Data   │     │  - Live Edit    │
└─────────────────┘    └─────────────────┘     └─────────────────┘
```

### 3. AI Generation Process
```
User Prompt
     │
     ▼
┌─────────────────┐
│ Prompt Analysis │
│ - Topic Extract │
│ - Context Build │
└─────────────────┘
     │
     ▼
┌─────────────────┐    ┌─────────────────┐
│ Gemini 1.5 Pro  │────│   Success?      │────Yes──┐
│ - Primary Model │    │   - Response    │         │
│ - High Quality  │    │   - Validation  │         │
└─────────────────┘    └─────────────────┘         │
     │                          │No                 │
     ▼ Fallback                 ▼                   ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Gemini 2.0 Flash│────│   Success?      │────│  Process Result │
│ - Backup Model  │    │   - Response    │    │  - JSON Parse   │
│ - Fast Response │    │   - Validation  │    │  - Data Clean   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     │                          │No                   │
     ▼ All Failed              ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Error State   │    │   Placeholder   │    │   Return Data   │
│   - Log Error   │    │   - Default     │    │   - Slides JSON │
│   - User Notice │    │   - Template    │    │   - Image URLs  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Page Components Hierarchy
```
App Layout (Root)
├── Authentication Wrapper (Clerk)
├── Theme Provider
└── Route Groups
    ├── (auth)
    │   ├── sign-in/
    │   └── sign-up/
    ├── (protected)
    │   ├── dashboard/
    │   ├── create-page/
    │   ├── templates/
    │   └── presentation/
    │       └── [presentationId]/
    │           ├── editor/
    │           └── select-theme/
    └── (public)
        └── landing page redirect
```

### Component Reusability Structure
```
UI Components (Base Level)
├── Primitives (Radix UI)
│   ├── Button, Input, Dialog
│   ├── Dropdown, Select, Tabs
│   └── Form, Toast, Sidebar
├── Global Components
│   ├── ProjectCard
│   ├── NotFound
│   ├── AppSidebar
│   └── AlertDialog
└── Page-Specific Components
    ├── Dashboard Components
    ├── Editor Components
    └── Creation Components
```

## State Management Architecture

### Zustand Store Structure
```
Global State Store
├── User State
│   ├── Authentication Status
│   ├── Subscription Level
│   └── Profile Information
├── Project State
│   ├── Current Project
│   ├── Project List
│   └── Recent Projects
├── Editor State
│   ├── Selected Slide
│   ├── Editing Mode
│   ├── Slide Order
│   └── Content Changes
└── UI State
    ├── Theme Selection
    ├── Loading States
    └── Error Messages
```

## API Integration Patterns

### Server Actions Pattern
```typescript
// Typical Server Action Structure
export const actionName = async (params: Type) => {
  try {
    // 1. Authentication Check
    const user = await onAuthenticateUser();
    if (!user) return { status: 403, error: "Unauthorized" };
    
    // 2. Input Validation
    if (!params.required) return { status: 400, error: "Missing data" };
    
    // 3. Business Logic
    const result = await businessLogic(params);
    
    // 4. Database Operation
    const dbResult = await client.model.operation(result);
    
    // 5. Success Response
    return { status: 200, data: dbResult };
    
  } catch (error) {
    // 6. Error Handling
    console.error("Action error:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};
```

### Error Handling Strategy
```
Error Flow
├── Client-Side Validation
│   ├── Form Validation (React Hook Form + Zod)
│   ├── Type Checking (TypeScript)
│   └── UI Feedback (Toast Messages)
├── Server-Side Validation
│   ├── Authentication Checks
│   ├── Authorization Verification
│   └── Input Sanitization
├── External Service Errors
│   ├── AI Model Failures (Fallback System)
│   ├── Database Connection Issues
│   └── Network Timeouts
└── Error Recovery
    ├── Automatic Retries
    ├── Graceful Degradation
    └── User Notification
```

This architecture provides a scalable, maintainable structure with clear separation of concerns and robust error handling throughout the application stack.