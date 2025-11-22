import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { QueryProvider } from "@/lib/query-client"
import ErrorBoundary from "@/components/error-boundary"
import PWAInstall from "@/components/pwa-install"
import { Toaster } from "sonner"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "African Heritage - Discover African Proverbs and Wisdom",
  description: "Explore, share, and celebrate timeless African proverbs from across the continent. Join our community of wisdom seekers and cultural ambassadors.",
  keywords: ["African proverbs", "wisdom", "culture", "tradition", "folklore", "Africa"],
  authors: [{ name: "African Heritage Platform" }],
  creator: "African Heritage Platform",
  publisher: "African Heritage Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "African Heritage - Discover African Proverbs and Wisdom",
    description: "Explore, share, and celebrate timeless African proverbs from across the continent.",
    url: '/',
    siteName: 'African Heritage',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "African Heritage - Discover African Proverbs and Wisdom",
    description: "Explore, share, and celebrate timeless African proverbs from across the continent.",
    creator: '@africanheritage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'African Heritage',
  },
}

// Viewport configuration for Next.js 13+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ea580c',
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Mobile debug component (development only)
  function MobileDebugInfo() {
    if (process.env.NODE_ENV === 'production') return null;

    return (
      <div className="fixed bottom-2 right-2 z-50 hidden max-w-[200px] rounded-lg bg-black/80 p-2 text-xs text-white backdrop-blur-sm sm:block">
        <div>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'loading...'}</div>
        <div className="mt-1 text-[10px] opacity-75">
          {typeof navigator !== 'undefined' ? navigator.userAgent : ''}
        </div>
      </div>
    );
  }

  return (
    <html lang="en" className={`${montserrat.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ErrorBoundary level="app" name="RootLayout" enableSentry={true}>
          <QueryProvider>
            <AuthProvider>
              {children}
              <MobileDebugInfo />
              <PWAInstall />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
