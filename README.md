# Smart Bookmark Manager

A modern, real-time bookmark management application built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication, private bookmark storage, and real-time synchronization across browser tabs.

## 🚀 Live Demo

**Walkthrough Video**: [https://youtu.be/](https://youtu.be/)

## ✨ Features

- **Google OAuth Authentication**: Secure sign-in using Google accounts only
- **Private Bookmarks**: Each user's bookmarks are completely isolated and private
- **Real-time Updates**: Changes sync instantly across all browser tabs and devices
- **Modern UI**: Beautiful, responsive design with glass-morphism effects
- **URL Validation**: Proper URL formatting and validation
- **Fast Performance**: Built with Next.js App Router for optimal performance
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase Realtime subscriptions

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Console project with OAuth configured

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/shamveelp/OnYourMark
cd OnYourMark
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. In Authentication > Providers, enable Google OAuth:
   - Add your Google OAuth client ID and secret
   - Add authorized redirect URLs: `http://localhost:3000/auth/callback` (development)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Authorized origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourprojectid.supabase.co/auth/v1/callback`

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important**: Replace the placeholder values with your actual Supabase project URL and anonymous key from your Supabase dashboard.

### 5. Database Migration

The database schema is automatically created through Supabase migrations. The migration file creates:

- `bookmarks` table with proper RLS (Row Level Security)
- Policies ensuring users can only access their own bookmarks
- Indexes for optimal performance

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page with authentication
│   └── bookmarks/
│       └── page.tsx         # Main bookmarks page
├── components/
│   ├── BookmarkCard.tsx     # Individual bookmark display
│   ├── BookmarkForm.tsx     # Add bookmark form
│   ├── Header.tsx           # App header with user info
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── useAuth.ts           # Authentication logic
│   └── useBookmarks.ts      # Bookmark CRUD and real-time
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── utils.ts             # Utility functions
├── supabase/
│   └── migrations/
│       └── create_bookmarks_table.sql  # Database schema
└── README.md
```

## 🔧 Key Implementation Details

### Authentication Flow
- Uses Supabase Auth with Google OAuth provider
- Redirects to `/bookmarks` after successful authentication
- Automatically redirects to home if not authenticated

### Real-time Updates
- Supabase realtime subscriptions listen for database changes
- Updates are filtered by user ID for security
- Automatic cleanup of subscriptions on component unmount

### Security
- Row Level Security (RLS) policies ensure data isolation
- All database queries are filtered by authenticated user ID
- Google OAuth provides secure authentication without password management

### Database Schema
```sql
bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

## 🐛 Problems Encountered & Solutions

### Problem 1: Real-time Updates Not Working
**Issue**: Bookmarks weren't updating in real-time across tabs.
**Solution**: Implemented proper Supabase realtime subscriptions with user-specific filtering and proper cleanup in useEffect.

### Problem 2: RLS Policies Too Restrictive
**Issue**: Users couldn't access their own bookmarks due to overly restrictive policies.
**Solution**: Created comprehensive RLS policy using `auth.uid() = user_id` for both reading and writing operations.

### Problem 3: Google OAuth Redirect Issues
**Issue**: Authentication redirect wasn't working properly.
**Solution**: Properly configured authorized redirect URIs in Google Cloud Console and Supabase Auth settings.

### Problem 4: Hydration Errors with Auth State
**Issue**: Server-client mismatch during authentication state loading.
**Solution**: Implemented proper loading states and conditional rendering to prevent hydration mismatches.

### Problem 5: URL Validation
**Issue**: Users could submit invalid URLs causing broken links.
**Solution**: Added proper URL validation in the form component and database constraints.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URLs to include your production domain
5. Update Supabase Auth settings with production URLs

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Update OAuth settings accordingly

## 📱 Usage

1. **Sign In**: Click "Sign in with Google" on the homepage
2. **Add Bookmark**: Enter a URL and title, click "Add Bookmark"
3. **View Bookmarks**: All your bookmarks display in a grid layout
4. **Delete Bookmark**: Click the trash icon on any bookmark
5. **Real-time Sync**: Open multiple tabs to see real-time updates

## 🔒 Security Features

- Google OAuth for secure authentication
- Row Level Security (RLS) for data isolation
- HTTPS enforcement for all external requests
- Input validation and sanitization
- Automatic session management

## 🎨 Design Features

- Modern glass-morphism design
- Responsive grid layout
- Smooth animations and transitions
- Loading states for better UX
- Error handling with user feedback
- Mobile-first responsive design

## 📞 Support

For questions or issues, please check:
1. Supabase documentation for auth/database issues
2. Next.js documentation for framework-related questions
3. Google Cloud Console for OAuth setup issues

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.