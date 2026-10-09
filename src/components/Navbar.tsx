import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  Sparkles,
  Bookmark,
  Sun,
  CloudSun,
  CloudRain,
  Eye,
  BookOpen,
  ChevronDown,
  Calendar,
  Settings,
  Bell,
  Plane,
  Flame,
  Palette,
  PieChart,
} from 'lucide-react';
import { CityInfo, CityId } from '../types';

interface NavbarProps {
  cities: CityInfo[];
  selectedCity: CityInfo;
  onSelectCity: (cityId: CityId) => void;
  onSearch: (query: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenCopilot: () => void;
  onOpenResearch: () => void;
  onSelectTab?: (tab: any) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onSearch,
  savedCount,
  onOpenSaved,
  onOpenCopilot,
  onOpenResearch,
  onSelectTab,
  highContrast,
  onToggleHighContrast,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [atmosphere, setAtmosphere] = useState<'dusk' | 'aurora' | 'emerald' | 'noir'>('dusk');
  const [atmosphereDropdownOpen, setAtmosphereDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const changeAtmosphere = (atmo: 'dusk' | 'aurora' | 'emerald' | 'noir') => {
    setAtmosphere(atmo);
    document.body.setAttribute('data-atmosphere', atmo);
    setAtmosphereDropdownOpen(false);
  };

  const getWeatherIcon = (iconName: string) => {
    if (iconName === 'Sun') return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    if (iconName === 'CloudRain') return <CloudRain className="w-3.5 h-3.5 text-cyan-400" />;
    return <CloudSun className="w-3.5 h-3.5 text-amber-300" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#16171e]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 py-3">
      <div className="max-w-[1540px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand & City Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <div className="flex items-center gap-2 cursor-pointer">
            {/* AiroGuide Style Wing Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-slate-950 font-black shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transform -rotate-45">
                <path d="M12 2L2 22l10-4 10 4L12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold font-display tracking-tight text-white">
                  AiroGuide
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Pune & Talegaon
                </span>
              </div>
            </div>
          </div>

          {/* Quick Experience Pills from Screenshot */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              onClick={() => onSelectTab && onSelectTab('explore')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-200 text-xs font-medium border border-white/[0.06] transition-colors"
            >
              <span>🎈</span>
              <span>Experiences</span>
            </button>
            <button
              onClick={() => onSelectTab && onSelectTab('infographics')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-xs font-medium border border-amber-500/30 transition-colors shadow-sm"
            >
              <span>📊</span>
              <span>Pune Infographics</span>
            </button>
            <button
              onClick={() => onSelectTab && onSelectTab('saved')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-200 text-xs font-medium border border-white/[0.06] transition-colors"
            >
              <span>✈️</span>
              <span>Trips</span>
            </button>
            <button
              onClick={() => onSelectTab && onSelectTab('reports')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-200 text-xs font-medium border border-white/[0.06] transition-colors"
            >
              <span>🔔</span>
              <span>Services</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar (AiroGuide pill style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-xl hidden md:block"
          role="search"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search destinations, hotels, or experiences..."
              className="w-full pl-11 pr-24 py-2.5 rounded-full bg-[#1e2029] border border-white/[0.08] focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 text-xs sm:text-sm placeholder:text-slate-500 text-white shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* City Selector & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#20222b] hover:bg-[#282a35] text-xs font-medium text-slate-200 transition-all border border-white/[0.08]"
              aria-expanded={cityDropdownOpen}
              aria-label="Select City"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">{selectedCity.name}</span>
              <div className="hidden lg:flex items-center gap-1.5 text-slate-400 pl-1 border-l border-white/10 text-[11px]">
                {getWeatherIcon(selectedCity.weather.icon)}
                <span>{selectedCity.weather.temp}°C</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1b1c24] rounded-2xl p-2 shadow-2xl border border-white/15 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-mono text-slate-400 px-3 py-1.5 uppercase">
                  Metropolitan Regions
                </div>
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city.id);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      selectedCity.id === city.id
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{city.name}</div>
                      <div className="text-[11px] text-slate-400">{city.country}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono text-slate-200">{city.weather.temp}°C</div>
                      <div className="text-[10px] text-teal-400">{city.weather.airQualityStatus}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Atmosphere Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setAtmosphereDropdownOpen(!atmosphereDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-300 hover:text-white border border-white/[0.08] transition-all text-xs"
              title="Change Background Atmosphere"
              aria-label="Change Background Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-mono text-[11px] capitalize">
                {atmosphere}
              </span>
            </button>

            {atmosphereDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#1b1c24] rounded-2xl p-2 shadow-2xl border border-white/15 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Select Visual Atmosphere
                </div>
                <button
                  onClick={() => changeAtmosphere('dusk')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    atmosphere === 'dusk'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🌅</span>
                    <span>Sunset Dunes</span>
                  </span>
                  {atmosphere === 'dusk' && <span className="text-[10px] text-amber-400">Active</span>}
                </button>
                <button
                  onClick={() => changeAtmosphere('aurora')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    atmosphere === 'aurora'
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🌌</span>
                    <span>Cosmic Aurora</span>
                  </span>
                  {atmosphere === 'aurora' && <span className="text-[10px] text-cyan-400">Active</span>}
                </button>
                <button
                  onClick={() => changeAtmosphere('emerald')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    atmosphere === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🍃</span>
                    <span>Sahyadri Emerald</span>
                  </span>
                  {atmosphere === 'emerald' && <span className="text-[10px] text-emerald-400">Active</span>}
                </button>
                <button
                  onClick={() => changeAtmosphere('noir')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    atmosphere === 'noir'
                      ? 'bg-white/10 text-white border border-white/20 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🖤</span>
                    <span>Obsidian Noir</span>
                  </span>
                  {atmosphere === 'noir' && <span className="text-[10px] text-slate-400">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* Research & Standards Link */}
          <button
            onClick={onOpenResearch}
            className="p-2 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
            title="Academic Research & Standards (Hamid et al., Werneck, Zhang)"
            aria-label="View Research Foundations"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
          </button>

          {/* High Contrast / Accessibility Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-2 rounded-full border transition-all ${
              highContrast
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-[#20222b] hover:bg-[#282a35] text-slate-300 hover:text-white border-white/[0.06]'
            }`}
            title="Toggle WCAG High Contrast Mode"
            aria-label="Toggle High Contrast Mode"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Saved Bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 rounded-full bg-[#20222b] hover:bg-[#282a35] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
            title="Saved Places & Itineraries"
            aria-label="Open Saved Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Copilot CTA Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            aria-label="Open AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
