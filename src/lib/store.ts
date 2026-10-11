import type { Document, StatsData } from "./types";
import { sampleDocuments } from "./sample-data";

class DocumentStore {
  private documents: Map<string, Document> = new Map();
  private questionsAsked: number = 0;
  private tokensSaved: number = 0;
  private totalRelevanceScore: number = 0;
  private relevanceCount: number = 0;
  private recentQuestions: { question: string; intent: string; timestamp: string }[] = [];
  private initialized = false;

  private ensureInit() {
    if (!this.initialized) {
      this.initialized = true;
      for (const doc of sampleDocuments) {
        this.documents.set(doc.id, doc);
      }
    }
  }

  addDocument(doc: Document) {
    this.ensureInit();
    this.documents.set(doc.id, doc);
  }

  getDocument(id: string): Document | undefined {
    this.ensureInit();
    return this.documents.get(id);
  }

  getAllDocuments(): Document[] {
    this.ensureInit();
    return Array.from(this.documents.values());
  }

  getAllChunks() {
    this.ensureInit();
    return Array.from(this.documents.values()).flatMap((d) => d.chunks);
  }

  recordQuestion(question: string, intent: string, relevanceScore: number, savedTokens: number) {
    this.questionsAsked++;
    this.tokensSaved += savedTokens;
    this.totalRelevanceScore += relevanceScore;
    this.relevanceCount++;
    this.recentQuestions.unshift({
      question,
      intent,
      timestamp: new Date().toISOString(),
    });
    if (this.recentQuestions.length > 10) {
      this.recentQuestions = this.recentQuestions.slice(0, 10);
    }
  }

  getStats(): StatsData {
    this.ensureInit();
    return {
      documentsUploaded: this.documents.size,
      questionsAsked: this.questionsAsked,
      tokensSaved: this.tokensSaved,
      avgRelevanceScore:
        this.relevanceCount > 0
          ? Math.round((this.totalRelevanceScore / this.relevanceCount) * 100) / 100
          : 0,
      recentQuestions: this.recentQuestions,
    };
  }
}

export const store = new DocumentStore();
