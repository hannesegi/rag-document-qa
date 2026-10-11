import { NextResponse } from "next/server";
import { classifyQuestion } from "@/lib/jev-ai";
import { generateAnswer } from "@/lib/openrouter";
import { searchChunks } from "@/lib/vector-store";
import { store } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    const classification = await classifyQuestion(question);

    const allChunks = store.getAllChunks();
    const retrievedChunks = searchChunks(question, allChunks, 3);

    const { answer, model } = await generateAnswer(
      question,
      classification,
      retrievedChunks
    );

    const processingTime = Date.now() - startTime;

    const avgScore =
      retrievedChunks.length > 0
        ? retrievedChunks.reduce((sum, r) => sum + r.score, 0) /
          retrievedChunks.length
        : 0;

    store.recordQuestion(
      question,
      classification.intent,
      avgScore,
      classification.tokens_saved
    );

    return NextResponse.json({
      answer,
      classification,
      retrievedChunks: retrievedChunks.map((r) => ({
        text: r.chunk.text.substring(0, 500),
        documentName: r.chunk.documentName,
        score: Math.round(r.score * 1000) / 1000,
        chunkIndex: r.chunk.index,
      })),
      model,
      processingTime,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
