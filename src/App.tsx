import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Sprout,
  Award,
  Cpu,
  Laptop,
  Trophy,
  Activity,
  HeartHandshake,
  Globe,
  GraduationCap,
  TrendingUp,
  Calendar,
  Bookmark,
  ChevronRight,
  Info,
  Search,
  Plus,
  Trash,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Send,
  CheckCircle2,
  BookmarkCheck,
  Compass,
  AlertCircle,
  Clock,
  ChevronDown,
  Bell,
  BellOff,
  Facebook,
  Youtube,
  Linkedin,
  Phone,
  MapPin,
  MessageCircle,
  Share2,
  Mail
} from "lucide-react";

import { GIST_TOPICS, CURATED_GUIDES, SUGGESTED_PROMPTS } from "./data";
import { GistCategory, GistTopic, CuratedGuide, SavedOpportunity, ChatMessage, GroundedNewsItem } from "./types";
import GistCalculators from "./components/GistCalculators";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "academy" | "planner">("dashboard");

  // Ibrahim Umar's Contact Address and Editing States
  const [contactAddress, setContactAddress] = useState<string>(() => {
    const rawVal = localStorage.getItem("gistcord_contact_address");
    const oldDefault = "Central Business District, Abuja, FCT, Nigeria";
    const previousNewDefault = "Suite 302, 3rd Floor, Grand Bilal Plaza, Plot 1042, Constitution Avenue, Central Business District, Abuja, FCT, 900211, Nigeria";
    const fullNewDefault = "House No: 8, Amusco plaza, River Niger, Galadimawa Area, Abuja, Federal Capital Territory, 900211, Nigeria";
    if (!rawVal || rawVal === oldDefault || rawVal === previousNewDefault) {
      return fullNewDefault;
    }
    return rawVal;
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(contactAddress);

  const handleSaveContactAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setContactAddress(addressInput);
    try {
      localStorage.setItem("gistcord_contact_address", addressInput);
    } catch (_) {}
    setIsEditingAddress(false);
  };
  
  // Category selection (15 topics possible)
  const [selectedCategory, setSelectedCategory] = useState<GistCategory>("side-hustle");
  
  // Search state to filter the 15 categories in the left rail
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Saved Opportunities (peristed in localStorage)
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  // Individual creation state for the workboard
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Scholarship");
  const [newNotes, setNewNotes] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // AI Chat states mapped by category to retain user conversations
  const [chatHistories, setChatHistories] = useState<Record<GistCategory, ChatMessage[]>>(() => {
    const initial: Partial<Record<GistCategory, ChatMessage[]>> = {};
    GIST_TOPICS.forEach((topic) => {
      initial[topic.id] = [
        {
          id: `welcome-${topic.id}`,
          role: "model",
          text: `Hello! I am your Gistcord expert advisor for **${topic.title}**. Ask me any practical design plan, grant application query, or step-by-step strategy. Select one of the quick presets below to begin!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ];
    });
    return initial as Record<GistCategory, ChatMessage[]>;
  });
  const [chatInputs, setChatInputs] = useState<Record<GistCategory, string>>(() => {
    const initial: Partial<Record<GistCategory, string>> = {};
    GIST_TOPICS.forEach((topic) => {
      initial[topic.id] = "";
    });
    return initial as Record<GistCategory, string>;
  });
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Grounded News queries mapped by category
  const [newsQueryInputs, setNewsQueryInputs] = useState<Record<string, string>>({});
  const [newsResults, setNewsResults] = useState<Record<string, { text: string; sources: GroundedNewsItem[]; loading: boolean; error: string | null }>>({});

  // Local notification states and permission
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  
  // Track last news query checks in state and local storage
  const [lastNewsCheckTimes, setLastNewsCheckTimes] = useState<Record<GistCategory, number>>(() => {
    try {
      const stored = localStorage.getItem("gistcord_news_checks");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    
    const initial: Partial<Record<GistCategory, number>> = {};
    const now = Date.now();
    GIST_TOPICS.forEach((topic) => {
      initial[topic.id] = now;
    });
    return initial as Record<GistCategory, number>;
  });

  const [newsAlert, setNewsAlert] = useState<{ category: GistCategory; topicTitle: string; message: string; elapsedMinutes: number } | null>(null);

  const updateNewsCheckTime = (category: GistCategory, timestamp: number) => {
    setLastNewsCheckTimes(prev => {
      const updated = { ...prev, [category]: timestamp };
      try {
        localStorage.setItem("gistcord_news_checks", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const triggerNotificationForCategory = (category: GistCategory, forcedTime?: number) => {
    const topic = GIST_TOPICS.find((t) => t.id === category);
    if (!topic) return;

    const baseCheck = forcedTime !== undefined ? forcedTime : (lastNewsCheckTimes[category] || Date.now());
    const elapsedMinutes = Math.round((Date.now() - baseCheck) / (60 * 1000));
    const message = `You haven't checked Grounded News for your chosen "${topic.title}" sector in over an hour (${elapsedMinutes} mins idle). Live updates on the global wire are waiting!`;

    // 1. Browser API Web Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        const _n = new Notification(`Grounded News Alert: ${topic.shortTitle}`, {
          body: `Keep up with rapid industry transformations! ${message}`,
          icon: "/favicon.ico",
          tag: `news-check-${category}`
        });
      } catch (err) {
        console.warn("System web notification failed inside iframe container context:", err);
      }
    }

    // 2. In-app notification state
    setNewsAlert({
      category,
      topicTitle: topic.title,
      message,
      elapsedMinutes
    });
  };

  // Sync notification state on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const res = await Notification.requestPermission();
        setNotificationPermission(res);
      } catch (err) {
        console.warn("Could not request notification permission:", err);
      }
    }
  };

  // Periodic interval checks (every 12 seconds)
  useEffect(() => {
    const ONE_HOUR = 3600000;
    const interval = setInterval(() => {
      const now = Date.now();
      const lastCheck = lastNewsCheckTimes[selectedCategory] || now;
      if (now - lastCheck >= ONE_HOUR) {
        triggerNotificationForCategory(selectedCategory);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [selectedCategory, lastNewsCheckTimes]);

  // Digital growth academy checklists
  const [completedAcademyLessons, setCompletedAcademyLessons] = useState<string[]>([]);
  
  // Scroller ticker state representing live national & international summary
  const tickerItems = [
    "⚡ INTERNATIONAL: High-achieving master scholars program accepting draft essays for the winter cycle.",
    "⚽ SPORTS: Football tactical meta shifts toward high velocity double-pivots in elite European leagues.",
    "🌱 AGRICULTURE: Fast urban hydroponics match grants launched by regional youth development leagues.",
    "📈 DIGI-LITERACY: Local export-import agents leverage automated search algorithms to source global clients.",
    "🏠 HOUSING: Co-living rental agreement legal audits become primary student protection requirements."
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  // Autoscroll chat window ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load and Save Local Storage bindings
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gistcord_saved");
      if (stored) {
        setSavedOpportunities(JSON.parse(stored));
      }
    } catch (_) {}
    
    try {
      const storedLessons = localStorage.getItem("gistcord_academy");
      if (storedLessons) {
        setCompletedAcademyLessons(JSON.parse(storedLessons));
      }
    } catch (_) {}
  }, []);

  const persistSavedOpportunities = (updated: SavedOpportunity[]) => {
    setSavedOpportunities(updated);
    try {
      localStorage.setItem("gistcord_saved", JSON.stringify(updated));
    } catch (_) {}
  };

  const persistAcademyLessons = (updated: string[]) => {
    setCompletedAcademyLessons(updated);
    try {
      localStorage.setItem("gistcord_academy", JSON.stringify(updated));
    } catch (_) {}
  };

  // Rotating header ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Softscroll to end of active chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistories, selectedCategory, chatLoading]);

  // Handler: Add custom target item to local scholar planner
  const handleAddNewOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: SavedOpportunity = {
      id: `custom-${Date.now()}`,
      category: selectedCategory,
      title: newTitle,
      sourceType: newType,
      notes: newNotes,
      deadline: newDeadline || "flexible",
      savedAt: new Date().toLocaleDateString()
    };

    const updated = [added, ...savedOpportunities];
    persistSavedOpportunities(updated);
    setNewTitle("");
    setNewNotes("");
    setNewDeadline("");
  };

  // Handler: Save calculated goal results directly to scholar planner
  const handleSaveResult = (calcResult: { title: string; notes: string }) => {
    const added: SavedOpportunity = {
      id: `calc-${Date.now()}`,
      category: selectedCategory,
      title: calcResult.title,
      sourceType: "Calculated Target",
      notes: calcResult.notes,
      deadline: "target schedule",
      savedAt: new Date().toLocaleDateString()
    };
    const updated = [added, ...savedOpportunities];
    persistSavedOpportunities(updated);
    setActiveTab("planner");
  };

  // Handler: Save curated playbooks directly with one click
  const handleBookmarkGuide = (guide: CuratedGuide) => {
    // Avoid duplicates
    if (savedOpportunities.some(o => o.title.includes(guide.title))) {
      return;
    }
    const added: SavedOpportunity = {
      id: `guide-bookmark-${guide.id}`,
      category: guide.category,
      title: `Saved Playbook: ${guide.title}`,
      sourceType: "Guide Resource",
      notes: `Curated Guide difficulty: ${guide.difficulty}. Teaser: ${guide.teaser}`,
      deadline: "Review Goal",
      savedAt: new Date().toLocaleDateString()
    };
    const updated = [added, ...savedOpportunities];
    persistSavedOpportunities(updated);
  };

  // Handler: Send AI messages via server endpoints
  const handleSendChatMessage = async (presetText?: string) => {
    const currentInput = presetText || chatInputs[selectedCategory] || "";
    if (!currentInput.trim() || chatLoading) return;

    setChatLoading(true);
    setChatError(null);

    // Append user message instantly
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const currentHistory = chatHistories[selectedCategory] || [];
    const updatedHistory = [...currentHistory, userMsg];
    
    setChatHistories(prev => ({
      ...prev,
      [selectedCategory]: updatedHistory
    }));

    if (!presetText) {
      setChatInputs(prev => ({ ...prev, [selectedCategory]: "" }));
    }

    try {
      // Package query payload limiting conversational history payload for optimal latency to server
      const payload = {
        message: currentInput,
        category: selectedCategory,
        history: updatedHistory.slice(-6).map(m => ({ role: m.role, text: m.text }))
      };

      const res = await fetch("/api/gistcord/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Unable to contact Gistcord AI. Confirm that GEMINI_API_KEY is configured.");
      }

      const data = await res.json();
      if (data.success) {
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setChatHistories(prev => ({
          ...prev,
          [selectedCategory]: [...prev[selectedCategory], modelMsg]
        }));
      } else {
        throw new Error(data.error || "Problem compiling content models.");
      }
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "Unable to reach Gemini neural interface.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handler: Search live Grounded News
  const handleQueryGroundedNews = async () => {
    // Record this query check time
    updateNewsCheckTime(selectedCategory, Date.now());
    if (newsAlert && newsAlert.category === selectedCategory) {
      setNewsAlert(null);
    }

    const activeQuery = newsQueryInputs[selectedCategory] || "";
    setNewsResults(prev => ({
      ...prev,
      [selectedCategory]: { text: "", sources: [], loading: true, error: null }
    }));

    try {
      const res = await fetch("/api/gistcord/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          category: selectedCategory
        })
      });

      if (!res.ok) {
        throw new Error("News grounding server unreachable.");
      }

      const data = await res.json();
      if (data.success) {
        setNewsResults(prev => ({
          ...prev,
          [selectedCategory]: {
            text: data.text,
            sources: data.sources || [],
            loading: false,
            error: null
          }
        }));
      } else {
        throw new Error(data.error || "News query failed to yield matches.");
      }
    } catch (err: any) {
      setNewsResults(prev => ({
        ...prev,
        [selectedCategory]: {
          text: "",
          sources: [],
          loading: false,
          error: err.message || "Failed to search network files."
        }
      }));
    }
  };

  // Helper dynamic color lookups for matching accent color indicators
  const getAccentBorderClass = (accent: string) => {
    switch (accent) {
      case "emerald": return "border-emerald-500/20 text-emerald-400";
      case "green": return "border-green-500/20 text-green-400";
      case "cyan": return "border-cyan-500/20 text-cyan-400";
      case "blue": return "border-blue-500/20 text-blue-400";
      case "amber": return "border-amber-500/20 text-amber-400";
      case "rose": return "border-rose-500/20 text-rose-400";
      case "purple": return "border-purple-500/20 text-purple-400";
      case "indigo": return "border-indigo-400/20 text-indigo-300";
      case "yellow": return "border-yellow-500/20 text-yellow-400";
      case "sky": return "border-sky-500/20 text-sky-400";
      case "teal": return "border-teal-500/20 text-teal-400";
      case "orange": return "border-orange-500/20 text-orange-400";
      case "violet": return "border-violet-500/20 text-violet-400";
      case "pink": return "border-pink-500/20 text-pink-400";
      default: return "border-slate-500/20 text-slate-400";
    }
  };

  const getAccentBgClass = (accent: string) => {
    switch (accent) {
      case "emerald": return "bg-emerald-500 text-slate-950";
      case "green": return "bg-green-500 text-slate-950";
      case "cyan": return "bg-cyan-500 text-slate-950";
      case "blue": return "bg-blue-500 text-white";
      case "amber": return "bg-amber-500 text-slate-950";
      case "rose": return "bg-rose-500 text-white";
      case "purple": return "bg-purple-500 text-white";
      case "indigo": return "bg-indigo-500 text-white";
      case "yellow": return "bg-yellow-500 text-slate-950";
      case "sky": return "bg-sky-500 text-slate-950";
      case "teal": return "bg-teal-500 text-slate-950";
      case "orange": return "bg-orange-500 text-slate-950";
      case "violet": return "bg-violet-500 text-white";
      case "pink": return "bg-pink-500 text-slate-950";
      default: return "bg-slate-500 text-white";
    }
  };

  const getHighlightClass = (accent: string) => {
    switch (accent) {
      case "emerald": return "text-emerald-300";
      case "green": return "text-green-300";
      case "cyan": return "text-cyan-300";
      case "blue": return "text-blue-300";
      case "amber": return "text-amber-300";
      case "rose": return "text-rose-300";
      case "purple": return "text-purple-300";
      case "indigo": return "text-indigo-300";
      case "yellow": return "text-yellow-300";
      case "sky": return "text-sky-300";
      case "teal": return "text-teal-300";
      case "orange": return "text-orange-300";
      case "violet": return "text-violet-300";
      case "pink": return "text-pink-300";
      default: return "text-slate-300";
    }
  };

  // Helper: Filter categories dynamically on left rail search query
  const filteredTopics = GIST_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    topic.shortTitle.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    topic.badge.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Active category parameters
  const currentTopic = GIST_TOPICS.find((t) => t.id === selectedCategory) || GIST_TOPICS[0];
  const activeGuides = CURATED_GUIDES.filter((g) => g.category === selectedCategory);
  const activeSuggested = SUGGESTED_PROMPTS[selectedCategory] || [];

  // Digital Growth Training Academy static lessons schema
  const academyLessons = [
    {
      id: "lesson-01",
      topic: "Digital Consulting Setup",
      hours: "1.5h",
      objective: "Defining individual high-demand digital skills (Canva layouts, SEO review, copywriting) and pricing standard packages on freelance service marketplaces (Contra/Fiverr)."
    },
    {
      id: "lesson-02",
      topic: "Organic Content Engineering",
      hours: "2h",
      objective: "Structuring engaging shorter format educational videos, utilizing search engine optimization (SEO) captions, and managing dynamic automated content scheduling assets dynamically."
    },
    {
      id: "lesson-03",
      topic: "Cold Outreach Funnel Master",
      hours: "2.5h",
      objective: "Formulating crisp cold pitch emails (under 120 words) stating immediate value audits to win small businesses retainers of up to $200 per week."
    },
    {
      id: "lesson-04",
      topic: "Export-Import Sourcing Systems",
      hours: "3h",
      objective: "Understanding global air-freight structures, commercial logistics tracking steps, customs clearing agents clearance logs, and land-cost formulas."
    },
    {
      id: "lesson-05",
      topic: "Real Estate Tennant Lease Safeties",
      hours: "1.5h",
      objective: "Evaluating tenant agreement clauses, inspecting properties virtually, analyzing utility meters, and structuring flat co-living budget splits."
    },
    {
      id: "lesson-06",
      topic: "International Scholars Fellowship Craft",
      hours: "3.5h",
      objective: "Polishing academic essay narratives hook introduction grids, leadership results records, and mapping actions directly with Sustainable Development Goals."
    }
  ];

  // Helper dynamic icon resolver cleanly mapped
  const renderSectorIcon = (icName: string, styling: string) => {
    switch (icName) {
      case "Briefcase": return <Briefcase className={styling} />;
      case "Sprout": return <Sprout className={styling} />;
      case "Award": return <Award className={styling} />;
      case "Cpu": return <Cpu className={styling} />;
      case "Laptop": return <Laptop className={styling} />;
      case "Trophy": return <Trophy className={styling} />;
      case "Activity": return <Activity className={styling} />;
      case "HeartHandshake": return <HeartHandshake className={styling} />;
      case "Globe": return <Globe className={styling} />;
      case "GraduationCap": return <GraduationCap className={styling} />;
      case "TrendingUp": return <TrendingUp className={styling} />;
      case "Calendar": return <Calendar className={styling} />;
      case "Bookmark": return <Bookmark className={styling} style={{ fill: "currentColor" }} />;
      case "ChevronRight": return <ChevronRight className={styling} />;
      case "Info": return <Info className={styling} />;
      default: return <Info className={styling} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-slate-800 selection:text-white">
      
      {/* 1. TOP BAR TICKER (National & Geopolitical news highlights) */}
      <div className="bg-[#0b0f16] border-b border-white/5 py-2 px-4 shadow-sm text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-mono text-[10px] bg-rose-950/60 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/20 select-none uppercase tracking-wider">
              Live National & Global Desk
            </span>
          </div>
          <div className="h-6 overflow-hidden flex-1 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tickerIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] text-slate-300 font-medium font-serif"
              >
                {tickerItems[tickerIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* 2. CHIEF GISTCORD NAVIGATION HEADER */}
      <header className="border-b border-white/5 bg-[#0a0e14]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center p-0.5 shadow-md">
              <span className="text-sm font-bold text-slate-950 tracking-tighter">G</span>
            </div>
            <div>
              <span className="text-sm font-medium tracking-wide text-white uppercase font-mono">
                GIST<b className="text-amber-400">CORD</b>
              </span>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Entrepreneurship & News Desk</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-[#10161f] border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === "dashboard"
                    ? "bg-slate-800 text-amber-400 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Interactive Hub
              </button>
              <button
                onClick={() => setActiveTab("academy")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === "academy"
                    ? "bg-slate-800 text-amber-400 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Growth Academy
              </button>
              <button
                onClick={() => setActiveTab("planner")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all relative ${
                  activeTab === "planner"
                    ? "bg-slate-800 text-amber-400 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Scholar Workboard
                {savedOpportunities.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {savedOpportunities.length}
                  </span>
                )}
              </button>
            </nav>

            {/* HIGHLY VISIBLE Direct Email Trigger button */}
            <a
              href="mailto:theibraheem7@gmail.com"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 border border-amber-400/20 group hover:scale-[1.02]"
              id="top-bar-email-btn"
              title="Mail Ibrahim Umar directly"
            >
              <Mail className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-all" />
              <span className="font-bold italic">theibraheem7@gmail.com</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. MAIN ARENA BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
        
        {/* GLOBAL HOVER NOTIFICATION BANNER */}
        <AnimatePresence>
          {newsAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="mb-6 overflow-hidden"
              id="grounded-news-global-alert"
            >
              <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/10 to-slate-900 border border-amber-500/20 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl relative">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">Staleness Warning</span>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded border border-white/5">
                        +{newsAlert.elapsedMinutes}m idle
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1">Inactive News Tracker: {newsAlert.topicTitle}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mt-0.5">
                      {newsAlert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      // Navigate directly to dashboard + trigger news check
                      setActiveTab("dashboard");
                      setSelectedCategory(newsAlert.category);
                      handleQueryGroundedNews();
                      setNewsAlert(null);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    id="trigger-news-query-alert-btn"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Query News Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsAlert(null)}
                    className="px-3.5 py-1.5 bg-[#10151e] hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl border border-white/5 transition-all cursor-pointer"
                    id="dismiss-news-query-alert-btn"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABS STAGE CONTROLLER */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE CATEGORIES & MENTOR DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* LEFT RAIL: DYNAMIC SECTOR CATALOG SEARCH & SELECT (15 Categories) */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Search bar inside rail */}
                <div className="bg-[#0c121a] border border-white/5 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Sector Channels</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-950 p-1 rounded border border-white/5">{GIST_TOPICS.length} Channels</span>
                  </div>
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      className="w-full bg-[#101620] border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Search sectors..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Vertically scrollable categories on desktop, grid on small devices */}
                  <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                    {filteredTopics.map((topic) => {
                      const isSelected = selectedCategory === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setSelectedCategory(topic.id);
                            // Auto trigger news refresh if not queries
                            if (!newsResults[topic.id]) {
                              // non-blocking
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? `bg-slate-900 border-white/10 ${getAccentBorderClass(topic.accentColor)} shadow-lg`
                              : "bg-[#111721]/30 border-transparent hover:bg-[#111721] hover:border-white/5"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${
                            isSelected
                              ? "bg-slate-950 text-amber-400"
                              : "bg-slate-950/60 text-slate-500"
                          }`}>
                            {renderSectorIcon(topic.iconName, "w-4 h-4")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-semibold truncate ${isSelected ? "text-amber-300 font-bold" : "text-slate-300"}`}>
                                {topic.shortTitle}
                              </span>
                              <span className="text-[9px] scale-90 font-mono text-slate-500 px-1 py-0.2 rounded border border-white/5 whitespace-nowrap bg-slate-950">
                                {topic.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{topic.description}</p>
                          </div>
                        </button>
                      );
                    })}

                    {filteredTopics.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-500">
                        No sectors match your query.
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Rail Stat Board */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-xs space-y-3">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Workspace Activity</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#0b0f16] p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 block">Saved Items</span>
                      <strong className="text-md text-amber-400 font-bold font-mono">{savedOpportunities.length}</strong>
                    </div>
                    <div className="bg-[#0b0f16] p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 block">Lessons Passed</span>
                      <strong className="text-md text-teal-400 font-bold font-mono">{completedAcademyLessons.length}/6</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* CENTER & RIGHT ARENA: ACTIVE CHOSEN SECTOR DETAIL PANELS */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* TOP DETAILED SECTOR HERO BAR (Span full 12 columns) */}
                <div className="md:col-span-12">
                  <div className={`p-6 rounded-2xl bg-gradient-to-r ${currentTopic.colorTheme} border border-white/5 shadow-xl relative overflow-hidden`}>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-slate-950 text-amber-400 text-[10px] font-mono font-bold rounded border border-white/10 uppercase select-none">
                            {currentTopic.badge}
                          </span>
                          <span className="text-slate-500 text-[10px]">&ldquo;{currentTopic.shortTitle} Gist Channel&rdquo;</span>
                        </div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          {renderSectorIcon(currentTopic.iconName, "w-5 h-5 text-amber-400")}
                          {currentTopic.title}
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1.5">
                          {currentTopic.description}
                        </p>
                      </div>
                      <div className="flex md:self-center">
                        <button
                          onClick={() => {
                            // save active workspace state to memory
                            handleBookmarkGuide({
                              id: `manual-${currentTopic.id}`,
                              category: currentTopic.id,
                              title: `${currentTopic.title} Comprehensive Manual`,
                              teaser: currentTopic.description,
                              readTime: "3m read",
                              difficulty: "Beginner",
                              content: []
                            });
                          }}
                          className={`px-3 py-1.5 ${getAccentBgClass(currentTopic.accentColor)} text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md`}
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          Bookmark Channel
                        </button>
                      </div>
                    </div>
                    {/* Visual pattern ornament in background to avoid empty canvas feel */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                  </div>
                </div>

                {/* COLUMN A (6/12): CURATED MANUAL PLAYBOOKS & CALCULATORS */}
                <div className="md:col-span-6 space-y-6">
                  
                  {/* PLAYBOOK BLOCK */}
                  <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Curated Gist Playbooks</span>
                      <span className="px-1.5 py-0.5 bg-slate-950 text-slate-500 text-[9px] font-mono font-bold rounded border border-white/5">
                        {activeGuides.length} Manuals
                      </span>
                    </div>

                    <div className="space-y-4">
                      {activeGuides.map((guide) => (
                        <div key={guide.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 hover:border-slate-700/60 transition-all">
                          <div className="flex justify-between items-center mb-1 text-[10px]">
                            <span className="text-slate-500 font-medium">{guide.readTime}</span>
                            <span className="px-1.5 py-0.2 bg-slate-950 text-amber-500 font-bold rounded scale-90 border border-white/5">
                              {guide.difficulty}
                            </span>
                          </div>
                          
                          <h3 className="text-xs font-bold text-slate-200 mb-2 leading-snug">{guide.title}</h3>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed mb-3">{guide.teaser}</p>
                          
                          <div className="space-y-1.5 pl-1.5 border-l-2 border-amber-500/20 mb-3 text-[11px] text-slate-300">
                            {guide.content.map((point, index) => (
                              <p key={index} className="leading-relaxed">
                                <b className="text-amber-400">{index + 1}.</b> {point}
                              </p>
                            ))}
                          </div>

                          {guide.hotTip && (
                            <div className="bg-[#121c17] border border-emerald-900/30 p-2.5 rounded-xl text-[10.5px] text-emerald-300/90 leading-relaxed mb-3">
                              <span className="font-bold uppercase tracking-wider block text-[8.5px] text-emerald-400 mb-0.5 select-none">💡 Hot Resource Tip:</span>
                              {guide.hotTip}
                            </div>
                          )}

                          {/* Action button inside playbooks */}
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleBookmarkGuide(guide)}
                              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-[10px] font-bold text-slate-300 border border-white/5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3 text-amber-400" />
                              Add to Saved Board
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeGuides.length === 0 && (
                        <div className="text-center py-10 text-xs text-slate-500">
                          No direct static templates. Use the AI strategist channel to construct custom layouts!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INTERACTIVE COMPONENT: CORRESPONDING PORTABLE ESTIMATOR */}
                  {currentTopic.id && (
                    <GistCalculators
                      type={
                        selectedCategory === "side-hustle" ? "side-hustle" :
                        selectedCategory === "health" ? "bmi" :
                        selectedCategory === "ai-updates" ? "prompt-eval" :
                        selectedCategory === "trade" ? "trade-calc" :
                        selectedCategory === "real-estate" ? "mortgage" : "side-hustle"
                      }
                      onSaveResult={handleSaveResult}
                    />
                  )}

                </div>

                {/* COLUMN B (6/12): AI STRATEGIST CHAT & NEWSGROUNDING SEC */}
                <div className="md:col-span-6 space-y-6">
                  
                  {/* AI STRATEGIST CONSOLE BLOCK */}
                  <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col h-[460px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">AI Strategy Channel</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                        gemini-3.5-flash
                      </span>
                    </div>

                    {/* Messages Panel */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                      {chatHistories[selectedCategory]?.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[85%] ${
                            msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                          }`}
                        >
                          <span className="text-[8.5px] font-mono text-slate-600 mb-0.5">{msg.timestamp}</span>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.role === "user"
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-[#111721] text-slate-200 border border-white/5 rounded-tl-none font-serif"
                            }`}
                          >
                            {/* Render basic markdown-like lines nicely */}
                            {msg.text.split("\n").map((line, index) => {
                              if (line.startsWith("**") || line.startsWith("##")) {
                                return <strong key={index} className="block text-amber-300 mt-1 mb-0.5">{line.replace(/\*\*/g, "")}</strong>;
                              }
                              if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                                return <p key={index} className="pl-3.5 py-0.5 relative before:content-[''] before:absolute before:left-1 before:top-2 before:w-1 before:h-1 before:bg-amber-400 before:rounded-full">{line.replace(/^-\s*|^\*\s*/, "")}</p>;
                              }
                              return <p key={index} className="mb-1">{line}</p>;
                            })}
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex mr-auto items-start max-w-[85%]">
                          <div className="p-3 bg-[#111721] text-slate-500 border border-white/5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            <span>Retrieving Strategic models...</span>
                          </div>
                        </div>
                      )}

                      {chatError && (
                        <div className="p-3 bg-rose-950/40 border border-rose-900/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{chatError}</span>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Presets Prompt Matrix */}
                    {activeSuggested.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Choose a Strategy Quick-Start:</span>
                        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-h-[85px]">
                          {activeSuggested.map((prompt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendChatMessage(prompt)}
                              disabled={chatLoading}
                              className="text-[9.5px] bg-[#111620] hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-white/5 whitespace-nowrap text-left transition-colors cursor-pointer"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Send Area */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChatMessage();
                      }}
                      className="mt-3 flex gap-2"
                    >
                      <input
                        type="text"
                        className="flex-1 bg-[#101620] border border-white/5 rounded-xl px-3 py-2 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder={`Message ${currentTopic.shortTitle} expert...`}
                        value={chatInputs[selectedCategory] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setChatInputs(prev => ({ ...prev, [selectedCategory]: val }));
                        }}
                        disabled={chatLoading}
                      />
                      <button
                        type="submit"
                        disabled={chatLoading}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* GROUNDED REAL-TIME NEWS WIRE */}
                  <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Grounded News search</span>
                      </div>
                      <span className="font-mono text-[9px] bg-[#0e1c16] text-[#2ebd82] font-bold px-1.5 py-0.2 rounded border border-[#23815b]/20 select-none uppercase tracking-wider">
                        Google Search API
                      </span>
                    </div>

                    {/* SYSTEM NOTIFICATION DESK */}
                    <div className="bg-[#111721] p-3 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs" id="notifications-control-panel">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-900 rounded-lg border border-white/5">
                          <Bell className={`w-4 h-4 ${notificationPermission === "granted" ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">Local news reminders</div>
                          <div className="text-[10px] text-slate-500">Triggers if sector is left unqueried for 1+ hours</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 sm:justify-end">
                        {notificationPermission === "default" && (
                          <button
                            type="button"
                            onClick={requestNotificationPermission}
                            className="bg-[#1b2535] hover:bg-slate-800 text-indigo-300 font-bold px-2.5 py-1 text-[10px] rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                            id="request-notifications-btn"
                          >
                            Allow Notifications
                          </button>
                        )}
                        {notificationPermission === "granted" && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                            🔔 Enabled
                          </span>
                        )}
                        {notificationPermission === "denied" && (
                          <span className="text-[10px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                            🔕 Blocked
                          </span>
                        )}
                        
                        {/* Simulation trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            // Backdate the timestamp to 65 minutes ago (3,900,000 ms)
                            const backdated = Date.now() - 3900000;
                            updateNewsCheckTime(selectedCategory, backdated);
                            // Instantly fire the trigger check to show the interactive result!
                            triggerNotificationForCategory(selectedCategory, backdated);
                          }}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold px-2 py-1 text-[10px] rounded-lg border border-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
                          title="Simulate haven't checked for news in 1 hour"
                          id="simulate-staleness-btn"
                        >
                          ⏰ Simulate 1H Idle
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-[#101620] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Type filter keyword, e.g. international transfers or chevening deadlines..."
                          value={newsQueryInputs[selectedCategory] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewsQueryInputs(prev => ({ ...prev, [selectedCategory]: val }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleQueryGroundedNews}
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-semibold rounded-xl text-xs hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
                        >
                          <Search className="w-3 h-3" />
                          Query News
                        </button>
                      </div>

                      {/* Output results */}
                      <div className="space-y-3">
                        {newsResults[selectedCategory]?.loading && (
                          <div className="text-center py-6 text-xs text-slate-500 flex items-center justify-center gap-2">
                            <span className="inline-block w-3.5 h-3.5 border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin"></span>
                            <span>Crawling and parsing news networks...</span>
                          </div>
                        )}

                        {newsResults[selectedCategory]?.error && (
                          <div className="p-3 bg-rose-950/40 border border-rose-900/30 text-rose-300 rounded-xl text-xs">
                            {newsResults[selectedCategory].error}
                          </div>
                        )}

                        {newsResults[selectedCategory]?.text && (
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3 text-xs leading-relaxed max-h-[220px] overflow-y-auto">
                            
                            {/* Summary Text representation */}
                            <div className="text-slate-200 text-[11.5px] font-serif space-y-2">
                              {newsResults[selectedCategory].text.split("\n").map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                            </div>

                            {/* Cited Grounded Sources */}
                            {newsResults[selectedCategory].sources?.length > 0 && (
                              <div className="pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">References & Citations:</span>
                                <div className="space-y-1 pl-1">
                                  {newsResults[selectedCategory].sources.map((src, i) => (
                                    <a
                                      key={i}
                                      href={src.uri}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-emerald-400 hover:underline hover:text-emerald-300 transition-all flex items-center gap-1.5 text-[10px] leading-relaxed truncate"
                                    >
                                      <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                                      {src.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {!newsResults[selectedCategory] && (
                          <div className="text-center py-6 text-[11px] text-slate-500 bg-[#111620]/30 rounded-2xl border border-dashed border-white/5">
                            Click <b className="text-slate-300">Query News</b> to fetch instant Google grounded bulletins.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: GLOBAL ENTREPRENEURSHIP DIGITAL GROWTH ACADEMY */}
          {activeTab === "academy" && (
            <motion.div
              key="tab-academy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              
              {/* Academy Hub Intro Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-sky-950/20 to-slate-950 border border-white/5 relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 bg-blue-950 text-blue-300 text-[10px] uppercase font-mono font-bold rounded border border-blue-500/20 tracking-wider">
                      Global Outreach Accelerator
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1.5">Digital Service Training Academy</h2>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1">
                      Acquire actionable vocational digital literaries. Complete core assignments to raise overall global impact markers and track developmental competencies offline.
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-center min-w-[125px]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-semibold mb-1">Impact Score</span>
                    <strong className="text-2xl font-bold font-mono text-cyan-400 select-all">
                      {completedAcademyLessons.length * 15} <b className="text-xs text-slate-500 font-normal">pts</b>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Lesson Items */}
              <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 block pb-2 border-b border-white/5">
                  Core Acceleration Track Checklist
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {academyLessons.map((lesson) => {
                    const isCompleted = completedAcademyLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-[#101b17]/60 border-emerald-500/20 text-emerald-100"
                            : "bg-[#111721]/60 border-white/5 text-slate-200 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`}></span>
                            <span className="text-xs font-bold text-slate-100">{lesson.topic}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-slate-950 border border-white/5">{lesson.hours}</span>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-slate-400 mb-3">{lesson.objective}</p>
                        
                        <div className="flex justify-end pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = isCompleted
                                ? completedAcademyLessons.filter(id => id !== lesson.id)
                                : [...completedAcademyLessons, lesson.id];
                              persistAcademyLessons(updated);
                            }}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              isCompleted
                                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                : "bg-slate-950 hover:bg-slate-900 text-slate-400"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isCompleted ? "Completed Lesson" : "Mark Complete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: SCHOLARS OPPORTUNITY PLANNER WORKBOARD */}
          {activeTab === "planner" && (
            <motion.div
              key="tab-planner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* SAVED OPPORTUNITIES GRID (Col span 2) */}
              <div className="lg:col-span-2 space-y-4">
                
                <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-5 shadow-xl">
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/5 mb-4">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">My Target Listings & Deadlines</span>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your local planner?")) {
                          persistSavedOpportunities([]);
                        }
                      }}
                      className="px-2 py-1 bg-rose-950/40 text-rose-300 text-[10px] hover:bg-rose-900/60 transition-colors rounded border border-rose-500/20 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                    {savedOpportunities.map((opp) => (
                      <div key={opp.id} className="p-4 bg-[#111721] rounded-2xl border border-white/5 space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="px-2 py-0.2 bg-slate-950 text-amber-500 text-[9px] font-mono rounded border border-white/5 select-none uppercase">
                              {opp.sourceType}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-2">Logged {opp.savedAt}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = savedOpportunities.filter(o => o.id !== opp.id);
                              persistSavedOpportunities(updated);
                            }}
                            className="p-1 text-slate-600 hover:text-rose-400 cursor-pointer rounded bg-slate-950 border border-white/5 hover:border-rose-500/20 transition-all"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h3 className="text-xs font-bold text-slate-100">{opp.title}</h3>
                        {opp.notes && <p className="text-[11.5px] text-slate-400 leading-relaxed bg-slate-950/40 p-2 rounded-lg">{opp.notes}</p>}

                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5 border-t border-white/5">
                          <span>Sector: <b>{opp.category}</b></span>
                          <span className="px-2 py-0.5 bg-slate-950 rounded border border-white/10 text-[9.5px]">
                            Deadline Target: <b className="text-amber-400">{opp.deadline}</b>
                          </span>
                        </div>
                      </div>
                    ))}

                    {savedOpportunities.length === 0 && (
                      <div className="text-center py-16 text-slate-500 space-y-2">
                        <Bookmark className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="text-xs">No targets logged currently.</p>
                        <p className="text-[10.5px] text-slate-600">Click &ldquo;Bookmark Channel&rdquo;, compute parameters on our interactive calculators, or log individual deals on the sidebar form!</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* LOG TASK FORM PANEL (Col span 1) */}
              <div className="lg:col-span-1">
                
                <div className="bg-[#0c121a] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4 sticky top-20">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block pb-2 border-b border-white/5">
                    Log Individual Target
                  </span>

                  <form onSubmit={handleAddNewOpportunity} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Listing Title / Name</label>
                      <input
                        type="text"
                        className="w-full bg-[#101620] border border-white/10 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="e.g. MasterCard Tech Fellowship..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Listing Classification</label>
                      <select
                        className="w-full bg-[#101620] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                      >
                        <option value="Scholarship Program">Scholarship Program</option>
                        <option value="NGO Volunteer Option">NGO Volunteer Option</option>
                        <option value="Side Hustle Target">Side Hustle Target</option>
                        <option value="Remote Job Listing">Remote Job Listing</option>
                        <option value="Agriculture Development">Agriculture Development</option>
                        <option value="Import-Export Sourcing">Import-Export Sourcing</option>
                        <option value="Housing Real-Estate">Housing Real-Estate</option>
                        <option value="Transit Log">Transit Log</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Priority Notes / Action plan</label>
                      <textarea
                        className="w-full bg-[#101620] border border-white/10 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        rows={3}
                        placeholder="e.g. Sourcing initial essay drafts. Reach out to my professor referrees before this Friday."
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1.5 font-semibold">Target Deadline Date</label>
                      <input
                        type="text"
                        className="w-full bg-[#101620] border border-white/10 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none"
                        placeholder="e.g. Sept 15, 2026..."
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider text-[10px]"
                    >
                      Save to Scholar Planner
                    </button>
                  </form>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* CREATOR CONTACT & SOCIAL HUB */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12 font-sans" id="creator-contact-hub">
        <div className="bg-gradient-to-br from-[#0c121a]/90 via-[#0d1622]/85 to-[#080d14] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            
            {/* Creator Description & Address */}
            <div className="space-y-4 max-w-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Platform Creator Desk</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Ibrahim Umar <span className="text-xs font-normal text-slate-500">| Gistcord Curator</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Connect with the curator behind Gistcord’s vocational growth frameworks. Pitch collaborations, submit resource queries, or establish contact on the social wire.
                </p>
              </div>

              {/* Address Widget */}
              <div className="bg-[#10151e]/60 border border-white/5 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Contact Address</span>
                  </div>
                  {!isEditingAddress ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAddressInput(contactAddress);
                        setIsEditingAddress(true);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <span>Edit Address</span>
                    </button>
                  ) : null}
                </div>

                {!isEditingAddress ? (
                  <div className="space-y-3" id="full-contact-address-display">
                    {/* Unbroken fully copyable address string */}
                    <p className="text-xs text-white leading-relaxed font-sans font-bold select-all bg-slate-950/45 px-3 py-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                      <span className="text-rose-400 font-mono select-none mt-0.5">•</span>
                      <span>{contactAddress}</span>
                    </p>
                    
                    {/* Highly descriptive structured metadata layout */}
                    <div className="pt-2.5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[11px]" id="structured-address-matrix">
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">Suite / Floor:</span>
                        <span className="text-slate-300 font-semibold truncate">House No: 8</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">Building:</span>
                        <span className="text-slate-300 font-semibold truncate">Amusco plaza</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">Street/Plot:</span>
                        <span className="text-slate-300 font-semibold truncate">River Niger</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">District:</span>
                        <span className="text-slate-300 font-semibold truncate">Galadimawa Area</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">City & FCT:</span>
                        <span className="text-slate-300 font-semibold truncate">Abuja, Federal Capital Territory</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] px-2 py-1 rounded-lg border border-white/[0.02]">
                        <span className="text-slate-500 font-extrabold uppercase tracking-widest font-mono text-[8.5px] w-20 shrink-0">Postal Code:</span>
                        <span className="text-slate-300 font-mono font-bold">900211</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveContactAddress();
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="text"
                      className="flex-1 bg-[#0a0f18] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="Enter new contact address..."
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#4f46e5] hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 py-1.5 bg-[#10151e] hover:bg-slate-800 text-slate-400 text-[11px] rounded-xl border border-white/5 cursor-pointer whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Social Grid Connectors */}
            <div className="w-full lg:w-auto space-y-3 shrink-0">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1 lg:text-right">
                Connect on the Wire
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                
                {/* LinkedIn Badge */}
                <a
                  href="https://www.linkedin.com/in/ibrahim-umar-73377315b"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 hover:border-[#0077b5]/40 text-[#59b8ff] font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded bg-[#0077b5]/20 border border-[#0077b5]/30">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8.5px] text-slate-400 font-medium leading-none uppercase tracking-wider mb-0.5">LinkedIn</div>
                    <div className="truncate text-[10.5px] font-mono font-bold leading-none">Ibrahim Umar</div>
                  </div>
                </a>

                {/* Facebook Badge */}
                <a
                  href="https://facebook.com/Theibraheem"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/20 hover:border-[#1877f2]/40 text-[#4c97ff] font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded bg-[#1877f2]/20 border border-[#1877f2]/30">
                    <Facebook className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8.5px] text-slate-400 font-medium leading-none uppercase tracking-wider mb-0.5">Facebook</div>
                    <div className="truncate text-[10.5px] font-mono font-bold leading-none">Theibraheem</div>
                  </div>
                </a>

                {/* WhatsApp Badge */}
                <a
                  href="https://wa.me/2347067555486"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 hover:border-[#25d366]/40 text-[#4ade80] font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded bg-[#25d366]/20 border border-[#25d366]/30">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8.5px] text-slate-400 font-medium leading-none uppercase tracking-wider mb-0.5">WhatsApp</div>
                    <div className="truncate text-[10.5px] font-mono font-bold leading-none">07067555486</div>
                  </div>
                </a>

                {/* YouTube Badge */}
                <a
                  href="https://youtube.com/@Theibraheeem"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#ff0000]/10 hover:bg-[#ff0000]/20 border border-[#ff0000]/20 hover:border-[#ff0000]/40 text-[#ff4c4c] font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded bg-[#ff0000]/20 border border-[#ff0000]/30">
                    <Youtube className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8.5px] text-slate-400 font-medium leading-none uppercase tracking-wider mb-0.5">YouTube</div>
                    <div className="truncate text-[10.5px] font-mono font-bold leading-none">@Theibraheeem</div>
                  </div>
                </a>

                {/* TikTok Badge */}
                <a
                  href="https://www.tiktok.com/@Theibraheeem"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/10 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="p-1 rounded bg-slate-800 border border-white/5">
                    <Share2 className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8.5px] text-slate-400 font-medium leading-none uppercase tracking-wider mb-0.5">TikTok</div>
                    <div className="truncate text-[10.5px] font-mono font-bold leading-none">@Theibraheeem</div>
                  </div>
                </a>

                {/* Email Badge (Highlighted with custom amber accents & full row span) */}
                <a
                  href="mailto:theibraheem7@gmail.com"
                  className="col-span-2 sm:col-span-3 lg:col-span-2 px-5 py-4 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 hover:border-amber-400 text-amber-300 font-bold text-xs rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer shadow-xl shadow-amber-500/5 mt-2"
                  id="footer-email-highlighted-btn"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30">
                      <Mail className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] uppercase font-mono bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl shrink-0 group-hover:scale-105 transition-all flex items-center gap-1">
                      Compose Mail ✉
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-[9px] text-amber-400/80 font-extrabold leading-none uppercase tracking-widest mb-1.5">Primary Email Desk</div>
                    <div className="text-xs md:text-sm font-mono leading-none tracking-wider text-white font-extrabold italic select-all whitespace-nowrap">
                      theibraheem7@gmail.com
                    </div>
                  </div>
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HUB FOOTER BACKGROUND */}
      <footer className="border-t border-white/5 bg-[#070a0e] mt-16 py-10 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px]">
          <span>GISTCORD PORTAL &copy; {new Date().getFullYear()} &middot; SECURED HUB INTEGRATION</span>
          <div className="flex gap-4">
            <span className="cursor-default select-none">&#8226; SITE HUSTLE</span>
            <span className="cursor-default select-none">&#8226; SMART AGRIC</span>
            <span className="cursor-default select-none">&#8226; MENTORSHIP SCHEMES</span>
            <span className="cursor-default select-none">&#8226; GLOBAL DIGITAL IMPACTS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
