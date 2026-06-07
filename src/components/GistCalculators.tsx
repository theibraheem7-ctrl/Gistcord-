import React, { useState } from "react";
import { DollarSign, Cpu, Play, Scale, Apple, Building, ChevronRight, HelpCircle } from "lucide-react";

interface GistCalculatorsProps {
  type: "side-hustle" | "bmi" | "prompt-eval" | "mortgage" | "trade-calc" | string;
  onSaveResult?: (opportunity: { title: string; notes: string }) => void;
}

export default function GistCalculators({ type, onSaveResult }: GistCalculatorsProps) {
  // Side Hustle State
  const [weeklyHours, setWeeklyHours] = useState<number>(12);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [platformFee, setPlatformFee] = useState<number>(10);

  // Prompt State
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [promptResult, setPromptResult] = useState<{
    score: number;
    grade: string;
    advice: string;
    improved: string;
  } | null>(null);

  // BMI State
  const [weight, setWeight] = useState<string>("68");
  const [height, setHeight] = useState<string>("172");
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    status: string;
    diet: string;
    tips: string[];
  } | null>(null);

  // Trade State (Export-Import)
  const [itemCost, setItemCost] = useState<number>(15);
  const [shippingCost, setShippingCost] = useState<number>(8);
  const [customsPercent, setCustomsPercent] = useState<number>(15);
  const [retailPrice, setRetailPrice] = useState<number>(45);

  // Mortgage/Rental budget State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(1600);
  const [suggestedRentRange, setSuggestedRentRange] = useState<{
    maxRent: number;
    utilities: number;
    emergencyBuffer: number;
    statusText: string;
  } | null>(null);

  // Handlers
  const calculateHustle = () => {
    const weeklyGross = weeklyHours * hourlyRate;
    const monthlyGross = weeklyGross * 4.3;
    const feeAmount = (monthlyGross * platformFee) / 100;
    const monthlyNet = monthlyGross - feeAmount;

    return {
      weeklyGross: weeklyGross.toFixed(2),
      monthlyGross: monthlyGross.toFixed(2),
      monthlyNet: monthlyNet.toFixed(2),
    };
  };

  const evaluatePrompt = () => {
    if (!userPrompt.trim()) return;
    const length = userPrompt.length;
    let score = 40;

    if (userPrompt.toLowerCase().includes("act as") || userPrompt.toLowerCase().includes("persona")) score += 15;
    if (userPrompt.toLowerCase().includes("step-by-step") || userPrompt.toLowerCase().includes("explain")) score += 15;
    if (userPrompt.toLowerCase().includes("format") || userPrompt.toLowerCase().includes("table") || userPrompt.toLowerCase().includes("bullet")) score += 15;
    if (length > 80) score += 15;
    score = Math.min(score, 100);

    let grade = "C (Generic Prompt)";
    let advice = "Your prompt can be upgraded by attaching precise personas, targeted roles, and specific format goals.";
    let improved = `Act as an expert tutor. Please explain [Topic] using simple step-by-step points. Avoid jargon, and ask me two challenging multi-choice questions at the end.`;

    if (score > 85) {
      grade = "A+ (Elite Masterclass)";
      advice = "Brilliant prompt! You've explicitly parameterized constraints, set formatting bounds, and triggered high-quality analytical trees.";
      improved = `${userPrompt}\n\n[Deliver response structured with markdown bullet listings and a key recap summary]`;
    } else if (score > 65) {
      grade = "B (Good Baseline)";
      advice = "Decent structure. Try to explicitly command: 'Let's reason step-by-step before producing final conclusions.'";
      improved = `Act as an industry peer mentor. ${userPrompt}. Format instructions with clear numbers and provide a concrete example.`;
    }

    setPromptResult({ score, grade, advice, improved });
  };

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (isNaN(w) || isNaN(h) || h <= 0) return;

    const bmi = w / (h * h);
    let status = "Healthy Weight";
    let diet = "High focus, protein-rich balanced nutrition";
    let tips = [
      "Incorporate foods rich in Omega-3 like walnuts and flaxseeds for brain focus.",
      "Hydrate well: Aim for 2.5 Litres of pure water daily to boost cognitive speed.",
      "Take small ergonomic posture resets during long study or coding blocks."
    ];

    if (bmi < 18.5) {
      status = "Underweight";
      diet = "Calorie-dense, nutrient-rich student balanced meal-planner";
      tips = [
        "Include avocados, organic nuts, oats, and eggs as convenient desk snacks.",
        "Ensure consistent meals; avoid skipping breakfast during intense morning revisions.",
        "Add short moderate weight resistance training to protect spine skeletal muscles."
      ];
    } else if (bmi >= 25) {
      status = "Overweight";
      diet = "Low glycemic, high-fiber brain fuels";
      tips = [
        "Incorporate a 5-minute warm-up stretch cycle for every 50 minutes at your laptop desk.",
        "Swap high-sugar processed juices for water, pure green teas, or local infusions.",
        "Increase leafy fresh greens and keep grain carbohydrates strictly whole."
      ];
    }

    setBmiResult({
      bmi: parseFloat(bmi.toFixed(1)),
      status,
      diet,
      tips,
    });
  };

  const calculateTradeArbitrage = () => {
    const customDuty = (itemCost * customsPercent) / 100;
    const totalLandCost = itemCost + shippingCost + customDuty;
    const netProfit = retailPrice - totalLandCost;
    const marginPercent = ((netProfit / retailPrice) * 100);

    return {
      duty: customDuty.toFixed(2),
      landCost: totalLandCost.toFixed(2),
      profit: netProfit.toFixed(2),
      margin: marginPercent.toFixed(1)
    };
  };

  const analyzeRentalBudget = () => {
    const maxRent = monthlyIncome * 0.35; // Standard 35% affordability metric
    const utilities = monthlyIncome * 0.08;
    const emergencyBuffer = monthlyIncome * 0.10;
    let statusText = "Economical, safe, and allows high saving capacity.";

    if (monthlyIncome <= 1000) {
      statusText = "Tight budget. Highly recommend looking at shared co-living flats to split utilities.";
    }

    setSuggestedRentRange({
      maxRent: Math.round(maxRent),
      utilities: Math.round(utilities),
      emergencyBuffer: Math.round(emergencyBuffer),
      statusText
    });
  };

  return (
    <div id={`calc-panel-${type}`} className="bg-slate-900/90 border border-white/5 rounded-2xl p-5 shadow-2xl mb-2">
      
      {/* 1. SIDE HUSTLE ESTIMATOR */}
      {type === "side-hustle" && (
        <div id="hustle-estimator">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Side Venture Estimator</h4>
              <p className="text-[10px] text-slate-400">Model your monthly earnings with zero physical assets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Hours Weekly: {weeklyHours}h</label>
              <input
                type="range"
                min="4"
                max="40"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Hourly Rate: ${hourlyRate}/hr</label>
              <input
                type="range"
                min="8"
                max="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Platform Cut: {platformFee}%</label>
              <input
                type="range"
                min="0"
                max="25"
                value={platformFee}
                onChange={(e) => setPlatformFee(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-white/5 text-center mb-3">
            <div>
              <span className="text-[9px] text-slate-500 block">Weekly Gross</span>
              <strong className="text-sm font-bold font-mono text-emerald-400">${calculateHustle().weeklyGross}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">Monthly Gross</span>
              <strong className="text-sm font-bold font-mono text-emerald-400">${calculateHustle().monthlyGross}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">Monthly Net Profits</span>
              <strong className="text-sm font-bold font-mono text-amber-400">${calculateHustle().monthlyNet}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Keep weekly hours under 15 hours to protect your studies.</span>
            {onSaveResult && (
              <button
                type="button"
                onClick={() =>
                  onSaveResult({
                    title: `Side Hustle Target: $${calculateHustle().monthlyNet}/month`,
                    notes: `Plan: dedicative study of ${weeklyHours} hrs/week at $${hourlyRate}/hr with platform allocations.`,
                  })
                }
                className="px-2.5 py-1 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded transition-colors cursor-pointer"
              >
                Log to Planner
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. PROMPT AUDITOR */}
      {type === "prompt-eval" && (
        <div id="prompt-auditor">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Interactive AI Prompt Auditor</h4>
              <p className="text-[10px] text-slate-400">Score learning prompt syntax for deep thinking</p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              rows={2}
              placeholder="e.g. Write a brief overview of smart contracts for blockchain Class..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={evaluatePrompt}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold max-w-fit rounded text-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                Analyze AI Prompt
              </button>
            </div>

            {promptResult && (
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-1.5 text-[11px]">
                  <span className="text-slate-400">Precision Score: <b>{promptResult.score}/100</b></span>
                  <span className="font-bold text-cyan-400 select-none">{promptResult.grade}</span>
                </div>
                <p className="text-slate-400 italic text-[11px] leading-relaxed">{promptResult.advice}</p>
                <div className="bg-slate-900 p-2 rounded-lg text-[10.5px]">
                  <span className="text-cyan-400 font-bold block mb-1">💡 Super-Charged Ready Prompt Suggestion:</span>
                  <p className="text-slate-300 select-all">&ldquo;{promptResult.improved}&rdquo;</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. BMI & HEALTH PLANNER */}
      {type === "bmi" && (
        <div id="vitality-index">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Scholar Vitality index</h4>
              <p className="text-[10px] text-slate-400">Tune calorie intakes and screen-time fatigue tips</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[9.5px] text-slate-400 mb-1">Body Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[9.5px] text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={calculateBmi}
            className="w-full py-1.5 bg-rose-950 text-rose-300 font-bold rounded hover:bg-rose-900 border border-rose-500/20 text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Apple className="w-3.5 h-3.5" />
            Evaluate Nutrition & Desk Ergonomics
          </button>

          {bmiResult && (
            <div className="mt-3 p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Calculated BMI Index: <b>{bmiResult.bmi}</b></span>
                <span className="font-bold text-rose-400">{bmiResult.status}</span>
              </div>
              <p className="text-slate-300 font-medium text-[11px]">Diet Focus: <span className="text-rose-300">{bmiResult.diet}</span></p>
              <div className="space-y-1 pt-1.5 border-t border-white/5">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Active Study Habits:</span>
                {bmiResult.tips.map((tip, i) => (
                  <p key={i} className="text-slate-400 text-[10.5px] leading-relaxed">&#8226; {tip}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EXPORT-IMPORT TRADE ESTIMATOR */}
      {type === "trade-calc" && (
        <div id="trade-arbitrage">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Trade cost Arbitrage Calculator</h4>
              <p className="text-[10px] text-slate-400">Estimate net margins on small import and export deliveries</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3 text-xs">
            <div>
              <label className="block text-[9px] text-slate-400 mb-1">Item Cost ($)</label>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 mb-1">Shipping ($)</label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 mb-1">Tariff (%)</label>
              <input
                type="number"
                value={customsPercent}
                onChange={(e) => setCustomsPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 mb-1">Retail Price ($)</label>
              <input
                type="number"
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/5 text-center mb-2">
            <div>
              <span className="text-[9px] text-slate-500 block">Clearance Duty</span>
              <strong className="text-xs font-mono text-slate-300">${calculateTradeArbitrage().duty}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">Land Cost</span>
              <strong className="text-xs font-mono text-slate-300">${calculateTradeArbitrage().landCost}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block">Net Profit / Margin</span>
              <strong className="text-xs font-mono text-teal-400 font-bold">
                ${calculateTradeArbitrage().profit} ({calculateTradeArbitrage().margin}%)
              </strong>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
            <span>Ideal margins should exceed 30% to shield from exchange spikes.</span>
            {onSaveResult && (
              <button
                type="button"
                onClick={() =>
                  onSaveResult({
                    title: `Trade Margin: $${calculateTradeArbitrage().profit}/item`,
                    notes: `Export/Import plan. Sourcing item cost: $${itemCost} + Shipping: $${shippingCost} at Retail target: $${retailPrice}.`,
                  })
                }
                className="px-2 py-0.5 bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold rounded cursor-pointer"
              >
                Log margin target
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. HOUSING & REAL ESTATE AFFORDABILITY CALCULATOR */}
      {type === "mortgage" && (
        <div id="housing-affordability">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Housing budget Affordability Analyzer</h4>
              <p className="text-[10px] text-slate-400">Evaluate secure rent metrics based on monthly revenues</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Net Student Monthly Revenue / Income: ${monthlyIncome}</label>
              <input
                type="range"
                min="300"
                max="6000"
                step="50"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={analyzeRentalBudget}
              className="w-full py-1.5 bg-orange-950 text-orange-300 font-bold rounded hover:bg-orange-900 border border-orange-500/20 text-xs cursor-pointer"
            >
              Analyze Secure Rent Bounds
            </button>

            {suggestedRentRange && (
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">Secure Max Rent</span>
                    <strong className="text-orange-400 text-xs font-mono font-bold">${suggestedRentRange.maxRent}</strong>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">Utilities Caps</span>
                    <strong className="text-slate-300 text-xs font-mono font-bold">${suggestedRentRange.utilities}</strong>
                  </div>
                  <div className="bg-[#101918] p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">Emergency Buffer</span>
                    <strong className="text-teal-400 text-xs font-mono font-bold">${suggestedRentRange.emergencyBuffer}</strong>
                  </div>
                </div>
                <p className="text-slate-400 text-[10.5px] leading-relaxed italic pt-1 border-t border-white/5">
                  &#9888; {suggestedRentRange.statusText}
                </p>

                {onSaveResult && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onSaveResult({
                          title: `Rent Target: $${suggestedRentRange.maxRent}/month`,
                          notes: `Affordability analysis for monthly income budget of $${monthlyIncome}. Allocated utilities limits: $${suggestedRentRange.utilities}/month.`,
                        })
                      }
                      className="px-2.5 py-0.5 bg-orange-500 text-slate-950 font-bold rounded hover:bg-orange-400 cursor-pointer text-[10px]"
                    >
                      Save Rent Goal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
