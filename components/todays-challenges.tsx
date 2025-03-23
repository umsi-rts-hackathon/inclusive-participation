"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const challenges = [
  {
    id: 1,
    title: "Explore Opposing Viewpoints",
    description: "Read articles from both liberal and conservative sources on the same topic",
    points: 50,
    badge: "Critical Thinker",
    timeEstimate: "15 min",
  },
  {
    id: 2,
    title: "Discover New Sources",
    description: "Read from 3 news sources you haven't visited before",
    points: 30,
    badge: "Explorer",
    timeEstimate: "20 min",
  },
  {
    id: 3,
    title: "Fact Check Challenge",
    description: "Verify claims from a trending news story using fact-checking sites",
    points: 40,
    badge: "Truth Seeker",
    timeEstimate: "10 min",
  },
]

export function TodaysChallenges() {
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const { toast } = useToast()

  const completeChallenge = (id: number) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges([...completedChallenges, id])
      const challenge = challenges.find((c) => c.id === id)

      toast({
        title: "Challenge Completed!",
        description: `You earned ${challenge?.points} points and the "${challenge?.badge}" badge.`,
      })
    }
  }

  const progress = Math.round((completedChallenges.length / challenges.length) * 100)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today's Challenges</CardTitle>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Daily Progress: {progress}%</span>
          </div>
        </div>
        <CardDescription>Complete challenges to earn points and badges</CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id)

            return (
              <div
                key={challenge.id}
                className={`rounded-lg border p-4 transition-colors ${
                  isCompleted ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{challenge.title}</h3>
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge variant="secondary" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        {challenge.points} pts
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.timeEstimate}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => completeChallenge(challenge.id)}
                    disabled={isCompleted}
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Completed" : "Start"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

