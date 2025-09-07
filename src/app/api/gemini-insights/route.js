
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const { post } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Gemini API key" }, { status: 400 });
  }
  const prompt = `You are an expert rental product reviewer. Based on the following details, analyze and list exactly 3 to 5 pros and exactly 2 cons for this product.\n\nTitle: ${post.title}\nDescription: ${post.description}\nCategory: ${post.category}\nSubcategory: ${Array.isArray(post.subcategory) ? post.subcategory.join(', ') : post.subcategory}\nLocation: ${post.location}\nAvailable: ${post.availableFrom} to ${post.availableTo}\nOwner: ${post.ownerName}\nEmail: ${post.email}\nContact: ${post.contactNumber}\nRent Price: ${post.rentPrice}\n\nPlease provide clear, concise bullet points for both Pros and Cons, using all details above. Do not exceed the requested number of points.`;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
