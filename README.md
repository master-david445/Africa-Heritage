# African Heritage Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/macaulaydavid88-8711s-projects/v0-african-heritage-platform-2f)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Built with Supabase](https://img.shields.io/badge/Built%20with-Supabase-black?style=for-the-badge&logo=supabase)](https://supabase.com/)

## Overview

African Heritage is a comprehensive platform dedicated to preserving, sharing, and celebrating African proverbs and wisdom. The platform serves as a digital bridge connecting generations and cultures through the timeless wisdom encapsulated in African proverbs. Users can explore, contribute, and engage with proverbs from across the African continent, fostering cultural understanding and appreciation.

The platform operates as a Q&A-style community where users pose questions about proverb meanings and receive insights from fellow community members. This interactive approach transforms passive proverb browsing into an active learning experience.

## Features

### Core Functionality

- **Proverb Exploration**: Browse proverbs organized by featured, trending, and popular categories
- **Q&A System**: Ask and answer questions about proverb meanings and interpretations
- **Community Engagement**: Like, comment, bookmark, and follow proverbs and users
- **Collections**: Create and manage personal collections of favorite proverbs
- **Search & Discovery**: Advanced search functionality to find specific proverbs or topics
- **Gamification**: Points system with badges and leaderboard for community participation
- **User Profiles**: Comprehensive profiles showcasing contributions and achievements
- **Social Features**: Follow users, view activity feeds, and receive notifications

### Administrative Features

- **Content Moderation**: Admin panel for managing users, content, and platform health
- **Analytics Dashboard**: Insights into platform usage and community engagement
- **Content Verification**: Mark proverbs as verified for authenticity
- **User Management**: Suspend accounts, manage permissions, and oversee community

### Technical Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live notifications and activity feeds
- **Offline Support**: Progressive Web App capabilities for offline proverb access
- **Accessibility**: WCAG-compliant design with screen reader support
- **Multi-language Support**: Support for multiple African languages and translations

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom design system
- **UI Components**: Radix UI primitives with custom theming
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with Zod validation

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password and social providers
- **Real-time**: Supabase Realtime for live updates
- **File Storage**: Supabase Storage for user avatars and proverb media

### Development Tools
- **Build Tool**: Next.js built-in bundler
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: pnpm
- **Deployment**: Vercel with automatic deployments
- **Analytics**: Vercel Analytics for usage tracking

### Key Libraries
- **UI Framework**: Radix UI for accessible components
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Toast Notifications**: Sonner for user feedback
- **Form Validation**: Zod for schema validation

## Layout and Design

### Color Scheme
The platform employs a warm, culturally-inspired color palette drawing from African heritage:

- **Primary Colors**: Terracotta orange (`oklch(0.55 0.25 35)`), warm brown (`oklch(0.45 0.12 45)`), deep green (`oklch(0.35 0.15 140)`)
- **Accent Colors**: Gold accent (`oklch(0.75 0.18 85)`) for highlights and CTAs
- **Neutral Colors**: Light beige (`oklch(0.95 0.02 70)`) for backgrounds and text
- **Semantic Colors**: Orange for primary actions, red for destructive actions, blue for secondary actions

### Typography
- **Primary Font**: Montserrat (sans-serif) for UI elements and body text
- **Display Font**: Playfair Display (serif) for headings and proverb quotes
- **Responsive Scaling**: Fluid typography using `clamp()` for optimal readability across devices
- **Hierarchy**: Structured text scales from display headings to captions

### Cultural Design Elements
- **Patterns**: Adinkra-inspired dot patterns, Kente-inspired stripes, Mud cloth geometric designs
- **Animations**: Subtle fade-in effects, parallax scrolling on landing page, pulse glows for interactive elements
- **Visual Metaphors**: Earth tones representing African soil, gold accents symbolizing cultural wealth

### Responsive Design
- **Mobile-First**: Designed for mobile devices with progressive enhancement
- **Breakpoints**: Tailwind's responsive prefixes (sm:, md:, lg:, xl:) for adaptive layouts
- **Grid Systems**: CSS Grid and Flexbox for flexible, content-driven layouts
- **Touch-Friendly**: Adequate touch targets and gesture support

### Wireframes

#### Landing Page Wireframe
```
┌─────────────────────────────────────────────────┐
│ [Header: Logo + Navigation]                     │
├─────────────────────────────────────────────────┤
│                                                 │
│          [Hero Section]                         │
│    ┌─────────────────────────────────────┐      │
│    │  African Heritage Logo              │      │
│    │  "Discover the Wisdom of Africa"    │      │
│    │  [Join Community] [Explore]         │      │
│    └─────────────────────────────────────┘      │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Main Content Area - Scroll Indicator]          │
└─────────────────────────────────────────────────┘
```

#### Explore Page Wireframe
```
┌─────────────────────────────────────────────────┐
│ [Header: Logo + Navigation + Search]            │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Page Title: "Explore African Wisdom"]         │
│                                                 │
│  [Category Tabs: Featured | Trending | Popular] │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ [Discovery Cards Grid]                  │    │
│  │  ┌─────────────┐ ┌─────────────┐        │    │
│  │  │ Featured    │ │ Trending    │        │    │
│  │  │ Card        │ │ Card        │        │    │
│  │  └─────────────┘ └─────────────┘        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [Proverbs Feed]                                │
│  ┌─────────────────────────────────────────┐    │
│  │ [Proverb Card 1]                        │    │
│  │ [Proverb Card 2]                        │    │
│  │ [Proverb Card 3]                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Proverb Card Wireframe
```
┌─────────────────────────────────────────────────┐
│ ┌───┐ [User Avatar] [Username] [Country/Lang]   │
│ │   │                                           │
│ └───┘ "What does this proverb mean?"            │
│                                                 │
│ [Proverb Text Block]                            │
│ "The proverb text in original language..."      │
│                                                 │
│ [Translation/Meaning]                           │
│ "English translation and explanation..."        │
│                                                 │
│ [Stats: Answers | Views | Followers]            │
│ [Actions: Follow | Show Answers]                │
│                                                 │
│ [Answers Section - Expandable]                  │
│ ┌─────────────────────────────────────────┐     │
│ │ [Answer 1]                             │     │
│ │ [Answer 2]                             │     │
│ └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

## Code Snippets and Key Components

### Authentication Context
```typescript
// lib/auth-context.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Proverb Submission Action
```typescript
// app/actions/proverbs.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const proverbSchema = z.object({
  proverb: z.string().min(10, 'Proverb must be at least 10 characters'),
  meaning: z.string().min(20, 'Meaning must be at least 20 characters'),
  context: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  language: z.string().min(1, 'Language is required'),
  categories: z.array(z.string()).optional(),
})

export async function createProverb(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to create a proverb')
  }

  const validatedData = proverbSchema.parse({
    proverb: formData.get('proverb'),
    meaning: formData.get('meaning'),
    context: formData.get('context'),
    country: formData.get('country'),
    language: formData.get('language'),
    categories: formData.getAll('categories'),
  })

  const { data, error } = await supabase
    .from('proverbs')
    .insert({
      ...validatedData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create proverb')
  }

  // Award points for contribution
  await supabase.rpc('increment_user_points', {
    user_id: user.id,
    points: 10
  })

  revalidatePath('/explore')
  return data
}
```

### API Integration with Supabase
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

## Installation and Setup

### Prerequisites
- Node.js 18.x or later
- pnpm package manager
- Supabase account and project

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/african-heritage-platform.git
   cd african-heritage-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL scripts in order:
   ```bash
   # Connect to your Supabase database and run:
   # scripts/001_create_tables.sql
   # scripts/002_create_profile_trigger.sql
   # scripts/seed_proverbs.sql
   # scripts/set-admin.sql
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

6. **Open in Browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Connect to Vercel**
   ```bash
   pnpm vercel
   ```

2. **Configure Environment Variables**
   Add the same environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   pnpm vercel --prod
   ```

## Usage Guidelines

### For End Users

#### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Complete Profile**: Add bio, country, and avatar
3. **Explore Proverbs**: Browse featured, trending, and popular content
4. **Share Proverbs**: Post proverbs and their meanings
5. **Provide Answers**: Share your insights and interpretations
6. **Build Collections**: Save favorite proverbs for later reference

#### Community Guidelines
- Be respectful and culturally sensitive in discussions
- Provide accurate and thoughtful interpretations
- Cite sources when referencing specific cultural contexts
- Use appropriate language and avoid offensive content
- Engage constructively with other community members

#### Earning Points and Badges
- **Question Asked**: +5 points
- **Answer Provided**: +10 points
- **Answer Accepted**: +15 points
- **Proverb Liked**: +1 point
- **Daily Login**: +2 points
- **Badge Milestones**: Special recognition for consistent contribution

### For Administrators

#### Content Moderation
- Review reported content in the admin panel
- Verify proverbs for authenticity and cultural accuracy
- Manage user accounts and permissions
- Monitor community health metrics

#### Platform Management
- View analytics and usage statistics
- Configure system settings and features
- Manage badges and point systems
- Handle user support requests

## Limitations and Future Enhancements

### Current Limitations
- **Language Support**: Primarily English interface with limited African language support
- **Offline Functionality**: Basic PWA support, full offline capabilities planned
- **Audio Features**: Text-based proverbs only, audio recordings not yet implemented
- **Real-time Collaboration**: Limited collaborative editing features
- **Mobile App**: Web-only platform, native mobile apps planned

### Planned Enhancements
- **Multi-language Support**: Full localization for major African languages
- **Audio Proverbs**: Voice recordings and pronunciation guides
- **Advanced Search**: Semantic search with AI-powered recommendations
- **Collaborative Collections**: Team-based proverb curation
- **Mobile Applications**: Native iOS and Android apps
- **AR/VR Experience**: Immersive cultural exploration features
- **API Access**: Public API for third-party integrations
- **Educational Tools**: Lesson plans and teaching resources for educators

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- **Code Contributions**: Bug fixes, new features, and improvements
- **Content Curation**: Adding verified proverbs and cultural context
- **Translation**: Help localize the platform for more African languages
- **Documentation**: Improve guides, tutorials, and API documentation
- **Testing**: Report bugs and help test new features
- **Design**: UI/UX improvements and accessibility enhancements

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript and React best practices
- Use ESLint configuration for code quality
- Write comprehensive tests for new features
- Follow conventional commit messages
- Ensure accessibility compliance

### Content Guidelines
- Verify proverb authenticity and cultural context
- Provide accurate translations and meanings
- Include source citations when possible
- Respect cultural sensitivities and traditions
- Use inclusive and respectful language

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Cultural Contributors**: African elders, scholars, and community members who preserve oral traditions
- **Open Source Community**: Developers and contributors who make this platform possible
- **Supabase Team**: For providing excellent backend infrastructure
- **Vercel Team**: For hosting and deployment services
- **Design Inspiration**: African artists, designers, and cultural institutions

## Contact

- **Project Lead**: [Your Name]
- **Email**: contact@africanheritage.dev
- **GitHub**: [https://github.com/your-username/african-heritage-platform](https://github.com/your-username/african-heritage-platform)
- **Website**: [https://africanheritage.dev](https://africanheritage.dev)

---

*Built with ❤️ for the preservation and celebration of African cultural heritage*
#   C I / C D   P i p e l i n e   T e s t  
 