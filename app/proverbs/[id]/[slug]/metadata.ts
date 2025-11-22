import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: { id: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  
  // Fetch the proverb data
  const { data: proverb } = await supabase
    .from('questions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!proverb) {
    return {
      title: 'Proverb Not Found',
      description: 'The requested proverb could not be found.',
    }
  }

  const title = `African Proverb: ${proverb.content.substring(0, 60)}...`
  const description = proverb.content
  const url = `https://yourapp.com/proverbs/${params.id}/${params.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'African Heritage',
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
