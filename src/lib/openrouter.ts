import type { SearchResult, ClassificationResult } from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function getDemoAnswer(
  question: string,
  intent: ClassificationResult["intent"],
  chunks: SearchResult[]
): string {
  const chunkTexts = chunks.map((c) => c.chunk.text.substring(0, 200));
  const sources = chunks.map((c) => c.chunk.documentName);
  const uniqueSources = [...new Set(sources)];

  if (intent === "summary") {
    return `Based on the uploaded documents, here is a summary:\n\n${chunkTexts
      .map(
        (t, i) =>
          `**Key Point ${i + 1}:** ${t.substring(0, 150)}...`
      )
      .join(
        "\n\n"
      )}\n\nThis information was compiled from: ${uniqueSources.join(", ")}.\n\n*Note: Running in demo mode. Connect OpenRouter API for full AI-generated responses.*`;
  }

  if (intent === "analytical") {
    return `Here is an analysis based on the relevant documents:\n\nAfter reviewing the available information from ${uniqueSources.join(
      " and "
    )}, several key insights emerge:\n\n1. ${chunkTexts[0]?.substring(0, 150) || "No relevant context found"}...\n\n2. ${
      chunkTexts[1]?.substring(0, 150) || "Additional context needed"
    }...\n\nThe analysis suggests that the topic has multiple dimensions worth considering across the referenced documents.\n\n*Note: Running in demo mode. Connect OpenRouter API for deeper analytical responses.*`;
  }

  // Factual
  return `Based on the retrieved documents, here is the answer:\n\n${
    chunkTexts[0]?.substring(0, 300) || "No relevant information found in the uploaded documents."
  }\n\nSource: ${uniqueSources[0] || "Unknown"}\n\n*Note: Running in demo mode. Connect OpenRouter API for full AI-generated responses.*`;
}

export async function generateAnswer(
  question: string,
  classification: ClassificationResult,
  retrievedChunks: SearchResult[]
): Promise<{ answer: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free";

  if (!apiKey) {
    return {
      answer: getDemoAnswer(question, classification.intent, retrievedChunks),
      model: "demo-mode",
    };
  }

  const context = retrievedChunks
    .map(
      (r, i) =>
        `[Chunk ${i + 1} | Source: ${r.chunk.documentName} | Relevance: ${(
          r.score * 100
        ).toFixed(1)}%]\n${r.chunk.text}`
    )
    .join("\n\n---\n\n");

  const systemPrompt = `You are DocuMind AI, a precise document Q&A assistant. Answer questions using ONLY the provided context chunks.

Question type: ${classification.intent}
${classification.intent === "summary" ? "Provide a comprehensive summary covering all key points from the context." : ""}
${classification.intent === "analytical" ? "Provide deep analysis, comparisons, and insights based on the context." : ""}
${classification.intent === "factual" ? "Provide a direct, concise answer to the factual question." : ""}

If the context doesn't contain enough information, say so clearly. Always cite which document the information comes from.`;

  const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://documind-ai.vercel.app",
        "X-Title": "DocuMind AI",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1024,
        temperature: classification.intent === "factual" ? 0.3 : 0.7,
      }),
    });

    if (!response.ok) {
      return {
        answer: getDemoAnswer(question, classification.intent, retrievedChunks),
        model: "demo-mode (API error)",
      };
    }

    const data = await response.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      getDemoAnswer(question, classification.intent, retrievedChunks);

    return { answer, model: data.model || model };
  } catch {
    return {
      answer: getDemoAnswer(question, classification.intent, retrievedChunks),
      model: "demo-mode (network error)",
    };
  }
}
