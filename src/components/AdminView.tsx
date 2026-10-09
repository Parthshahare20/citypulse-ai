import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { CitizenReport, ReportStatus } from '../types';

interface AdminViewProps {
  reports: CitizenReport[];
  onUpdateReportStatus: (reportId: string, newStatus: ReportStatus, note?: string) => Promise<void>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  reports,
  onUpdateReportStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dataProviders = [
    {
      name: 'OpenStreetMap Cartography & Nominatim',
      type: 'Geospatial & Vector Tiles',
      status: 'Operational',
      latencyMs: 42,
      lastSync: '12 mins ago',
      attribution: '© OpenStreetMap contributors',
    },
    {
      name: 'Municipal Civic Hazard Radar (SFMTA / MCGM Open Data)',
      type: 'Civic Infrastructure Feeds',
      status: 'Operational',
      latencyMs: 110,
      lastSync: '5 mins ago',
      attribution: 'Civic Open Data Portal & Verified Citizen Reports',
    },
    {
      name: 'Meteorological & Atmospheric Air Quality Engine',
      type: 'Environmental Weather Snapshot',
      status: 'Operational',
      latencyMs: 85,
      lastSync: '18 mins ago',
      attribution: 'OpenWeather & National Oceanic Feeds',
    },
    {
      name: 'UNESCO World Heritage & Archaeological Registries',
      type: 'Cultural & Monumental Archives',
      status: 'Operational',
      latencyMs: 64,
      lastSync: '1 hr ago',
      attribution: 'UNESCO & Historic England & Archaeological Survey of India',
    },
  ];

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    setUpdatingId(reportId);
    try {
      await onUpdateReportStatus(reportId, newStatus, `Status updated by civic administrator`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Civic Administration & Data Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Civic Moderation & Data Provider Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Monitor real-time infrastructure feeds, audit community citizen reports, and manage dispatch lifecycles to municipal road departments.
          </p>
        </div>
      </div>

      {/* External Data Providers Health Console */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
          <Activity className="w-4 h-4" />
          <span>External Data Providers & Source Provenance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataProviders.map((dp, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 border border-white/10 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{dp.name}</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{dp.status}</span>
                </span>
              </div>
              <div className="text-slate-400">{dp.type}</div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Latency: {dp.latencyMs}ms</span>
                <span>Last Sync: {dp.lastSync}</span>
              </div>
              <div className="text-[10px] text-slate-400 italic">
                Attribution: {dp.attribution}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Moderation Queue */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Citizen Reports Moderation Pipeline ({filteredReports.length})
            </h2>
            <p className="text-xs text-slate-400">
              Audit reports and transition their verification lifecycle
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'submitted', 'under_review', 'corroborated', 'verified', 'forwarded', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'glass-surface-subtle text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/10">
                      {report.categoryLabel}
                    </span>
                    <span className="font-bold text-sm text-white">{report.title}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Location: {report.locationName} · Corroborated by {report.confirmationsCount} residents
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Current: {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">{report.description}</p>

              {/* Status Update Action Controls */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  Submitted {new Date(report.submittedAt).toLocaleDateString()} by {report.reportedBy}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Change Status:</span>
                  {(['under_review', 'verified', 'forwarded', 'resolved'] as ReportStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={report.status === st || updatingId === report.id}
                      onClick={() => handleStatusChange(report.id, st)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] capitalize transition-all ${
                        report.status === st
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 cursor-default'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
