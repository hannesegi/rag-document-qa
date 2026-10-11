"use client";

import { useState, useRef, useEffect } from "react";

interface RetrievedChunk {
  text: string;
  documentName: string;
  score: number;
  chunkIndex: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  classification?: {
    intent: string;
    confidence: number;
    tokens_saved: number;
  };
  chunks?: RetrievedChunk[];
  model?: string;
  processingTime?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "Sorry, I could not generate an answer.",
        classification: data.classification,
        chunks: data.retrievedChunks,
        model: data.model,
        processingTime: data.processingTime,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "An error occurred while processing your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleChunks(msgId: string) {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  }

  const sampleQuestions = [
    "What products does Acme Corp offer?",
    "Summarize the PTO policy",
    "How does workflow automation work in AcmeFlow?",
    "Compare the pricing tiers for AcmeFlow",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-1">Chat with Documents</h1>
        <p className="text-gray-400 text-sm">
          Ask questions about your uploaded documents. AI retrieves relevant
          chunks and generates answers.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-200">
              Ask anything about your documents
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              3 sample documents are pre-loaded. Try one of these questions:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-violet-600/20 border border-violet-500/20 rounded-2xl rounded-tr-md px-4 py-3">
                  <p className="text-gray-100">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-[90%] space-y-3">
                  {/* Classification Badge */}
                  {msg.classification && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          msg.classification.intent === "factual"
                            ? "bg-blue-500/20 text-blue-300"
                            : msg.classification.intent === "analytical"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {msg.classification.intent}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(msg.classification.confidence * 100).toFixed(0)}%
                        confidence
                      </span>
                      <span className="text-xs text-gray-500">
                        {msg.classification.tokens_saved} tokens saved
                      </span>
                      {msg.processingTime && (
                        <span className="text-xs text-gray-500">
                          {msg.processingTime}ms
                        </span>
                      )}
                    </div>
                  )}

                  {/* Answer */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content.split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={i} className="font-semibold text-gray-100 mt-2">
                              {line.replace(/\*\*/g, "")}
                            </p>
                          );
                        }
                        if (line.startsWith("**")) {
                          const parts = line.split("**");
                          return (
                            <p key={i} className="mt-1">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="text-gray-100">
                                    {part}
                                  </strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </p>
                          );
                        }
                        return line ? (
                          <p key={i} className="mt-1">
                            {line}
                          </p>
                        ) : (
                          <br key={i} />
                        );
                      })}
                    </div>
                    {msg.model && (
                      <p className="text-xs text-gray-600 mt-2">
                        Model: {msg.model}
                      </p>
                    )}
                  </div>

                  {/* Retrieved Chunks Toggle */}
                  {msg.chunks && msg.chunks.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleChunks(msg.id)}
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                      >
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            expandedChunks.has(msg.id) ? "rotate-90" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                        {msg.chunks.length} source chunk
                        {msg.chunks.length !== 1 ? "s" : ""} retrieved
                      </button>

                      {expandedChunks.has(msg.id) && (
                        <div className="mt-2 space-y-2">
                          {msg.chunks.map((chunk, i) => (
                            <div
                              key={i}
                              className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-400">
                                  {chunk.documentName}
                                </span>
                                <span className="text-xs text-violet-400">
                                  Score: {(chunk.score * 100).toFixed(1)}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {chunk.text.substring(0, 300)}
                                {chunk.text.length > 300 ? "..." : ""}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">Classifying & retrieving...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
