import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Navigation,
  Clock,
  CheckCircle2,
  ThumbsUp,
  MapPin,
  TrendingDown,
  Info,
  Compass,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { CitizenReport, RouteOption, CityInfo } from '../types';

interface SafetyViewProps {
  city: CityInfo;
  reports: CitizenReport[];
  routeOptions: RouteOption[];
  onCorroborate: (reportId: string) => void;
  onOpenReportModal: () => void;
  onOpenMapWithRoute?: (routeType: 'fastest' | 'safer_hazard_aware') => void;
}

export const SafetyView: React.FC<SafetyViewProps> = ({
  city,
  reports,
  routeOptions,
  onCorroborate,
  onOpenReportModal,
  onOpenMapWithRoute,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRouteTab, setSelectedRouteTab] = useState<'safer_hazard_aware' | 'fastest'>('safer_hazard_aware');

  const filteredReports = reports.filter((r) => {
    if (selectedSeverity !== 'all' && r.severity !== selectedSeverity) return false;
    return true;
  });

  const fastestRoute = routeOptions.find((r) => r.type === 'fastest') || routeOptions[0];
  const safeRoute = routeOptions.find((r) => r.type === 'safer_hazard_aware') || routeOptions[1] || routeOptions[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Civic Safety & Multi-Objective Route Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Real-Time Hazard Radar & Safer Corridors
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-criteria routing powered by civic reports. Bypasses active flood choke-points, deep potholes, and sidewalk barriers while preserving transit efficiency.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Road Hazard</span>
        </button>
      </div>

      {/* Safety Formula Explanation Callout */}
      <div className="p-4 sm:p-5 rounded-2xl glass-surface-subtle border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">Mathematical Routing Objective:</span>
            <p className="text-slate-300 font-mono text-[11px]">
              route_cost = travel_time_cost + (2.5 × hazard_penalty) + accessibility_penalty
            </p>
            <p className="text-[11px] text-slate-400">
              Grounded in Zhang et al. (Information Fusion 2024) survey of multi-objective route recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Route Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Corridor Comparison Engine ({city.name})
            </h2>
            <p className="text-xs text-slate-400">
              Comparing direct arterial transit vs CityPulse hazard-avoidance path
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option 1: CityPulse Safer Route */}
          {safeRoute && (
            <div className="glass-panel rounded-3xl p-6 border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase tracking-wider rounded-bl-xl border-l border-b border-emerald-500/30">
                Recommended by CityPulse
              </div>

              <div>
                <div className="text-[11px] font-mono text-emerald-400 uppercase">
                  Option B · Hazard-Aware Eco Corridor
                </div>
                <h3 className="text-base font-bold font-display text-white mt-1">
                  {safeRoute.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {safeRoute.explanation}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl glass-surface-subtle text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Duration</div>
                  <div className="font-bold text-white mt-0.5">{safeRoute.durationMin} min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Distance</div>
                  <div className="font-bold text-white mt-0.5">{safeRoute.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 font-mono">Hazards Avoided</div>
                  <div className="font-bold text-emerald-300 mt-0.5">+{safeRoute.hazardsAvoided} Clean</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Safety Score: {safeRoute.totalScore}/100</span>
                </span>
                {onOpenMapWithRoute && (
                  <button
                    onClick={() => onOpenMapWithRoute('safer_hazard_aware')}
                    className="text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Option 2: Fastest Direct Transit (with hazards) */}
          {fastestRoute && (
            <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 relative flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] font-mono text-amber-400 uppercase">
                  Option A · Fastest Transit (Direct)
                </div>
                <h3 className="text-base font-bold font-display text-white mt-1">
                  {fastestRoute.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {fastestRoute.explanation}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl glass-surface-subtle text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Duration</div>
                  <div className="font-bold text-white mt-0.5">{fastestRoute.durationMin} min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Distance</div>
                  <div className="font-bold text-white mt-0.5">{fastestRoute.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 font-mono">Hazard Exposure</div>
                  <div className="font-bold text-amber-300 mt-0.5">High Risk</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Penalty Exposure: {fastestRoute.hazardScore} pts</span>
                </span>
                {onOpenMapWithRoute && (
                  <button
                    onClick={() => onOpenMapWithRoute('fastest')}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>View on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Civic Hazard Radar Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Active Civic Hazard Radar ({filteredReports.length})
            </h2>
            <p className="text-xs text-slate-400">
              Verified road closures, potholes, waterlogging, and pedestrian obstacles
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'critical', 'high', 'moderate'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  selectedSeverity === sev
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'glass-surface-subtle text-slate-400 hover:text-white'
                }`}
              >
                {sev === 'all' ? 'All Severities' : sev}
              </button>
            ))}
          </div>
        </div>

        {/* Hazard List Cards */}
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="glass-card rounded-2xl p-5 border border-white/10 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      report.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : report.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{report.title}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{report.locationName}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">
                        {new Date(report.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    Status: {report.status.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg ${
                      report.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {report.severity}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-1">
                {report.description}
              </p>

              {report.photoUrl && (
                <div className="pl-1 pt-1">
                  <img
                    src={report.photoUrl}
                    alt="Hazard evidence"
                    className="w-32 h-20 rounded-xl object-cover border border-white/10"
                  />
                </div>
              )}

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Reported by: {report.reportedBy} {report.isAnonymous && '(Private Identity Protected)'}
                </span>

                <button
                  onClick={() => onCorroborate(report.id)}
                  disabled={report.confirmedByUser}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                    report.confirmedByUser
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>
                    {report.confirmedByUser ? 'You Confirmed' : 'I Saw This Too'} ({report.confirmationsCount})
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
