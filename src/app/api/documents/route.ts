import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const documents = store.getAllDocuments();

  return NextResponse.json(
    documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      chunks: doc.chunks.length,
      size: doc.size,
      uploadedAt: doc.uploadedAt,
    }))
  );
}
