import type { Chunk, SearchResult } from "./types";
import { computeTFIDF } from "./chunker";

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

function queryToTFIDF(query: string, allChunks: Chunk[]): Record<string, number> {
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  const tf: Record<string, number> = {};
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }

  const docCount = allChunks.length;
  const df: Record<string, number> = {};
  for (const chunk of allChunks) {
    const unique = new Set(chunk.tokens);
    for (const token of unique) {
      df[token] = (df[token] || 0) + 1;
    }
  }

  const tfidf: Record<string, number> = {};
  for (const [token, count] of Object.entries(tf)) {
    const termFreq = count / tokens.length;
    const idf = Math.log((docCount + 1) / ((df[token] || 0) + 1)) + 1;
    tfidf[token] = termFreq * idf;
  }

  return tfidf;
}

function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of allKeys) {
    const valA = a[key] || 0;
    const valB = b[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function searchChunks(
  query: string,
  allChunks: Chunk[],
  topK: number = 3
): SearchResult[] {
  if (allChunks.length === 0) return [];

  computeTFIDF(allChunks);
  const queryVector = queryToTFIDF(query, allChunks);

  const results: SearchResult[] = allChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryVector, chunk.tfidf),
  }));

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK).filter((r) => r.score > 0);
}
