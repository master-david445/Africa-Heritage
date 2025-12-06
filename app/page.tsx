import { createClient } from "@/lib/supabase/server"
import { HomePage } from '@/components/home-page'
import Header from '@/components/header'
import LandingHero from '@/components/landing-hero'
import { AnnouncementBanner } from '@/components/announcement-banner'
import dynamic from 'next/dynamic'

// Lazy load components that are below the fold
const HowItWorks = dynamic(() => import('@/components/landing/how-it-works').then(mod => mod.HowItWorks))
const OurMission = dynamic(() => import('@/components/landing/our-mission').then(mod => mod.OurMission))
const CtaNewsletter = dynamic(() => import('@/components/landing/cta-newsletter').then(mod => mod.CtaNewsletter))
const Footer = dynamic(() => import('@/components/landing/footer').then(mod => mod.Footer))

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <AnnouncementBanner />
      </div>
      {user ? (
        <HomePage />
      ) : (
        <>
          <LandingHero />
          <HowItWorks />
          <OurMission />
          <CtaNewsletter />
          <Footer />
        </>
      )}
    </>
  )
}
