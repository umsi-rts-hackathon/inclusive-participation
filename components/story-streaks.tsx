"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlameIcon as Fire } from "lucide-react"
import { cn } from "@/lib/utils"

export function StoryStreaks() {
  // Mock data for the streak calendar
  const currentStreak = 7
  const longestStreak = 14
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Generate mock streak data for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = new Date(currentYear, currentMonth, day)
    const isToday = new Date().getDate() === day

    // Use a deterministic pattern for streaks
    const hasStreak = day <= new Date().getDate() && day % 3 !== 0

    // Use a deterministic pattern for streak intensity
    const streakIntensity = hasStreak ? (day % 3) + 1 : 0

    return {
      date,
      day,
      hasStreak,
      streakIntensity,
      isToday,
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Story Streaks</CardTitle>
          <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-sm font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Fire className="h-4 w-4" />
            <span>{currentStreak} days</span>
          </div>
        </div>
        <CardDescription>Track your balanced news consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Add empty cells for days before the 1st of the month */}
            {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 rounded-md"></div>
            ))}

            {days.map((day) => (
              <div
                key={day.day}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md text-xs font-medium",
                  day.isToday && "ring-2 ring-primary ring-offset-2",
                  day.hasStreak
                    ? day.streakIntensity === 1
                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      : day.streakIntensity === 2
                        ? "bg-orange-200 text-orange-700 dark:bg-orange-800/40 dark:text-orange-300"
                        : "bg-orange-300 text-orange-800 dark:bg-orange-700/50 dark:text-orange-200"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {day.day}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Streak</span>
              <span className="font-medium">{currentStreak} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Longest Streak</span>
              <span className="font-medium">{longestStreak} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>This Month</span>
              <span className="font-medium">{days.filter((d) => d.hasStreak).length} days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

