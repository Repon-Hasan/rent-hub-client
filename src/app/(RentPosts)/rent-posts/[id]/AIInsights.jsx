"use client";
import React, { useEffect, useState } from "react";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function fetchGeminiInsights(post) {
  const res = await fetch("/api/gemini-insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.text || null;
}

const AIInsights = ({ post }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchGeminiInsights(post).then((result) => {
      if (!ignore) {
        setInsights(result);
        setLoading(false);
      }
    });
    return () => { ignore = true; };
  }, [post]);
  return (
    <div className="bg-base-200 text-base-content rounded-xl p-4 w-full mx-auto px-2 sm:px-6 mt-4">
      <div className="font-semibold text-base-content text-xl mb-2 text-center">AI Insights</div>
      <div className="text-sm text-base-content mb-4 text-center">
        AI-generated insights based on product details
      </div>
      <div className="flex gap-3 items-start">
        <div className="w-full">
          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-6 bg-base-100 rounded w-1/3 mx-auto" />
              <div className="h-4 bg-base-100 rounded w-2/3 mx-auto" />
              <div className="h-4 bg-base-100 rounded w-full" />
              <div className="h-4 bg-base-100 rounded w-5/6" />
              <div className="h-4 bg-base-100 rounded w-3/4" />
            </div>
          ) : insights ? (
            <div className="text-sm text-base-content whitespace-pre-line">
              {/* Attempt to split Gemini output into Pros and Cons sections */}
              {(() => {
                const prosMatch = insights.match(/Pros:(.*?)(Cons:|$)/s);
                const consMatch = insights.match(/Cons:(.*)/s);
                // Remove asterisks from Gemini response
                const clean = (str) => str ? str.replace(/\*/g, '').trim() : null;
                  const pros = prosMatch ? clean(prosMatch[1]) : null;
                  const cons = consMatch ? clean(consMatch[1]) : null;
                  // Improved line break handling: split on \r\n, \n, \r, bullet, or dash, but also normalize multiple breaks
                  const normalizeBreaks = (str) => str.replace(/\r\n|\r|\n/g, "\n");
                  const prosList = pros ? normalizeBreaks(pros).split(/\n|•|-/).map(s => s.trim()).filter(Boolean).slice(0, 5) : [];
                  const consList = cons ? normalizeBreaks(cons).split(/\n|•|-/).map(s => s.trim()).filter(Boolean).slice(0, 2) : [];
                  return (
                    <>
                      <div className="mb-2">
                        <span className="font-semibold text-green-700">Pros</span>
                        <div className="text-base-content mt-1">
                          {prosList.length
                            ? <p>{prosList.join(' ')}</p>
                            : <span>No pros listed.</span>}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-red-700">Cons</span>
                        <div className="text-base-content mt-1">
                          {consList.length
                            ? <p>{consList.join(' ')}</p>
                            : <span>No cons listed.</span>}
                        </div>
                      </div>
                    </>
                  );
              })()}
            </div>
          ) : (
            <div className="text-sm text-red-500">Could not fetch AI insights.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;