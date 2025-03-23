"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ThumbsDown, ThumbsUp } from "lucide-react"

type Article = {
  id: number
  title: string
  source: string
  sourceType: "left" | "center" | "right"
  readAt: string
  sentiment: "positive" | "neutral" | "negative"
}

export function ReadingHistory() {
  // Mock data for reading history
  const articles: Article[] = [
    {
      id: 1,
      title: "Senate Passes New Infrastructure Bill with Bipartisan Support",
      source: "The Washington Post",
      sourceType: "left",
      readAt: "Today, 10:23 AM",
      sentiment: "positive",
    },
    {
      id: 2,
      title: "Economic Indicators Show Mixed Signals for Recovery",
      source: "Reuters",
      sourceType: "center",
      readAt: "Today, 9:15 AM",
      sentiment: "neutral",
    },
    {
      id: 3,
      title: "Supreme Court Ruling Raises Questions About Executive Power",
      source: "Wall Street Journal",
      sourceType: "right",
      readAt: "Yesterday, 4:45 PM",
      sentiment: "negative",
    },
    {
      id: 4,
      title: "New Study Reveals Impact of Climate Change on Coastal Cities",
      source: "NPR",
      sourceType: "left",
      readAt: "Yesterday, 2:30 PM",
      sentiment: "negative",
    },
    {
      id: 5,
      title: "Tech Companies Announce New Privacy Measures",
      source: "AP News",
      sourceType: "center",
      readAt: "2 days ago",
      sentiment: "positive",
    },
  ]

  const getSourceBadgeVariant = (sourceType: Article["sourceType"]) => {
    switch (sourceType) {
      case "left":
        return "blue"
      case "center":
        return "purple"
      case "right":
        return "red"
      default:
        return "secondary"
    }
  }

  const getSentimentIcon = (sentiment: Article["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading History</CardTitle>
        <CardDescription>Your recent news consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{article.title}</h3>
                  {getSentimentIcon(article.sentiment)}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.source}</span>
                  <Badge
                    variant="outline"
                    className={`
                      ${article.sourceType === "left" ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300" : ""}
                      ${article.sourceType === "center" ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300" : ""}
                      ${article.sourceType === "right" ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300" : ""}
                    `}
                  >
                    {article.sourceType === "left"
                      ? "Liberal"
                      : article.sourceType === "right"
                        ? "Conservative"
                        : "Neutral"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

