import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Accessibility,
  Bookmark,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Place, PlaceCategory, CityInfo } from '../types';

interface ExploreViewProps {
  places: Place[];
  city: CityInfo;
  savedPlaceIds: string[];
  onToggleSave: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onOpenMap: () => void;
  onOpenCopilot: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  places,
  city,
  savedPlaceIds,
  onToggleSave,
  onSelectPlace,
  onOpenMap,
  onOpenCopilot,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Experiences', icon: '✨' },
    { id: 'temple', label: 'Temples & Shrines', icon: '🛕' },
    { id: 'mall', label: 'Mega Malls & Retail', icon: '🛍️' },
    { id: 'heritage', label: 'Heritage Forts & Caves', icon: '🏰' },
    { id: 'dining', label: 'Dining & Misal Eateries', icon: '🍛' },
    { id: 'cafe', label: 'Artisan Cafés', icon: '☕' },
    { id: 'nature', label: 'Lakes & Green Hills', icon: '🌿' },
    { id: 'entertainment', label: 'Sports & Arenas', icon: '🏟️' },
    { id: 'museum', label: 'Museums & Memorials', icon: '🏛️' },
    { id: 'hidden_gem', label: 'Hidden Gems & Industry', icon: '💎' },
  ];

  // Client-side filtering
  const filteredPlaces = places
    .filter((place) => {
      if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
      if (wheelchairOnly && !place.accessibility.wheelchairAccessible) return false;
      if (maxPrice !== null && place.priceLevel > maxPrice) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          place.name.toLowerCase().includes(q) ||
          place.description.toLowerCase().includes(q) ||
          place.neighborhood.toLowerCase().includes(q) ||
          place.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.priceLevel - b.priceLevel;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* City Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 sunset-radial">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Curated Urban Atlas · {city.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
            Discover More. <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Navigate Smarter.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            {city.tagline}. Grounded in verified municipal registers, community reviews, and accessibility audits.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenMap}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 rounded-xl glass-surface-subtle hover:bg-white/10 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask CityPulse Copilot</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-gradient-to-l from-amber-500 via-orange-500 to-transparent pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-4">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? places.length
                : places.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/30 text-amber-100 font-bold'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search, Constraints, and View Mode */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-white/5">
          {/* Instant Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, neighborhood, or tags..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Wheelchair accessible toggle */}
            <button
              onClick={() => setWheelchairOnly(!wheelchairOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                wheelchairOnly
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'glass-surface-subtle text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Step-Free Only</span>
            </button>

            {/* Price Filter */}
            <select
              value={maxPrice === null ? 'all' : maxPrice.toString()}
              onChange={(e) => setMaxPrice(e.target.value === 'all' ? null : Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl glass-input text-xs bg-slate-900 border-white/10"
              aria-label="Filter by Budget"
            >
              <option value="all">Any Price</option>
              <option value="1">Budget Only ($ / Free)</option>
              <option value="2">Moderate ($$)</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl glass-input text-xs bg-slate-900 border-white/10"
              aria-label="Sort Places"
            >
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
              <option value="reviews">Most Reviewed</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center glass-surface-subtle rounded-xl p-0.5 border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                }`}
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Place Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-white">{filteredPlaces.length}</span> verified places in {city.name}
        </div>
        {(searchQuery || wheelchairOnly || maxPrice !== null || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setWheelchairOnly(false);
              setMaxPrice(null);
              setSelectedCategory('all');
            }}
            className="text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Places Collection */}
      {filteredPlaces.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
          <p className="text-sm text-slate-300">No places found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setWheelchairOnly(false);
              setMaxPrice(null);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => {
            const isSaved = savedPlaceIds.includes(place.id);
            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="group glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Photo container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D19] via-transparent to-black/30" />

                  {/* Category Pill & Save Action */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                      {place.categoryLabel}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(place.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                      aria-label="Save bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{place.neighborhood}</span>
                    </span>
                    <span className="font-mono text-amber-300 font-medium">{place.estimatedCost}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold font-display text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-300 font-bold flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {place.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      {place.accessibility.wheelchairAccessible && (
                        <span className="flex items-center gap-1 text-teal-300" title="Wheelchair accessible">
                          <Accessibility className="w-3 h-3" />
                          <span>Step-Free</span>
                        </span>
                      )}
                      {place.verified && (
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredPlaces.map((place) => {
            const isSaved = savedPlaceIds.includes(place.id);
            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="group glass-card rounded-2xl p-4 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        {place.categoryLabel}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{place.neighborhood}</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-xl line-clamp-1">
                      {place.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{place.rating}</span>
                    <span className="text-slate-400 font-normal">({place.reviewCount})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    {place.estimatedCost}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(place.id);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'glass-surface-subtle text-slate-300 border-white/10'
                    }`}
                  >
                    <Bookmark className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
