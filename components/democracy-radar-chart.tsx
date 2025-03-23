"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const data = [
  { dimension: "Media Freedom", value: 80, fullMark: 100 },
  { dimension: "Electoral Process", value: 65, fullMark: 100 },
  { dimension: "Civil Liberties", value: 75, fullMark: 100 },
  { dimension: "Rule of Law", value: 70, fullMark: 100 },
  { dimension: "Deliberation", value: 85, fullMark: 100 },
]

const dimensionDescriptions = {
  "Media Freedom": "Your engagement with diverse and independent news sources",
  "Electoral Process": "Your understanding of electoral systems and participation",
  "Civil Liberties": "Your awareness of civil rights issues and discourse",
  "Rule of Law": "Your engagement with legal and judicial news",
  Deliberation: "Your participation in balanced political discussions",
}

export function DemocracyRadarChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Democratic Engagement</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This chart shows your engagement across key democratic dimensions based on your reading habits.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Your engagement across key democratic dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              user: {
                label: "Your Score",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{data.dimension}</p>
                              <p className="text-xs text-muted-foreground">
                                {dimensionDescriptions[data.dimension as keyof typeof dimensionDescriptions]}
                              </p>
                              <p className="text-sm font-bold">{data.value}/100</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  }
                />
                <Radar
                  name="User"
                  dataKey="value"
                  stroke="var(--color-user)"
                  fill="var(--color-user)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

