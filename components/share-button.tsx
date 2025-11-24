'use client'

import { Button } from "./ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { generateSlug } from "@/lib/utils"

interface ShareButtonProps {
  id: string
  content: string
  className?: string
}

export function ShareButton({ id, content, className }: ShareButtonProps) {
  const handleShare = async () => {
    const slug = generateSlug(content)
    const url = `${window.location.origin}/proverbs/${id}/${slug}`

    if ('share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'African Proverb',
          text: content,
          url,
        })
      } catch (error) {
        // User aborted the share, no need to show error
        if (!(error instanceof Error) || error.name !== 'AbortError') {
          await copyToClipboard(url)
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className={className}
      aria-label="Share proverb"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
