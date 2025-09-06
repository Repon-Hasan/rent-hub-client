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
    <div className="bg-gray-50 rounded-xl p-4 w-full mx-auto px-2 sm:px-6 mt-4">
      <div className="font-semibold text-gray-800 text-xl mb-2 text-center">AI Insights</div>
      <div className="text-sm text-gray-500 mb-4 text-center">
        AI-generated insights based on product details
      </div>
      <div className="flex gap-3 items-start">
        
        <div className="w-full">
          
          {loading ? (
            <div className="text-sm text-blue-600">Loading AI summary...</div>
          ) : insights ? (
            <div className="text-sm text-gray-800 whitespace-pre-line">
              {/* Attempt to split Gemini output into Pros and Cons sections */}
              {(() => {
                const prosMatch = insights.match(/Pros:(.*?)(Cons:|$)/s);
                const consMatch = insights.match(/Cons:(.*)/s);
                // Remove asterisks from Gemini response
                const clean = (str) => str ? str.replace(/\*/g, '').trim() : null;
                  const pros = prosMatch ? clean(prosMatch[1]) : null;
                  const cons = consMatch ? clean(consMatch[1]) : null;
                  const prosList = pros ? pros.split(/\n|\r|•|-/).map(s => s.trim()).filter(Boolean).slice(0, 5) : [];
                  const consList = cons ? cons.split(/\n|\r|•|-/).map(s => s.trim()).filter(Boolean).slice(0, 2) : [];
                  return (
                    <>
                      <div className="mb-2">
                        <span className="font-semibold text-green-700">Pros</span>
                        <ul className="list-disc ml-6 text-gray-800">
                          {prosList.length
                            ? prosList.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))
                            : <li>No pros listed.</li>}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-red-700">Cons</span>
                        <ul className="list-disc ml-6 text-gray-800">
                          {consList.length
                            ? consList.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))
                            : <li>No cons listed.</li>}
                        </ul>
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