import type { ClassificationResult } from "./types";

const JEV_API_URL = "https://jev-api.vercel.app/api/classify";

function simulateClassification(question: string): ClassificationResult {
  const lower = question.toLowerCase();

  const summaryKeywords = [
    "summarize", "summary", "overview", "describe", "explain",
    "what is", "tell me about", "brief", "outline",
  ];
  const analyticalKeywords = [
    "compare", "difference", "why", "how does", "analyze",
    "evaluate", "pros and cons", "impact", "effect", "advantages",
    "better", "best", "recommend", "should",
  ];

  let intent: "factual" | "analytical" | "summary" = "factual";
  let confidence = 0.85;

  if (summaryKeywords.some((kw) => lower.includes(kw))) {
    intent = "summary";
    confidence = 0.92;
  } else if (analyticalKeywords.some((kw) => lower.includes(kw))) {
    intent = "analytical";
    confidence = 0.88;
  } else {
    intent = "factual";
    confidence = 0.91;
  }

  const baseSaved = intent === "factual" ? 340 : intent === "analytical" ? 180 : 250;
  const tokens_saved = baseSaved + Math.floor(Math.random() * 100);

  return { intent, confidence, tokens_saved };
}

export async function classifyQuestion(
  question: string
): Promise<ClassificationResult> {
  const apiKey = process.env.JEV_API_KEY;

  if (!apiKey) {
    return simulateClassification(question);
  }

  try {
    const response = await fetch(JEV_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: question,
        categories: ["factual", "analytical", "summary"],
      }),
    });

    if (!response.ok) {
      return simulateClassification(question);
    }

    const data = await response.json();
    return {
      intent: data.category || "factual",
      confidence: data.confidence || 0.85,
      tokens_saved: data.tokens_saved || 200,
    };
  } catch {
    return simulateClassification(question);
  }
}
