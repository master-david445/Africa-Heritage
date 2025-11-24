import { createClient } from "@/lib/supabase/server"
import { HomePage } from '@/components/home-page'
import Header from '@/components/header'
import LandingHero from '@/components/landing-hero'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header />
      {user ? <HomePage /> : <LandingHero />}
    </>
  )
}
