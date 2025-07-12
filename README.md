# Vivid-AI Powered PPT Generator

An intelligent presentation generator that transforms your ideas into professional slide decks using advanced AI technology. Built with Next.js 15, React 19, and Google Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.4.0-green)

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Generate comprehensive presentations from simple prompts
- 🎨 **Professional Themes** - Multiple customizable presentation themes
- ✏️ **Rich Editor** - Drag-and-drop slide editor with real-time preview
- 🔐 **Secure Authentication** - Clerk-based authentication with subscription management
- 📊 **Project Management** - Dashboard to organize and manage all presentations
- 🌙 **Dark Mode** - Consistent dark theme throughout the application
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices

## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Google Gemini AI
- Clerk Authentication

**Additional Tools:**
- Zustand (State Management)
- React DnD (Drag & Drop)
- React Hook Form
- Framer Motion

## 📖 Documentation

For comprehensive information about this project, please refer to our detailed documentation:

- **[📋 Repository Analysis](./REPOSITORY_ANALYSIS.md)** - Complete technical overview and feature analysis
- **[🏗️ Architecture Guide](./ARCHITECTURE.md)** - System architecture, data flow, and component structure  
- **[⚙️ Setup Guide](./SETUP.md)** - Step-by-step development environment setup
- **[📝 Context Summary](./CONTEXT_SUMMARY.md)** - High-level project overview and business context

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Google AI API Key
- Clerk Authentication Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjeev0303/ppt_generator.git
   cd ppt_generator
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ppt_generator"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"
```

For a complete list of environment variables, see the [Setup Guide](./SETUP.md).

## 📁 Project Structure

```
src/
├── actions/           # Server actions for API operations
├── app/               # Next.js app router pages
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
├── provider/          # Context providers
└── store/             # State management
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Google AI](https://ai.google.dev) for powerful AI capabilities
- [Clerk](https://clerk.com) for seamless authentication
- [Prisma](https://prisma.io) for database management
- [Radix UI](https://radix-ui.com) for accessible components

## 📞 Support

If you have any questions or need help with setup, please:
- Check our [Setup Guide](./SETUP.md)
- Open an issue on GitHub
- Review the [Architecture Guide](./ARCHITECTURE.md) for technical details

---

Built with ❤️ using modern web technologies
