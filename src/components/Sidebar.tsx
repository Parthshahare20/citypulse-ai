import React from 'react';
import {
  Compass,
  Map,
  ShieldAlert,
  Sparkles,
  Users,
  Flag,
  BarChart3,
  Landmark,
  Bookmark,
  SlidersHorizontal,
  PieChart,
} from 'lucide-react';

export type ActiveTab =
  | 'explore'
  | 'map'
  | 'infographics'
  | 'safety'
  | 'copilot'
  | 'community'
  | 'reports'
  | 'compare'
  | 'history'
  | 'saved'
  | 'admin';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  reportsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  reportsCount,
}) => {
  const navItems = [
    { id: 'explore' as ActiveTab, label: 'Explore', icon: Compass },
    { id: 'map' as ActiveTab, label: 'Interactive Map', icon: Map },
    { id: 'infographics' as ActiveTab, label: 'Infographics & Data', icon: PieChart, badge: 'PUNE' },
    { id: 'safety' as ActiveTab, label: 'Safety & Routing', icon: ShieldAlert },
    { id: 'copilot' as ActiveTab, label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'community' as ActiveTab, label: 'Community Feed', icon: Users },
    { id: 'reports' as ActiveTab, label: 'Citizen Reports', icon: Flag, count: reportsCount },
    { id: 'compare' as ActiveTab, label: 'City Compare', icon: BarChart3 },
    { id: 'history' as ActiveTab, label: 'Heritage & Tours', icon: Landmark },
    { id: 'saved' as ActiveTab, label: 'Saved & Trips', icon: Bookmark },
    { id: 'admin' as ActiveTab, label: 'Civic Admin', icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Desktop Left Rail */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/10 p-3 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
        <div className="text-[11px] font-mono text-slate-500 uppercase px-3 py-2">
          Urban Navigation
        </div>
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-md shadow-amber-950/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo Mode Notice Banner */}
        <div className="mt-auto pt-4 border-t border-white/5 px-2">
          <div className="p-3 rounded-2xl glass-surface-subtle border border-cyan-500/20 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Demonstration Mode</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Connected to OpenStreetMap, live simulated civic hazard radar, and Gemini 3.8 Flash intelligence.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-2 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[54px] transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] leading-none">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
