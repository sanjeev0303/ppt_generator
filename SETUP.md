# Development Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **PostgreSQL**: Version 12 or higher
- **Git**: For version control

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ppt_generator"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"

# Optional: LemonSqueezy (for payments)
LEMONSQUEEZY_API_KEY="your_lemonsqueezy_key"
LEMONSQUEEZY_STORE_ID="your_store_id"
LEMONSQUEEZY_WEBHOOK_SECRET="your_webhook_secret"
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/sanjeev0303/ppt_generator.git
cd ppt_generator
```

### 2. Install Dependencies
```bash
# Install with legacy peer deps due to React 19 compatibility
npm install --legacy-peer-deps
```

### 3. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb ppt_generator

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

#### Option B: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name ppt-postgres \
  -e POSTGRES_DB=ppt_generator \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:13

# Then run migrations as above
```

### 4. Clerk Authentication Setup

1. Visit [Clerk Dashboard](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys
4. Configure the sign-in/sign-up URLs as shown in env variables
5. Enable the authentication methods you want (email, OAuth, etc.)

### 5. Google AI API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your environment variables
4. Ensure you have access to Gemini models

## Development Commands

### Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Database Operations
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Common Issues & Solutions

### 1. Build Fails with Google Fonts Error
**Issue**: `Failed to fetch 'Geist' from Google Fonts`

**Solution**: 
- Check internet connectivity
- Or modify `src/app/layout.tsx` to use local fonts:

```typescript
// Replace Google Fonts import with local fonts
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
})
```

### 2. Dependency Conflicts
**Issue**: React 19 peer dependency warnings

**Solution**: Always use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### 3. Database Connection Issues
**Issue**: Prisma can't connect to database

**Solutions**:
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `createdb ppt_generator`
- Test connection: `npx prisma db push`

### 4. Clerk Authentication Issues
**Issue**: Authentication redirects not working

**Solutions**:
- Verify all Clerk environment variables are set
- Check Clerk dashboard for correct URLs
- Ensure domain is added in Clerk settings for production

### 5. AI Generation Fails
**Issue**: AI models return errors

**Solutions**:
- Verify Google AI API key is valid
- Check API quota/billing in Google Cloud Console
- Test with simple prompts first
- Review fallback system logs

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev

# Lint and fix issues
npm run lint

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Database Changes
```bash
# Modify schema.prisma
# Then create migration
npx prisma migrate dev --name your_migration_name

# Update types
npx prisma generate
```

### 3. Component Development
- Follow existing patterns in `/src/components`
- Use TypeScript for all components
- Implement proper error boundaries
- Add loading states
- Follow accessibility guidelines

## Testing Guidelines

### Manual Testing Checklist
- [ ] User registration/login works
- [ ] Dashboard loads projects correctly
- [ ] Create new presentation flow works
- [ ] AI generation produces valid results
- [ ] Slide editor functions properly
- [ ] Theme selection applies correctly
- [ ] Project saving/loading works

### Performance Testing
- Check bundle size: `npm run build`
- Test with large presentations
- Monitor database query performance
- Test AI response times

## Deployment

### Vercel Deployment (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure PostgreSQL database (Neon, Supabase, etc.)
4. Deploy with automatic builds on push

### Environment-Specific Considerations
- **Development**: Use local database, test API keys
- **Staging**: Use staging database, test environment variables
- **Production**: Use production database, real API keys, monitoring

## Troubleshooting

### Debug Mode
Enable verbose logging by adding to `.env.local`:
```bash
DEBUG=true
NODE_ENV=development
```

### Common Error Patterns
- **500 errors**: Check server logs and database connectivity
- **403 errors**: Verify authentication and authorization
- **AI errors**: Check API keys and quota limits
- **Build errors**: Review dependency versions and environment

### Performance Monitoring
- Use React DevTools for component performance
- Monitor database queries with Prisma Studio
- Check AI response times in server logs
- Use Vercel Analytics for production monitoring

For additional help, check the repository issues or create a new issue with detailed error information.