import { createClient } from "@/lib/supabase/server"
import { HomePage } from '@/components/home-page'
import Header from '@/components/header'
import LandingHero from '@/components/landing-hero'
import { AnnouncementBanner } from '@/components/announcement-banner'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <AnnouncementBanner />
      </div>
      {user ? <HomePage /> : <LandingHero />}
    </>
  )
}
