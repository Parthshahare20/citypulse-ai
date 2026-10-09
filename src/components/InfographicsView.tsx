import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Wind,
  Compass,
  Train,
  Factory,
  GraduationCap,
  Landmark,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Droplets,
  Layers,
} from 'lucide-react';
import { CityInfo, InfographicCategory } from '../types';
import { PUNE_TALEGAON_INFOGRAPHICS } from '../data/seedData';

interface InfographicsViewProps {
  city: CityInfo;
  onOpenCopilot: () => void;
}

export const InfographicsView: React.FC<InfographicsViewProps> = ({
  city,
  onOpenCopilot,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories: InfographicCategory[] = PUNE_TALEGAON_INFOGRAPHICS;

  const filteredCategories = categories.filter((cat) => {
    if (activeCategory === 'all') return true;
    return cat.id === activeCategory;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 sunset-radial relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Regional Urban Intelligence & Telemetry Dashboard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
            Pune & Talegaon Dabhade <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              Infographics & Spatial Analytics
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Comprehensive multidimensional data covering the Talegaon-Pune metropolitan corridor. Analyzes the 670m altitude microclimate, sacred temple networks, mega shopping infrastructure, Old Highway commute dynamics, industrial MIDC output, and 2,000-year Sahyadri heritage.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Infographics'}</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2 rounded-xl glass-surface-subtle hover:bg-white/10 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot About Talegaon & Pune</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 bg-gradient-to-l from-amber-500 via-orange-400 to-transparent pointer-events-none" />
      </div>

      {/* Category Filter Pills */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Infographics Overview
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Elevation & Comparative Radar Key Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Talegaon Box */}
        <div className="glass-card rounded-3xl p-5 border border-cyan-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Maval Plateau Corridor
            </span>
            <span className="font-mono text-xs text-teal-300 font-bold">670m MSL</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">Talegaon Dabhade</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Natural sanatorium microclimate, 3-4°C cooler than Pune, clean mountain air (AQI 28).
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Temp: 24°C</span>
            <span className="text-teal-400">Air: Pure / Good</span>
          </div>
        </div>

        {/* Central Pune Basin Box */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Urban Educational Basin
            </span>
            <span className="font-mono text-xs text-indigo-300 font-bold">560m MSL</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">Pune Core (Deccan/Peths)</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Historic Peshwa capital, premier university clusters, vibrant café avenues (AQI 48).
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Temp: 27°C</span>
            <span className="text-indigo-400">Air: Moderate / Good</span>
          </div>
        </div>

        {/* Coastal Mumbai Comparison */}
        <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Coastal Sea Level Reference
            </span>
            <span className="font-mono text-xs text-amber-300 font-bold">14m MSL</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">Mumbai Coastline</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Connected via Mumbai-Pune Expressway & Old NH 48 (120 km northwest).
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Temp: 31°C</span>
            <span className="text-amber-400">Air: Moderate / 65 AQI</span>
          </div>
        </div>
      </div>

      {/* Infographics Detailed Sections */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <section
            key={category.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {category.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {category.description}
              </p>
            </div>

            {/* Metrics Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-slate-400 line-clamp-1">
                      {metric.label}
                    </span>
                    {metric.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex-shrink-0">
                        {metric.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 leading-snug">
                      {metric.subtext}
                    </div>
                  </div>

                  {metric.trend && (
                    <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-teal-300">
                      <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{metric.trend}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Analytical Insights Callout */}
            <div className="p-5 rounded-2xl glass-surface-subtle border border-cyan-500/20 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                Urban Field Intelligence & Key Observations
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                {category.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
