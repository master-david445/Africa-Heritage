import type { Proverb } from "@/lib/types"

export interface ShareMetadata {
    title: string
    description: string
    url: string
    image?: string
    hashtags?: string[]
}

/**
 * Generate SEO-friendly share metadata for a proverb
 */
export function generateProverbShareMetadata(proverb: Proverb, baseUrl: string): ShareMetadata {
    const proverbText = proverb.proverb.length > 100
        ? `${proverb.proverb.substring(0, 97)}...`
        : proverb.proverb

    const meaning = proverb.meaning?.length > 150
        ? `${proverb.meaning.substring(0, 147)}...`
        : proverb.meaning || ""

    return {
        title: `African Proverb: ${proverbText}`,
        description: meaning || `Discover the wisdom of this ${proverb.country} proverb in ${proverb.language}. ${proverb.categories?.join(", ")}`,
        url: `${baseUrl}/proverb/${proverb.id}`,
        hashtags: [
            "AfricanWisdom",
            "AfricanProverbs",
            proverb.country?.replace(/\s+/g, ""),
            ...(proverb.categories?.map(cat => cat.replace(/\s+/g, "")) || [])
        ].filter(Boolean)
    }
}

/**
 * Share a proverb using Web Share API or fallback to clipboard
 */
export async function shareProverb(metadata: ShareMetadata): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'error' }> {
    try {
        // Prepare share data
        const shareData: ShareData = {
            title: metadata.title,
            text: metadata.description,
            url: metadata.url,
        }

        // Try native Web Share API first (mobile-friendly)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData)
            return { success: true, method: 'native' }
        }

        // Fallback: Copy rich text to clipboard
        const shareText = `${metadata.title}\n\n${metadata.description}\n\n${metadata.url}\n\n${metadata.hashtags?.map(tag => `#${tag}`).join(" ") || ""}`

        await navigator.clipboard.writeText(shareText)
        return { success: true, method: 'clipboard' }
    } catch (error) {
        console.error("Share error:", error)
        return { success: false, method: 'error' }
    }
}

/**
 * Generate social media share URLs
 */
export function generateSocialShareUrls(metadata: ShareMetadata) {
    const encodedUrl = encodeURIComponent(metadata.url)
    const encodedTitle = encodeURIComponent(metadata.title)
    const encodedDescription = encodeURIComponent(metadata.description)
    const hashtags = metadata.hashtags?.join(",") || ""

    return {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
    }
}
