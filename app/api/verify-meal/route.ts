import { NextRequest, NextResponse } from "next/server"

// Robust JSON extraction that handles markdown fences and surrounding text
function extractJSON(text: string): {
  isVegetarian: boolean
  confidence: "high" | "medium" | "low"
  reasoning: string
  detectedItems: string[]
  mealType: "vegan" | "vegetarian" | "non-vegetarian"
} {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {}

  // Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim())
    } catch {}
  }

  // Find first { ... } block in the text
  const braceMatch = text.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch {}
  }

  // If all parsing fails, return a default low-confidence object
  // but LOG the raw text to console so we can debug
  console.error("JSON parse failed. Raw API response was:", text)
  return {
    isVegetarian: false,
    confidence: "low",
    reasoning: "Could not parse API response.",
    detectedItems: [],
    mealType: "non-vegetarian"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image, mediaType, systemPrompt } = await request.json()

    if (!image || !mediaType) {
      return NextResponse.json(
        { error: "Missing image or mediaType" },
        { status: 400 }
      )
    }

    // Validate base64 isn't empty or too short
    if (!image || image.length < 100) {
      return NextResponse.json(
        { error: "Image conversion failed — base64 output is empty or too short" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
      console.error("[v0] Anthropic API key is missing or invalid")
      return NextResponse.json(
        { error: "Anthropic API key is missing. Add ANTHROPIC_API_KEY to your environment variables." },
        { status: 500 }
      )
    }

    console.log("Base64 preview (first 100 chars):", image.substring(0, 100))
    console.log("Media type being sent:", mediaType)

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: image,
                },
              },
              {
                type: "text",
                text: "Analyze this meal image and respond in the exact JSON format specified.",
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Anthropic API error:", errorText)
      return NextResponse.json(
        { 
          error: "Failed to analyze image",
          rawError: errorText,
          statusCode: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.content[0].text
    
    console.log("Raw API response text:", text)

    // Use robust JSON extraction
    const result = extractJSON(text)
    
    // Return with raw text for debugging
    return NextResponse.json({
      ...result,
      _rawResponse: text,
      _base64Length: image.length
    })
  } catch (error) {
    console.error("Error verifying meal:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
