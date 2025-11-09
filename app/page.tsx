import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to explore (main Q&A interface)
  if (user) {
    redirect('/explore')
  }

  // If not authenticated, show landing page
  redirect('/landing')
}
