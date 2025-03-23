import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { articleId, title, description, content } = await req.json()

    if (!articleId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Prepare the prompt for OpenAI
    const prompt = `Analyze this news article and provide:
1. Political bias score (-10 to 10, where -10 is strongly Democratic/Left, 0 is neutral, and 10 is strongly Republican/Right)
2. Estimated location (city, state, country) mentioned in the article
3. Confidence score for the analysis (0-1)

Article Title: ${title}
Description: ${description}
Content: ${content || "No content available"}

Respond in JSON format with these fields:
{
  "political_bias": number,
  "location": {
    "city": string,
    "state": string,
    "country": string
  },
  "confidence": number
}`

    // Get analysis from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(completion.choices[0].message.content)

    // Save to Supabase
    const { error } = await supabase
      .from("article_analysis")
      .upsert({
        article_id: articleId,
        political_bias: analysis.political_bias,
        location_city: analysis.location.city,
        location_state: analysis.location.state,
        location_country: analysis.location.country,
        confidence_score: analysis.confidence,
        analyzed_at: new Date().toISOString(),
      })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze article" },
      { status: 500 }
    )
  }
}

