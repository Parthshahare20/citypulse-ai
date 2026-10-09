import React, { useState } from 'react';
import {
  Flag,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  ThumbsUp,
  MapPin,
  Clock,
  Shield,
  Send,
  Eye,
  Filter,
} from 'lucide-react';
import { CitizenReport, CityInfo, ReportCategory } from '../types';

interface CitizenReportsViewProps {
  city: CityInfo;
  reports: CitizenReport[];
  onSubmitReport: (reportData: any) => Promise<void>;
  onCorroborate: (reportId: string) => void;
}

export const CitizenReportsView: React.FC<CitizenReportsViewProps> = ({
  city,
  reports,
  onSubmitReport,
  onCorroborate,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Form states
  const [category, setCategory] = useState<ReportCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('moderate');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'pothole', label: 'Potholes' },
    { id: 'flooding', label: 'Flooding & Drainage' },
    { id: 'damaged_road', label: 'Damaged Roads' },
    { id: 'broken_streetlight', label: 'Broken Lighting' },
    { id: 'sidewalk_blocked', label: 'Sidewalk Obstacles' },
    { id: 'infrastructure', label: 'Public Assets' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationName.trim()) return;

    setSubmitting(true);
    try {
      // Use city center with slight jitter as simulated coordinates
      const coords: [number, number] = [
        city.center[0] + (Math.random() - 0.5) * 0.03,
        city.center[1] + (Math.random() - 0.5) * 0.03,
      ];

      await onSubmitReport({
        cityId: city.id,
        category,
        title,
        description,
        locationName,
        coordinates: coords,
        severity,
        photoUrl: photoUrl.trim() || undefined,
        isAnonymous,
        reportedBy: isAnonymous ? 'Anonymous Citizen' : 'Local Resident',
      });

      setShowSubmitModal(false);
      setTitle('');
      setDescription('');
      setLocationName('');
      setPhotoUrl('');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Flag className="w-3.5 h-3.5" />
            <span>Civic Intelligence & Infrastructure Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Citizen Reporting & Hazard Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Report potholes, waterlogging, broken streetlights, or accessibility obstacles. Corroborated by residents and dispatched to municipal agencies.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Civic Report</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl glass-input text-xs bg-slate-900 border-white/10"
          aria-label="Filter by Status"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="corroborated">Corroborated</option>
          <option value="verified">Verified</option>
          <option value="forwarded">Forwarded to Agency</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 text-slate-400 text-xs">
            No civic reports found matching your current filters.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="glass-card rounded-3xl p-6 border border-white/10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      report.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : report.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      {report.title}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{report.locationName}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">
                        {new Date(report.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {report.categoryLabel}
                  </span>
                  <span
                    className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-xl border ${
                      report.status === 'forwarded'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : report.status === 'corroborated'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        : 'bg-slate-800 text-slate-300 border-white/10'
                    }`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {report.description}
              </p>

              {report.photoUrl && (
                <div>
                  <img
                    src={report.photoUrl}
                    alt="Citizen evidence"
                    className="w-48 h-32 rounded-2xl object-cover border border-white/10"
                  />
                </div>
              )}

              {/* Status Stepper Progression */}
              <div className="p-3 rounded-2xl glass-surface-subtle text-[11px] text-slate-400 flex flex-wrap items-center gap-4">
                <span className="font-semibold text-slate-200">Lifecycle Audit:</span>
                {report.statusHistory?.map((hist, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="capitalize">{hist.status.replace('_', ' ')}</span>
                    {hist.note && <span className="text-slate-400">({hist.note})</span>}
                  </div>
                ))}
              </div>

              {/* Footer with Corroboration button */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Submitted by {report.reportedBy} {report.isAnonymous && '(Protected)'}
                </span>

                <button
                  onClick={() => onCorroborate(report.id)}
                  disabled={report.confirmedByUser}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                    report.confirmedByUser
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 cursor-default'
                      : 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>
                    {report.confirmedByUser ? 'You Corroborated' : 'Confirm / Corroborate'} ({report.confirmationsCount})
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 text-slate-100 relative border border-white/15 shadow-2xl">
            <h2 className="text-xl font-bold font-display text-white mb-1">
              Submit Civic Hazard or Infrastructure Issue
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Empower your fellow citizens and city departments with verified reports
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 border-white/10"
                >
                  <option value="pothole">Road Surface Pothole</option>
                  <option value="flooding">Waterlogging & Drainage Failure</option>
                  <option value="damaged_road">Damaged Asphalt or Paver Blocks</option>
                  <option value="broken_streetlight">Broken Streetlights (Dim Pedestrian Path)</option>
                  <option value="sidewalk_blocked">Sidewalk Barrier / Inaccessible Curb</option>
                  <option value="waste_overflow">Sanitation & Overflowing Bins</option>
                  <option value="infrastructure">Damaged Public Asset</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole right in northbound bike lane"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Specific Location / Landmark</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Intersection of 20th St & Mission St"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Severity Level</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(['low', 'moderate', 'high', 'critical'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`p-2 rounded-xl uppercase font-mono text-[11px] font-semibold border transition-all ${
                        severity === s
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'glass-surface-subtle text-slate-400 border-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe depth, impact on pedestrians or cyclists, and timing..."
                  className="w-full p-3 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Photo Evidence URL (optional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-300 cursor-pointer">
                  Protect My Identity (Submit Anonymously)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
