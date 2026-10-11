import { v4 as uuidv4 } from "uuid";
import type { Chunk } from "./types";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

export function chunkText(
  text: string,
  documentId: string,
  documentName: string
): Chunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: Chunk[] = [];

  if (words.length <= CHUNK_SIZE) {
    const chunkText = words.join(" ");
    const tokens = tokenize(chunkText);
    chunks.push({
      id: uuidv4(),
      documentId,
      documentName,
      text: chunkText,
      index: 0,
      tokens,
      tfidf: {},
    });
    return chunks;
  }

  let start = 0;
  let chunkIndex = 0;

  while (start < words.length) {
    const end = Math.min(start + CHUNK_SIZE, words.length);
    const chunkWords = words.slice(start, end);
    const chunkText = chunkWords.join(" ");
    const tokens = tokenize(chunkText);

    chunks.push({
      id: uuidv4(),
      documentId,
      documentName,
      text: chunkText,
      index: chunkIndex,
      tokens,
      tfidf: {},
    });

    start += CHUNK_SIZE - CHUNK_OVERLAP;
    chunkIndex++;
  }

  return chunks;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "out", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same",
  "so", "than", "too", "very", "just", "because", "but", "and", "or",
  "if", "it", "its", "this", "that", "these", "those", "he", "she",
  "we", "they", "me", "him", "her", "us", "them", "my", "your", "his",
  "our", "their", "what", "which", "who", "whom",
]);

export function computeTFIDF(allChunks: Chunk[]): void {
  const docCount = allChunks.length;
  const df: Record<string, number> = {};

  for (const chunk of allChunks) {
    const uniqueTokens = new Set(chunk.tokens.filter((t) => !STOP_WORDS.has(t)));
    for (const token of uniqueTokens) {
      df[token] = (df[token] || 0) + 1;
    }
  }

  for (const chunk of allChunks) {
    const tf: Record<string, number> = {};
    const filtered = chunk.tokens.filter((t) => !STOP_WORDS.has(t));
    for (const token of filtered) {
      tf[token] = (tf[token] || 0) + 1;
    }

    chunk.tfidf = {};
    for (const [token, count] of Object.entries(tf)) {
      const termFreq = count / filtered.length;
      const inverseDocFreq = Math.log((docCount + 1) / ((df[token] || 0) + 1)) + 1;
      chunk.tfidf[token] = termFreq * inverseDocFreq;
    }
  }
}
