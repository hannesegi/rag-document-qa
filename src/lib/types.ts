export interface Document {
  id: string;
  name: string;
  content: string;
  chunks: Chunk[];
  uploadedAt: string;
  size: number;
}

export interface Chunk {
  id: string;
  documentId: string;
  documentName: string;
  text: string;
  index: number;
  tokens: string[];
  tfidf: Record<string, number>;
}

export interface SearchResult {
  chunk: Chunk;
  score: number;
}

export interface ClassificationResult {
  intent: "factual" | "analytical" | "summary";
  confidence: number;
  tokens_saved: number;
}

export interface AskResponse {
  answer: string;
  classification: ClassificationResult;
  retrievedChunks: SearchResult[];
  model: string;
  processingTime: number;
}

export interface StatsData {
  documentsUploaded: number;
  questionsAsked: number;
  tokensSaved: number;
  avgRelevanceScore: number;
  recentQuestions: { question: string; intent: string; timestamp: string }[];
}
