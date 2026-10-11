"use client";

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Architecture</h1>
      <p className="text-gray-400 mb-8">
        The RAG (Retrieval-Augmented Generation) pipeline that powers DocuMind AI.
      </p>

      {/* Pipeline Diagram */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-6 text-center">RAG Pipeline Flow</h2>
        <div className="min-w-[700px]">
          <svg viewBox="0 0 900 400" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect width="900" height="400" fill="url(#grid)" />

            {/* Stage 1: Upload */}
            <rect x="30" y="140" width="140" height="120" rx="12" fill="url(#violet-grad)" stroke="#7c3aed" strokeWidth="1.5" />
            <text x="100" y="175" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="600">Upload</text>
            <text x="100" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10">PDF / TXT</text>
            <text x="100" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10">Documents</text>
            <text x="100" y="240" textAnchor="middle" fill="#6d28d9" fontSize="9">POST /api/upload</text>

            {/* Arrow 1 */}
            <line x1="170" y1="200" x2="210" y2="200" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
              </marker>
            </defs>

            {/* Stage 2: Chunking */}
            <rect x="210" y="140" width="140" height="120" rx="12" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="280" y="175" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="600">Text Chunking</text>
            <text x="280" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10">500-word chunks</text>
            <text x="280" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10">100-word overlap</text>
            <text x="280" y="240" textAnchor="middle" fill="#2563eb" fontSize="9">TF-IDF Indexing</text>

            {/* Arrow 2 */}
            <line x1="350" y1="200" x2="390" y2="200" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Stage 3: Jev AI */}
            <rect x="390" y="50" width="140" height="100" rx="12" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="460" y="85" textAnchor="middle" fill="#fcd34d" fontSize="13" fontWeight="600">Jev AI</text>
            <text x="460" y="105" textAnchor="middle" fill="#9ca3af" fontSize="10">Intent Classification</text>
            <text x="460" y="125" textAnchor="middle" fill="#d97706" fontSize="9">factual | analytical | summary</text>

            {/* Stage 3b: Vector Search */}
            <rect x="390" y="180" width="140" height="100" rx="12" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="460" y="215" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="600">Vector Search</text>
            <text x="460" y="235" textAnchor="middle" fill="#9ca3af" fontSize="10">Cosine Similarity</text>
            <text x="460" y="255" textAnchor="middle" fill="#2563eb" fontSize="9">Top-K Retrieval</text>

            {/* User Question input */}
            <rect x="390" y="310" width="140" height="60" rx="12" fill="url(#violet-grad)" stroke="#7c3aed" strokeWidth="1.5" />
            <text x="460" y="340" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="600">User Question</text>
            <text x="460" y="355" textAnchor="middle" fill="#6d28d9" fontSize="9">POST /api/ask</text>

            {/* Arrow from question to jev */}
            <line x1="460" y1="310" x2="460" y2="150" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Arrow from question to vector search */}
            <line x1="430" y1="310" x2="430" y2="280" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Arrow 4 from jev + vector to LLM */}
            <line x1="530" y1="100" x2="590" y2="170" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="530" y1="230" x2="590" y2="200" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Stage 4: LLM */}
            <rect x="590" y="140" width="140" height="120" rx="12" fill="url(#emerald-grad)" stroke="#10b981" strokeWidth="1.5" />
            <text x="660" y="175" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="600">OpenRouter LLM</text>
            <text x="660" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10">qwen3-coder:free</text>
            <text x="660" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10">Answer Generation</text>
            <text x="660" y="240" textAnchor="middle" fill="#059669" fontSize="9">Context + Classification</text>

            {/* Arrow 5 */}
            <line x1="730" y1="200" x2="770" y2="200" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Stage 5: Response */}
            <rect x="770" y="140" width="110" height="120" rx="12" fill="url(#violet-grad)" stroke="#7c3aed" strokeWidth="1.5" />
            <text x="825" y="175" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="600">Response</text>
            <text x="825" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10">AI Answer</text>
            <text x="825" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10">+ Sources</text>
            <text x="825" y="225" textAnchor="middle" fill="#9ca3af" fontSize="10">+ Scores</text>
            <text x="825" y="245" textAnchor="middle" fill="#6d28d9" fontSize="9">JSON Response</text>

            {/* Labels */}
            <text x="450" y="30" textAnchor="middle" fill="#6b7280" fontSize="11" fontStyle="italic">Query Processing Pipeline</text>
          </svg>
        </div>
      </div>

      {/* Component Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard
          title="Jev AI — Intent Classifier"
          color="amber"
          items={[
            "Classifies questions into: factual, analytical, summary",
            "Determines optimal retrieval strategy per question type",
            "Saves tokens by routing to appropriate pipeline depth",
            "Falls back to heuristic classification in demo mode",
          ]}
        />
        <ComponentCard
          title="Vector Store — TF-IDF"
          color="blue"
          items={[
            "In-memory vector store using TF-IDF term weighting",
            "Cosine similarity for document-query matching",
            "Stop word filtering for improved relevance",
            "Top-K retrieval (default: 3 chunks per query)",
          ]}
        />
        <ComponentCard
          title="Text Chunker"
          color="violet"
          items={[
            "Splits documents into 500-word overlapping chunks",
            "100-word overlap preserves context at boundaries",
            "Tokenization with punctuation normalization",
            "Per-chunk TF-IDF vectors computed on retrieval",
          ]}
        />
        <ComponentCard
          title="OpenRouter LLM"
          color="emerald"
          items={[
            "Uses qwen/qwen3-coder:free model via OpenRouter API",
            "Temperature adjusted by intent (0.3 factual, 0.7 analytical)",
            "System prompt tailored to classification result",
            "Demo mode returns pre-written answers when no API key",
          ]}
        />
      </div>
    </div>
  );
}

function ComponentCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  const colorMap: Record<string, string> = {
    violet: "border-violet-500/20 text-violet-400",
    blue: "border-blue-500/20 text-blue-400",
    emerald: "border-emerald-500/20 text-emerald-400",
    amber: "border-amber-500/20 text-amber-400",
  };

  const dotColor: Record<string, string> = {
    violet: "bg-violet-400",
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
  };

  return (
    <div className={`bg-gray-900/50 border ${colorMap[color]} rounded-xl p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${colorMap[color]?.split(" ").pop()}`}>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[color]} mt-1.5 shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
