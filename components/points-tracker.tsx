"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"

interface PointsTrackerProps {
  currentPoints: number
  nextMilestone: number
}

export default function PointsTracker({ currentPoints, nextMilestone }: PointsTrackerProps) {
  const progressPercentage = (currentPoints / nextMilestone) * 100
  const pointsNeeded = nextMilestone - currentPoints

  const activities = [
    { action: "Share a proverb", points: 10 },
    { action: "Get a like", points: 1 },
    { action: "Write a comment", points: 5 },
    { action: "Create a collection", points: 25 },
    { action: "Get 10 followers", points: 50 },
    { action: "Proverb gets featured", points: 100 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Points & Levels
          </CardTitle>
          <CardDescription>Track your community engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-900">Current Points</span>
              <span className="text-2xl font-bold text-orange-600">{currentPoints}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              {pointsNeeded} points until next milestone ({nextMilestone})
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-semibold text-gray-900 mb-3">How to earn points</p>
            <div className="space-y-2">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{activity.action}</span>
                  <span className="font-semibold text-orange-600">+{activity.points}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
