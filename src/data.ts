import { GistTopic, CuratedGuide } from "./types";

export const GIST_TOPICS: GistTopic[] = [
  {
    id: "side-hustle",
    title: "Side Hustle Engine",
    shortTitle: "Side Hustles",
    description: "Launch simple micro-ventures, online services, and digital products on a student schedule with low investment.",
    iconName: "Briefcase",
    badge: "Earning",
    colorTheme: "from-teal-950/40 to-[#0e1716] border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60",
    accentColor: "emerald",
  },
  {
    id: "agriculture",
    title: "Smart Agriculture",
    shortTitle: "Agriculture",
    description: "Learn high-density urban microgreens, vertical organic soils, mini-poultry, and agribusiness youth grants.",
    iconName: "Sprout",
    badge: "Agri-Tech",
    colorTheme: "from-green-950/40 to-[#111611] border-green-500/30 text-green-300 hover:border-green-400/60",
    accentColor: "green",
  },
  {
    id: "youth-empowerment",
    title: "Youth Empowerment Hub",
    shortTitle: "Empowerment",
    description: "Empowerment workshops, vocational skill schemes, startup accelerator portals, and leadership programs.",
    iconName: "Award",
    badge: "Youth",
    colorTheme: "from-indigo-950/40 to-[#121118] border-indigo-500/30 text-indigo-300 hover:border-indigo-400/60",
    accentColor: "indigo",
  },
  {
    id: "ai-updates",
    title: "AI & Smart Teaching Updates",
    shortTitle: "AI & Teaching",
    description: "Stay ahead with custom educational prompt engineering, lesson-planning tools, and custom smart agents.",
    iconName: "Cpu",
    badge: "EdTech",
    colorTheme: "from-cyan-950/40 to-[#101618] border-cyan-500/30 text-cyan-300 hover:border-cyan-400/60",
    accentColor: "cyan",
  },
  {
    id: "remote-work",
    title: "Remote Student Gigs",
    shortTitle: "Remote Jobs",
    description: "Flexible virtual assistant jobs, remote tutoring, tech assistance, and freelance writing proposals.",
    iconName: "Laptop",
    badge: "Remote Work",
    colorTheme: "from-blue-950/40 to-[#0d1316] border-blue-500/30 text-blue-300 hover:border-blue-400/60",
    accentColor: "blue",
  },
  {
    id: "football",
    title: "Football Tactical Arena",
    shortTitle: "Football Corner",
    description: "Global league tables, soccer tactical breakdowns, UCL updates, and transfer window analysis.",
    iconName: "Trophy",
    badge: "Sports News",
    colorTheme: "from-amber-950/40 to-[#17140e] border-amber-500/30 text-amber-300 hover:border-amber-400/60",
    accentColor: "amber",
  },
  {
    id: "health",
    title: "Health & Wellbeing Sectors",
    shortTitle: "Health",
    description: "Study-life calorie tracking, desk ergonomics, sleep patterns, and mental clarity tactics.",
    iconName: "Activity",
    badge: "Wellness",
    colorTheme: "from-rose-950/40 to-[#181113] border-rose-500/30 text-rose-300 hover:border-rose-400/60",
    accentColor: "rose",
  },
  {
    id: "ngos",
    title: "Humanity INGOs Opportunities",
    shortTitle: "Humanity & INGOs",
    description: "Global community volunteer networks, leadership forums, calls for grants, and humanitarian feeds.",
    iconName: "HeartHandshake",
    badge: "INGOs Feed",
    colorTheme: "from-purple-950/40 to-[#161118] border-purple-500/30 text-purple-300 hover:border-purple-400/60",
    accentColor: "purple",
  },
  {
    id: "news",
    title: "Global, National & Political News",
    shortTitle: "Global News",
    description: "National, international, and political news summaries, diplomatic actions, and general public gists.",
    iconName: "Globe",
    badge: "Grounded Live",
    colorTheme: "from-slate-950/40 to-[#121212] border-slate-500/30 text-slate-300 hover:border-slate-400/60",
    accentColor: "slate",
  },
  {
    id: "scholarships",
    title: "Scholarships & Mentor Programs",
    shortTitle: "Scholarships",
    description: "Application tracking for MasterCard, Commonwealth, Chevening, and advice for high-achieving scholars.",
    iconName: "GraduationCap",
    badge: "High-Scholars",
    colorTheme: "from-yellow-950/40 to-[#16140e] border-yellow-500/30 text-yellow-300 hover:border-yellow-400/60",
    accentColor: "yellow",
  },
  {
    id: "digital-literacy",
    title: "Digital Services & Entrepreneurship",
    shortTitle: "Digital Training",
    description: "SEO marketing, digital identity setup, social media growth hacks for global business impact.",
    iconName: "TrendingUp",
    badge: "Global Impact",
    colorTheme: "from-sky-950/40 to-[#111518] border-sky-500/30 text-sky-300 hover:border-sky-400/60",
    accentColor: "sky",
  },
  {
    id: "trade",
    title: "Export & Import Dynamics",
    shortTitle: "Export & Import",
    description: "Learn custom clearances, international container shipping rules, trade documentation, and arbitrage.",
    iconName: "Calendar",
    badge: "Global Trade",
    colorTheme: "from-[#111e1c]/40 to-[#101212] border-teal-500/30 text-teal-300 hover:border-teal-400/60",
    accentColor: "teal",
  },
  {
    id: "real-estate",
    title: "Housing & Real Estate Finder",
    shortTitle: "Housing",
    description: "Find affordable student housing, co-living setups, tenant agreement checks, and mortgage estimations.",
    iconName: "Bookmark",
    badge: "Real Estate",
    colorTheme: "from-orange-950/40 to-[#181211] border-orange-500/30 text-orange-300 hover:border-orange-400/60",
    accentColor: "orange",
  },
  {
    id: "transport",
    title: "Transportation & Urban Transit",
    shortTitle: "Transportation",
    description: "Local route mapping, cost calculators, carbon emissions logs, and logistics systems optimizations.",
    iconName: "ChevronRight",
    badge: "Mobility",
    colorTheme: "from-violet-950/40 to-[#121115] border-violet-500/30 text-violet-300 hover:border-violet-400/60",
    accentColor: "violet",
  },
  {
    id: "lifestyle",
    title: "General Aspects of Life",
    shortTitle: "Aspects of Life",
    description: "Financial budgeting, social-life planning, cooking on a tight budget, and physical activities logs.",
    iconName: "Info",
    badge: "Lifestyle",
    colorTheme: "from-pink-950/40 to-[#161113] border-pink-500/30 text-pink-300 hover:border-pink-400/60",
    accentColor: "pink",
  },
];

export const CURATED_GUIDES: CuratedGuide[] = [
  // 1. SIDE HUSTLE
  {
    id: "sh-01",
    category: "side-hustle",
    title: "The Digital Template Factory",
    teaser: "A beginner-friendly guide to designing digital resources in Canva and retailing globally with zero physical overhead.",
    readTime: "4 min read",
    difficulty: "Beginner",
    content: [
      "Select a strong niche: Student lesson calendars, meal logs, or local business checklist books.",
      "Design minimal, high-contrast layouts in Canva with elegant typography.",
      "Set up listings on free platforms like Gumroad or Etsy.",
      "Leverage TikTok, reels, or status updates to demonstrate the resource in action.",
      "Increase value by making PDF fields dynamically interactive (using free web PDF editors)."
    ],
    hotTip: "Price initial products at $1.99 to build quick reviews before scaling to $4.99 and up.",
    calculatorType: "side-hustle",
  },

  // 2. AGRICULTURE
  {
    id: "ag-01",
    category: "agriculture",
    title: "Urban Microgreens Business Concept",
    teaser: "Grow dynamic organic broccoli & radish microgreens in small flats in your home for local restaurants.",
    readTime: "5 min read",
    difficulty: "Beginner",
    content: [
      "Gather flat plastic nursery boxes and organic coco-coir/potting soil mix.",
      "Distribute broccoli, mustard, or wheatgrass seeds evenly and mist heavily.",
      "Keep in blackout under gentle weight for 3 days to force strong root growth.",
      "Position in clean indirect sunlight; water daily strictly from the bottom of the tray to prevent root dampening.",
      "Harvest at day 10 when the first set of cotyledon leaves emerge."
    ],
    hotTip: "Local fine dining bistros, health-shoppers, and juice bars purchase fresh flats at up to $35/lb!",
    calculatorType: "side-hustle",
  },

  // 3. YOUTH EMPOWERMENT
  {
    id: "ye-01",
    category: "youth-empowerment",
    title: "Building Vocational Startups",
    teaser: "How to use localized technical skills to access international entrepreneurship development grants.",
    readTime: "6 min read",
    difficulty: "Intermediate",
    content: [
      "Formulate a 1-page business brief highlighting your local community value-add (e.g. eco-packaging, tailoring, solar repairs).",
      "List local or national development programs offering micro-match grants or technical tools.",
      "Design a small practical pilot to prove actual market interest before requesting large program capital.",
      "Keep records of customer transactions to demonstrate reliable progress to youth boards."
    ],
    hotTip: "Focus intensely on detailing how your startup empowers local team members—this unlocks premium INGO cash!"
  },

  // 4. AI UPDATES
  {
    id: "ai-01",
    category: "ai-updates",
    title: "Smart AI Prompt Engineering for Student Tutors",
    teaser: "Using target-driven instructional system prompts to build virtual master tutor classrooms.",
    readTime: "3 min read",
    difficulty: "Beginner",
    content: [
      "Formulate strict role guidance: 'Act as an encouraging, expert economics professor. Interrogate me on GDP concepts.'",
      "Feed in answers and request a conceptual accuracy grade with 2 targeted improvement bullet points.",
      "Generate customizable diagnostic quizzes by prompting models to formulate complex problems without immediate solutions.",
      "Always manually verify mathematical results against reference textbooks."
    ],
    hotTip: "End teaching prompts with: 'Do not supply answers initially. Coax my step-by-step reasoning.'",
    calculatorType: "prompt-eval"
  },

  // 5. REMOTE WORK
  {
    id: "rw-01",
    category: "remote-work",
    title: "Student Freelance Proposal Framework",
    teaser: "How to stand out in the crowded freelance job board ecosystem and win remote assistant positions.",
    readTime: "5 min read",
    difficulty: "Intermediate",
    content: [
      "Format freelance profiles targeting one explicit service (e.g., 'Aesthetic Notion Developer' or 'LinkedIn Content Writer').",
      "Build a simple 30-second introductory video showing your setup and commitment to strict deadlines.",
      "Submit custom, concise proposals (under 120 words) detailing exactly how you will execute the posted project.",
      "Deliver initial projects quickly to secure 5-star reviews to elevate overall placement rankings."
    ],
    hotTip: "Maintain high service consistency by scheduling 2 early morning hours specifically for remote worker clients."
  },

  // 6. FOOTBALL
  {
    id: "fb-01",
    category: "football",
    title: "Tactical Deep-Dive: Possession Overloads",
    teaser: "How elite modern football systems invert player roles to establish midfield superiorities.",
    readTime: "4 min read",
    difficulty: "Advanced",
    content: [
      "Study how fullbacks tuck into mid-lines during possession, structuring a dynamic 3-2-4-1 build-up pattern.",
      "Identify the defensive central coverages that prevent rapid transitions on the break.",
      "Understand the pivot roles that coordinate team tempo and vertical ball progressions.",
      "Formulate comparative data models of top football league shapes to draft viral analysis posts."
    ],
    hotTip: "Create tactical videos focusing purely on patterns of play rather than player rumors to build real authority content."
  },

  // 7. HEALTH
  {
    id: "he-01",
    category: "health",
    title: "Desk Ergonomics & Vitality Guide",
    teaser: "Stay mentally alert and preserve body posture during long screen hours of work and research.",
    readTime: "3 min read",
    difficulty: "Beginner",
    content: [
      "Incorporate the 20-20-20 rule: Every 20 minutes, focus eye muscles on something 20 feet away for at least 20 seconds.",
      "Align the top of your computer monitor with your line of sight using books or stands.",
      "Support lower posture by maintaining flat foot contact with the floor and a 90-degree arm alignment.",
      "Take small, dynamic 3-minute stretches between 50-minute blocks of continuous code."
    ],
    hotTip: "Sip water continuously. Dehydration drops focus levels before you even feel thirsty.",
    calculatorType: "bmi"
  },

  // 8. NGOS
  {
    id: "ng-01",
    category: "ngos",
    title: "Applying for International Youth Fellowships",
    teaser: "A strategic game-plan for high-impact young leaders seeking global INGO backing and support.",
    readTime: "6 min read",
    difficulty: "Advanced",
    content: [
      "Synthesize your community work into clear metrics: 'Secured 30 books for primary library' beats 'Loved literacy'.",
      "Map your project explicitly to the UN Sustainable Development Goals (SDGs) to attract foreign evaluators.",
      "Draft customized referral letters showing active mentorship and endorsement from regional leaders.",
      "Clearly detail how the fellowship funds will be mapped to localized, self-sustaining actions."
    ],
    hotTip: "INGOs strongly prefer to sponsor youth programs that have already launched and need speed, rather than raw ideas."
  },

  // 9. NEWS (Global & Political)
  {
    id: "ne-01",
    category: "news",
    title: "Analyzing Global Trade & Political Policy Impacts",
    teaser: "A framework to understanding how national policies, tax code modifications, and state actions reshape student opportunities.",
    readTime: "5 min read",
    difficulty: "Intermediate",
    content: [
      "Review regional press statements and legislation regarding youth developmental programs.",
      "Assess currency shifts and global interest rates affecting local freelance arbitrage operations.",
      "Compare local policy initiatives to find tax-exempt opportunities for youth-led micro-enterprises.",
      "Aggregate non-partisan daily updates to keep your local student community highly informed."
    ],
    hotTip: "Ensure all policy and political assessments stay thoroughly objective and fact-checked to retain maximum audience trust."
  },

  // 10. SCHOLARSHIPS
  {
    id: "sc-01",
    category: "scholarships",
    title: "MasterCard & Chevening Application Blueprints",
    teaser: "Structural narrative blueprints designed for high-achieving scholars targeting elite global masters sponsorships.",
    readTime: "6 min read",
    difficulty: "Advanced",
    content: [
      "Anchor Paragraph (15%): Establish a vivid local challenge you personally witnessed and intend to tackle.",
      "Academic Bridge (25%): Clearly connect your top grades to the specialized modules of your chosen university course.",
      "Leadership Action (35%): Give strict data-backed examples of your grassroot organization and peer-guidance history.",
      "Strategic Goal (25%): Map out your precise 5-year post-graduation action plan to scale local communities.",
    ],
    hotTip: "Never frame an essay as 'Requesting financial rescue'. Frame it as 'Sourcing strategic capital to scale high-impact leadership'."
  },

  // 11. DIGITAL LITERACY & SOCIAL MEDIA
  {
    id: "dl-01",
    category: "digital-literacy",
    title: "Global Social Brand Building",
    teaser: "Leverage automated content grids and SEO architectures to grow your digital services footprint globally.",
    readTime: "4 min read",
    difficulty: "Intermediate",
    content: [
      "Target high-intent search terms: e.g. 'Canva pitch template for tech consultants'.",
      "Build a clear Substack newsletter or LinkedIn article sequence highlighting local solutions.",
      "Schedule small 45-second educational video walkthroughs demonstrating software workflows on digital setups.",
      "Design standard visual templates to create cohesive professional layouts on all channels."
    ],
    hotTip: "Consistency always beats individual genius in digital algorithms. Post twice a week, every single week without exception."
  },

  // 12. TRADE (Export & Import)
  {
    id: "tr-01",
    category: "trade",
    title: "Micro Export-Import for Entrepreneurs",
    teaser: "Step-by-step method to sourcing and shipping high-value items via micro air-cargo pathways.",
    readTime: "5 min read",
    difficulty: "Intermediate",
    content: [
      "Identify high-demand, low-weight products (e.g. niche beauty elements, local organic spices, craft carvings).",
      "Understand customs tariffs, HS-codes, and import declarations for both source and destination jurisdictions.",
      "Partner with reliable small-cargo logistics companies who handle comprehensive clearing and delivery packages.",
      "Determine your exact cost structure incorporating shipping, duties, clearance agency fees, and packaging costs."
    ],
    hotTip: "Calculate absolute land cost first! If shipping costs more than 40% of the item's purchase value, focus on lighter products.",
    calculatorType: "trade-calc"
  },

  // 13. REAL ESTATE (Housing)
  {
    id: "re-01",
    category: "real-estate",
    title: "Smart Student Housing Search Playbook",
    teaser: "How to safely audit tenement leases, locate affordable co-living options, and budget housing.",
    readTime: "4 min read",
    difficulty: "Beginner",
    content: [
      "Establish a firm maximum index: Housing cost should never surpass 35% of overall monthly cash flows.",
      "Inspect potential spaces thoroughly: Confirm plumbing pressure, security gates, electricity meters, and dampness levels.",
      "Ensure all maintenance agreements are documented in written leases rather than oral agreements.",
      "Factor in proximity to work hubs, local public transit lines, and daily food markets."
    ],
    hotTip: "Always negotiate utilities and wifi fees into the primary base rent where possible to prevent unexpected monthly spikes.",
    calculatorType: "mortgage"
  },

  // 14. TRANSPORT
  {
    id: "tp-01",
    category: "transport",
    title: "Urban Mobility & Shipping Route Cost Optimization",
    teaser: "Determine the fastest, most cost-effective and greenest pathways to commute or dispatch items.",
    readTime: "3 min read",
    difficulty: "Beginner",
    content: [
      "Map out daily routes comparing rideshare structures, train services, or cycling options.",
      "Analyze fuel-to-mileage ratios if operating light delivery cycles for micro-commerce side hustles.",
      "Integrate delivery times to run high-density drops along adjacent neighborhood blocks to save on costs."
    ],
    hotTip: "For e-commerce side-hustles, batch delivery dispatches on specific days (e.g., Tuesdays and Fridays) to save substantial logistics fees."
  },

  // 15. LIFESTYLE
  {
    id: "li-01",
    category: "lifestyle",
    title: "The Zero-Debt Student Budget Plan",
    teaser: "How to budget funds, construct affordable high-protein meal plans, and build robust social lives.",
    readTime: "3 min read",
    difficulty: "Beginner",
    content: [
      "Build a basic 50/30/20 budget framework: 50% for Needs, 30% for Lifestyle, 20% for Earning development.",
      "Batch-prepare nutritious ingredients: Focus on bulk oatmeal, eggs, legumes, and homegrown salad herbs.",
      "Create high-value local student groups to split wholesale grocery shopping directly.",
      "Audit unnecessary streaming or platform commitments regularly to keep recurring fees near zero."
    ],
    hotTip: "Create a single 'Incidental Emergency Fund' of just $150 to buffer against unexpected expenses."
  }
];

export const SUGGESTED_PROMPTS: Record<string, string[]> = {
  "side-hustle": [
    "What are some low-risk digital service side hustles for college students?",
    "Review my strategy to sell organic layout templates to virtual assistants.",
    "Draft a quick, respectful cold email template targeting local social managers."
  ],
  "agriculture": [
    "Outline a small urban agribusiness startup raising poultry on low costs.",
    "Where should youth search for agricultural empowerment grants this cycle?",
    "Explain how to manage water retention in dry high-density container farming."
  ],
  "youth-empowerment": [
    "What key skills should modern digital entrepreneurs acquire to make an impact?",
    "Explain how to design an effective volunteer team structure for community projects.",
    "Suggest leadership accelerator fellowships open to young founders."
  ],
  "ai-updates": [
    "What are the best classroom AI assistant techniques for peer tutoring?",
    "Write a prompt sequence to break down complex organic chemistry structures.",
    "Explain standard non-hallucination guard rails for educational agents."
  ],
  "remote-work": [
    "Draft a short, bulletproof proposal letter for a flexible remote assistant position.",
    "What are current trusted websites hosting high-paying remote research work?",
    "How can I smoothly negotiate flexible hours around midterm exams?"
  ],
  "football": [
    "Explain the tactical setup of inverted wingers attacking central channels.",
    "Analyze recent trends in international cup squad build-up systems.",
    "Outline an engaging script for a sports journalism soccer preview."
  ],
  "health": [
    "Suggest a simple, energy-maximizing meal prep guide on a strict student budget.",
    "What are effective exercises to preserve cervical posture during screen-time?",
    "Explain the science behind using 20-minute visual cooldown sessions."
  ],
  "ngos": [
    "List 5 reputable INGOs providing youth leadership support programs.",
    "How do I draft a professional grant proposal letter asking for book donations?",
    "What is the best way to calculate social impact metrics for neighborhood work?"
  ],
  "news": [
    "Give me an objective rundown of current international policy trends in trade.",
    "Summarize how current global economic signals affect student loan structures.",
    "Explain the role of regional diplomatic coalitions in global security developments."
  ],
  "scholarships": [
    "Draft a strategic letter layout for Rhodes or MasterCard scholars essay.",
    "How should I address academic gaps safely in scholarship personal statements?",
    "Give me standard mock interview questions representing leadership schemas."
  ],
  "digital-literacy": [
    "What is the absolute basic framework to launch a local SEO content campaign?",
    "Suggest automated tools for content scheduling that are free and elegant.",
    "Explain the process of setting up a strong, professional LinkedIn footprint."
  ],
  "trade": [
    "What are the typical documents required for micro-export of handcrafted products?",
    "Explain custom clearance regulations regarding international air parcel deliveries.",
    "Suggest an arbitrage formula to identify profitable international resale items."
  ],
  "real-estate": [
    "What absolute warning items should I watch for in written housing leases?",
    "Suggest a monthly budget tracker formula dividing base rent from utility bills.",
    "Explain co-living roommate rules to maintain high productivity and zero stress."
  ],
  "transport": [
    "Suggest optimized logistics methods for a micro delivery enterprise.",
    "What are green, carbon-neutral options for daily campus transportation?",
    "How should a student courier calculate cost-per-delivery for small parcels?"
  ],
  "lifestyle": [
    "Suggest a monthly 50/30/20 budget framework for student money management.",
    "What are quick, healthy, 15-minute budget recipes that aid cognitive stamina?",
    "Explain methods to sustain a strong social life without accumulating card debt."
  ]
};
