import { DemocracyRadarChart } from "@/components/democracy-radar-chart"
import { TodaysChallenges } from "@/components/todays-challenges"
import { StoryStreaks } from "@/components/story-streaks"
import { InteractivePoll } from "@/components/interactive-poll"
import { ReadingHistory } from "@/components/reading-history"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 pt-20 md:ml-64 md:pt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your democratic engagement and news consumption</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full lg:col-span-1">
          <DemocracyRadarChart />
        </div>
        <div className="col-span-full lg:col-span-2">
          <TodaysChallenges />
        </div>
        <div className="col-span-full md:col-span-1">
          <StoryStreaks />
        </div>
        <div className="col-span-full md:col-span-1">
          <InteractivePoll />
        </div>
        <div className="col-span-full">
          <ReadingHistory />
        </div>
      </div>
    </div>
  )
}

