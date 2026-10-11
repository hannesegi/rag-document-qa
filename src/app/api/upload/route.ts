import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { chunkText } from "@/lib/chunker";
import { store } from "@/lib/store";
import type { Document } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const chunks = chunkText(content, id, name);

    const doc: Document = {
      id,
      name,
      content,
      chunks,
      uploadedAt: new Date().toISOString(),
      size: new TextEncoder().encode(content).length,
    };

    store.addDocument(doc);

    return NextResponse.json({
      id: doc.id,
      name: doc.name,
      chunks: chunks.length,
      size: doc.size,
      uploadedAt: doc.uploadedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
