import React from 'react';
import {
  Landmark,
  Clock,
  BookOpen,
  Calendar,
  ExternalLink,
  MapPin,
  Compass,
} from 'lucide-react';
import { HeritageArticle, CityInfo, Place } from '../types';

interface HistoryViewProps {
  city: CityInfo;
  articles: HeritageArticle[];
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  city,
  articles,
  places,
  onSelectPlace,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Landmark className="w-3.5 h-3.5" />
            <span>Curated Heritage & Archival Memory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            History, Culture & Architectural Heritage
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Educational timelines, architectural provenance, and historical walking itineraries sourced from public archives and UNESCO registries.
          </p>
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-8">
        {articles.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 text-slate-400 text-xs">
            No historical documentation currently archived for this region.
          </div>
        ) : (
          articles.map((art) => {
            const associated = places.filter((p) =>
              art.associatedPlaceIds.includes(p.id)
            );

            return (
              <article
                key={art.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/10 space-y-6 shadow-2xl"
              >
                {/* Hero Photo Banner */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
                  <img
                    src={art.heroPhoto}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D19] via-[#080D19]/40 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 space-y-1">
                    <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                      {art.centuryPeriod}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                      {art.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                      {art.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-300">
                  {/* Article Prose */}
                  <p className="leading-relaxed text-sm sm:text-base text-slate-200">
                    {art.content}
                  </p>

                  {/* Key Milestones Timeline */}
                  <div className="p-5 rounded-2xl glass-surface-subtle border border-white/5 space-y-4">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-amber-300">
                      Chronological Milestones
                    </h3>
                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 pl-6">
                      {art.keyMilestones.map((m, idx) => (
                        <div key={idx} className="relative space-y-0.5">
                          <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <div className="font-mono text-xs text-amber-300 font-bold">
                            {m.year}
                          </div>
                          <div className="text-xs text-slate-300">{m.event}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Associated Monuments */}
                  {associated.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase font-mono tracking-wider text-cyan-400">
                        Associated Preserved Monuments & Sites
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {associated.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => onSelectPlace(p)}
                            className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.photos[0]}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {p.neighborhood}
                                </div>
                              </div>
                            </div>
                            <span className="text-cyan-400 text-xs font-semibold">
                              View →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Archival Citations & Sources */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Sourced from:</span>
                      {art.sourceCitations.map((cite, idx) => (
                        <span key={idx} className="font-mono text-slate-300">
                          {cite.title}
                          {idx < art.sourceCitations.length - 1 && ', '}
                        </span>
                      ))}
                    </div>

                    {art.walkingTourTimeMin && (
                      <div className="flex items-center gap-1.5 font-mono text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Self-Guided Tour: ~{art.walkingTourTimeMin} mins</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
