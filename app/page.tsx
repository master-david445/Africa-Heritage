import { getAllProverbs } from "@/app/actions/proverbs"
import { getCurrentUser } from "@/app/actions/profile"
import Header from "@/components/header"
import StatsBar from "@/components/stats-bar"
import ProverbFeed from "@/components/proverb-feed"

export const revalidate = 0

export default async function Home() {
  let proverbs = []
  let currentUser = null

  try {
    [proverbs, currentUser] = await Promise.all([getAllProverbs(20, 0), getCurrentUser()])
  } catch (error) {
    console.error("[v0] Error loading initial data:", error)
    // Continue with empty arrays - the UI will handle empty states
  }

  return (
    <>
      <Header />
      <StatsBar />
      <ProverbFeed initialProverbs={proverbs} currentUser={currentUser} />
    </>
  )
}
