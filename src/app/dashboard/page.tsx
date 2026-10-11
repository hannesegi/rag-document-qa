"use client";

import { useState, useEffect, useCallback } from "react";
import type { StatsData } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [loadStats]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Real-time analytics for your DocuMind AI knowledge base.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Documents"
          value={stats?.documentsUploaded ?? 0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          color="violet"
        />
        <StatCard
          label="Questions Asked"
          value={stats?.questionsAsked ?? 0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Tokens Saved"
          value={stats?.tokensSaved ?? 0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
          color="emerald"
          format
        />
        <StatCard
          label="Avg Relevance"
          value={stats?.avgRelevanceScore ?? 0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
          color="amber"
          isPercent
        />
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Token Savings Visual */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Token Savings</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Without Jev AI</span>
                <span className="text-gray-400">
                  {((stats?.tokensSaved ?? 0) + (stats?.questionsAsked ?? 0) * 400).toLocaleString()} tokens
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/60 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">With Jev AI</span>
                <span className="text-emerald-400">
                  {((stats?.questionsAsked ?? 0) * 400).toLocaleString()} tokens
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500/60 rounded-full"
                  style={{
                    width: `${
                      stats?.questionsAsked
                        ? Math.max(
                            20,
                            100 -
                              ((stats.tokensSaved /
                                (stats.tokensSaved + stats.questionsAsked * 400)) *
                                100)
                          )
                        : 50
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Jev AI intent classification routes queries to optimal pipelines,
              reducing unnecessary LLM token usage by up to 60%.
            </p>
          </div>
        </div>

        {/* Recent Questions */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Questions</h3>
          {stats?.recentQuestions && stats.recentQuestions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 mt-0.5 ${
                      q.intent === "factual"
                        ? "bg-blue-500/20 text-blue-300"
                        : q.intent === "analytical"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {q.intent}
                  </span>
                  <span className="text-gray-300 truncate">{q.question}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No questions asked yet. Go to the Chat page to start asking
              questions.
            </p>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem label="Vector Store" value="In-Memory TF-IDF" />
          <InfoItem label="Classifier" value="Jev AI (simulated)" />
          <InfoItem label="LLM Provider" value="OpenRouter (qwen3-coder:free)" />
          <InfoItem label="Chunk Size" value="500 words" />
          <InfoItem label="Chunk Overlap" value="100 words" />
          <InfoItem label="Top-K Retrieval" value="3 chunks" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  format,
  isPercent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  format?: boolean;
  isPercent?: boolean;
}) {
  const colorMap: Record<string, string> = {
    violet: "from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400",
  };

  const displayValue = isPercent
    ? `${(value * 100).toFixed(1)}%`
    : format
    ? value.toLocaleString()
    : value.toString();

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={colorMap[color]?.split(" ").pop()}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-100">{displayValue}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-lg">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-200 font-mono">{value}</span>
    </div>
  );
}
