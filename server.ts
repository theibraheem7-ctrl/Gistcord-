import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. AI Counselor/Advisor Route
app.post("/api/gistcord/advisor", async (req, res) => {
  try {
    const { message, category, history } = req.body;
    const ai = getGeminiClient();

    const systemInstructionsMap: Record<string, string> = {
      "side-hustle": "You are the Gistcord Side Hustle strategist. Provide highly actionable, low-cost starter plans, profit projections, step-by-step guides for students, and suggest modern digital platforms they can utilize.",
      "agriculture": "You are the Gistcord Agric-Youth Coach. Advise on smart urban farming, small-scale hydroponics, agriculture technology, youth grants, and sustainable food business models.",
      "youth-empowerment": "You are the Gistcord Youth Empowerment specialist. Provide guidelines on vocational training, startup incubation programs, youth empowerment schemes, leadership development, and impact investing.",
      "ai-updates": "You are the Gistcord AI educator. Provide clear summaries of recent AI developments, prompt guides for academic learning, and tutoring strategies with AI.",
      "remote-work": "You are the Student Remote Work consultant. Share tips on landing student-friendly remote gigs, online marketplaces (Fiverr, Upwork, Contra), resume building, and balancing study-work hours.",
      "football": "You are the Gistcord Football Analyst. Provide analytical summaries of current teams, formations, tactical observations, and upcoming international/national tournament scopes.",
      "health": "You are the Student Well-being advisor. Provide realistic guidelines on ergonomics, posture, mental focus hacks, balanced diet on a student budget, and exercise schedules.",
      "ngos": "You are the NGO Opportunities director. Advise youth on volunteering advantages, finding fully-funded social impact fellowships, writing call-for-application letters, or launching grassroot non-profits.",
      "news": "You are the Gistcord Global, National and Political News analyst. Provide objective, well-summarized, non-partisan context on geopolitical events, fiscal policy updates, international developments, and general aspects of governmental laws.",
      "scholarships": "You are the Scholarship Navigator. Help high-achieving scholars structure application essays, locate international opportunities (Mastercard Foundation, Chevening, Rhodes, Erasmus Mundus), and prepare for interviews.",
      "digital-literacy": "You are the Global Impact Entrepreneurship coach. Guide young founders on building an online presence, social media growth hacks, content tools, local-to-global marketing, and basic SEO principles.",
      "trade": "You are the Export & Import business advisor. Consult on micro-freight, shipping logs, custom duties clearances, HS classification codes, international vendor relations, and global trade arbitrage setups.",
      "real-estate": "You are the Housing & Real Estate advisor. Assist with locating affordable student apartments, analyzing rental lease agreement safeguards, budgeting co-living expenses, and managing landlord communication.",
      "transport": "You are the Transportation & Urban Mobility strategist. Optimize commuting systems, travel schedules, delivery logistics for micro-commerce businesses, carbon footprints, and cost efficiency calculators.",
      "lifestyle": "You are the Gistcord Lifestyle & Balanced Growth mentor. Give advice on personal finances, student-friendly healthy cooking, creative leisure activities, and overall non-academic life aspects.",
    };

    const sysInstruction = (systemInstructionsMap[category] || "You are Gistcord Hub Counselor.") + 
      " Keep answers beautifully structured, encouraging, crisp, modern, and highly scannable using Markdown bullet points. Act as a peer mentor with deep expertise. No corporate fluff.";

    // Format chat history for model contents input
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "I could not generate advice at this moment.",
    });
  } catch (error: any) {
    console.error("Advisor generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred in Gistcord AI Assistant.",
    });
  }
});

// 2. Real-Time Search Grounded News & Updates Route
app.post("/api/gistcord/news", async (req, res) => {
  try {
    const { query, category } = req.body;
    const ai = getGeminiClient();

    // Formulate a structured search prompt based on category & input
    let searchTopic = query || "latest headlines";
    if (category === "football") {
      searchTopic = `latest football transfer updates match results news ${query || ""}`;
    } else if (category === "scholarships") {
      searchTopic = `latest scholarship updates deadlines 2026 for international students ${query || ""}`;
    } else if (category === "ngos") {
      searchTopic = `latest NGO youth empowerment opportunities call for applications ${query || ""}`;
    } else if (category === "general-news") {
      searchTopic = `latest national and international general headlines ${query || ""}`;
    } else {
      searchTopic = `latest news update on ${category} youth ${query || ""}`;
    }

    const sysInstruction = `You are Gistcord News Feed, a real-time news retrieval system.
Search for the requested topic. Compile 3 to 4 short, highly relevant, current news items or headlines.
For each item, write a short summary (30-50 words). Focus strictly on factual, verified information.
YOU MUST format the response in a structured way that lists these items clearly, including exact dates if possible. 
Write in an elegant, engaging news style with scannable bullet points. Maintain high journalistic standards.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: searchTopic,
      config: {
        systemInstruction: sysInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search citation grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri || "#",
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({
      success: true,
      text: response.text || "No news found currently.",
      sources,
    });
  } catch (error: any) {
    console.error("News search grounding error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Could not retrieve real-time news at this time.",
    });
  }
});

// Helper for starting Vite in dev mode, or serving build in production mode
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gistcord backend running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to boot Gistcord server:", err);
});
