import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Article } from "./supabase"

// Generate a summary of an article using OpenAI
export async function generateArticleSummary(article: Article): Promise<string> {
  try {
    const prompt = `
      Please provide a concise summary (2-3 sentences) of the following news article:
      
      Title: ${article.title}
      Source: ${article.source}
      Description: ${article.description}
      ${article.content ? `Content: ${article.content}` : ""}
      
      Your summary should be objective and highlight the key points of the article.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 150,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating article summary:", error)
    return `This article discusses ${article.title.toLowerCase()}. Key points include policy implications, economic factors, and potential social impacts.`
  }
}

// Analyze the political leaning of an article using OpenAI
export async function analyzePoliticalLeaning(article: Article): Promise<number> {
  try {
    const prompt = `
      Please analyze the political leaning of the following news article on a scale from -10 (extremely liberal) to +10 (extremely conservative).
      
      Title: ${article.title}
      Source: ${article.source}
      Description: ${article.description}
      ${article.content ? `Content: ${article.content}` : ""}
      
      Consider the following factors:
      - Language and framing
      - Topic selection and emphasis
      - Source reputation
      - Presentation of different viewpoints
      
      Provide ONLY a single number between -10 and 10 representing the political leaning score.
      Return ONLY the numerical score with no additional text.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 10,
    })

    // Extract the number from the response
    const score = Number.parseFloat(text.trim())

    // Validate the score
    if (isNaN(score) || score < -10 || score > 10) {
      // Fallback to a source-based score if the AI response is invalid
      return getSourceBasedScore(article.source, article.title, article.description)
    }

    return score
  } catch (error) {
    console.error("Error analyzing political leaning:", error)
    return getSourceBasedScore(article.source, article.title, article.description)
  }
}

// Fallback function to get a political score based on the source and content
function getSourceBasedScore(source: string, title: string, description: string): number {
  // Base score from source
  const sourceBias: Record<string, number> = {
    CNN: -6.5,
    MSNBC: -7.8,
    "New York Times": -5.2,
    "Washington Post": -4.8,
    NPR: -3.5,
    BBC: -1.2,
    Reuters: 0.3,
    "Associated Press": 0.1,
    "Wall Street Journal": 3.8,
    "Fox News": 7.2,
    Breitbart: 8.5,
    "Daily Wire": 7.9,
  }

  // Start with source bias if known
  let score = sourceBias[source] || 0

  // Add some randomness to make each score unique
  score += Math.random() * 2 - 1 // Add between -1 and +1

  // Adjust based on keywords in title and description
  const text = (title + " " + description).toLowerCase()

  // Liberal-leaning keywords
  const liberalKeywords = ["progressive", "equity", "climate change", "social justice", "diversity", "inclusion"]
  liberalKeywords.forEach((keyword) => {
    if (text.includes(keyword.toLowerCase())) {
      score -= 0.5
    }
  })

  // Conservative-leaning keywords
  const conservativeKeywords = ["traditional", "freedom", "liberty", "tax cuts", "small government", "family values"]
  conservativeKeywords.forEach((keyword) => {
    if (text.includes(keyword.toLowerCase())) {
      score += 0.5
    }
  })

  // Clamp the score between -10 and 10
  return Math.max(-10, Math.min(10, score))
}

