/**
 * Gistcord Global TypeScript Definitions
 */

export type GistCategory =
  | "side-hustle"
  | "agriculture"
  | "youth-empowerment"
  | "ai-updates"
  | "remote-work"
  | "football"
  | "health"
  | "ngos"
  | "news"
  | "scholarships"
  | "digital-literacy"
  | "trade"
  | "real-estate"
  | "transport"
  | "lifestyle";

export interface GistTopic {
  id: GistCategory;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string; // Dynamic icon selector
  badge: string;
  colorTheme: string; // CSS styling colors
  accentColor: string; // High-contrast marker color
}

export interface CuratedGuide {
  id: string;
  category: GistCategory;
  title: string;
  teaser: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  content: string[]; // Step-by-step points
  hotTip?: string;
  calculatorType?: "side-hustle" | "bmi" | "prompt-eval" | "mortgage" | "trade-calc" | null;
}

export interface SavedOpportunity {
  id: string;
  category: GistCategory;
  title: string;
  sourceType: string;
  notes?: string;
  deadline?: string;
  savedAt: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface GroundedNewsItem {
  title: string;
  uri: string;
}
