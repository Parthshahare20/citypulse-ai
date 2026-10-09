import React, { useState } from 'react';
import {
  BarChart3,
  Sliders,
  DollarSign,
  Star,
  Accessibility,
  Bus,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { NeighborhoodComparison, CityInfo } from '../types';

interface CompareViewProps {
  city: CityInfo;
  neighborhoods: NeighborhoodComparison[];
}

export const CompareView: React.FC<CompareViewProps> = ({
  city,
  neighborhoods,
}) => {
  // Custom formula weight sliders (0 to 100)
  const [ratingWeight, setRatingWeight] = useState(30);
  const [affordabilityWeight, setAffordabilityWeight] = useState(30);
  const [accessibilityWeight, setAccessibilityWeight] = useState(25);
  const [cleanlinessWeight, setCleanlinessWeight] = useState(15);

  const calculateCustomScore = (n: NeighborhoodComparison) => {
    const totalWeights = ratingWeight + affordabilityWeight + accessibilityWeight + cleanlinessWeight;
    if (totalWeights === 0) return 0;

    const weightedSum =
      n.ratingScore * ratingWeight +
      n.affordabilityScore * affordabilityWeight +
      n.accessibilityScore * accessibilityWeight +
      n.cleanlinessScore * cleanlinessWeight;

    return Math.round(weightedSum / totalWeights);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Multi-Criteria Urban Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Neighborhood Comparison & Affordability Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Transparent scoring with customizable user priorities. Compare cost-of-living, transit access, physical accessibility, and safety without opaque black boxes.
          </p>
        </div>
      </div>

      {/* Interactive Weight Sliders Box */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
            <Sliders className="w-4 h-4" />
            <span>Customize Decision Weights</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Formula: score = Σ(W_i × S_i) / Σ(W_i)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-3.5 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-amber-300">Rating & Quality</span>
              <span className="font-mono text-slate-300">{ratingWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ratingWeight}
              onChange={(e) => setRatingWeight(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-teal-300">Affordability & Budget</span>
              <span className="font-mono text-slate-300">{affordabilityWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={affordabilityWeight}
              onChange={(e) => setAffordabilityWeight(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-cyan-300">Physical Accessibility</span>
              <span className="font-mono text-slate-300">{accessibilityWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={accessibilityWeight}
              onChange={(e) => setAccessibilityWeight(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-indigo-300">Cleanliness & Comfort</span>
              <span className="font-mono text-slate-300">{cleanlinessWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={cleanlinessWeight}
              onChange={(e) => setCleanlinessWeight(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map((n) => {
          const customScore = calculateCustomScore(n);

          return (
            <div
              key={n.id}
              className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {n.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">{city.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black font-display text-cyan-300">
                      {customScore}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Custom Match</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {n.overview}
                </p>

                {/* Score Breakdown Bars */}
                <div className="space-y-2.5 mt-5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Affordability (Meal: {n.averageMealCost})</span>
                      <span className="font-mono text-teal-300">{n.affordabilityScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${n.affordabilityScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Visitor Quality Rating</span>
                      <span className="font-mono text-amber-300">{n.ratingScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${n.ratingScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Accessibility & Step-Free</span>
                      <span className="font-mono text-cyan-300">{n.accessibilityScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${n.accessibilityScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Public Transit Connectivity</span>
                      <span className="font-mono text-indigo-300">{n.transitScore}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${n.transitScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notable Attractions Tags */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Notable Points of Interest
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {n.notableAttractions.map((att, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-lg glass-surface-subtle text-slate-300 border border-white/5"
                    >
                      {att}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
