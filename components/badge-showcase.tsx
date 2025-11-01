"use client"

import type { Badge as BadgeType } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BadgeShowcaseProps {
  badges: BadgeType[]
  userPoints: number
}

export default function BadgeShowcase({ badges, userPoints }: BadgeShowcaseProps) {
  const allBadges = [
    {
      id: "first-proverb",
      name: "First Proverb",
      description: "Share your first proverb",
      icon: "🌱",
      earned: badges.some((b) => b.id === "first-proverb"),
    },
    {
      id: "collector",
      name: "Collector",
      description: "Create 5 collections",
      icon: "📚",
      earned: badges.some((b) => b.id === "collector"),
    },
    {
      id: "social-butterfly",
      name: "Social Butterfly",
      description: "Get 100 followers",
      icon: "🦋",
      earned: badges.some((b) => b.id === "social-butterfly"),
    },
    {
      id: "wisdom-keeper",
      name: "Wisdom Keeper",
      description: "Share 50 proverbs",
      icon: "🏛️",
      earned: badges.some((b) => b.id === "wisdom-keeper"),
    },
    {
      id: "community-champion",
      name: "Community Champion",
      description: "Earn 1000 points",
      icon: "🏆",
      earned: userPoints >= 1000,
    },
    {
      id: "cultural-ambassador",
      name: "Cultural Ambassador",
      description: "Share proverbs from 5+ countries",
      icon: "🌍",
      earned: badges.some((b) => b.id === "cultural-ambassador"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
        <CardDescription>Earn badges by contributing to the community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 text-center transition ${
                badge.earned ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-gray-50 opacity-50"
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="font-semibold text-sm text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
              {badge.earned && <Badge className="mt-2 bg-orange-600">Earned</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
