import React from 'react';
import { BookOpen, X, Shield, CheckCircle2, ExternalLink } from 'lucide-react';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const papers = [
    {
      title: 'How smart is e-tourism? A systematic review of smart tourism recommendation systems',
      authors: 'Hamid et al., Computer Science Review (2021)',
      doi: '10.1016/j.cosrev.2020.100337',
      impact: 'Informed CityPulse’s multi-criteria data management, context-aware filtering, and hybrid recommendation architecture.',
    },
    {
      title: 'Points of Interest recommendations: Methods, evaluation, and future directions',
      authors: 'Werneck et al., Information Systems (2021)',
      doi: '10.1016/j.is.2021.101789',
      impact: 'Guided geospatial clustering, cold-start handling, and avoiding popularity bias by surfacing verified hidden gems.',
    },
    {
      title: 'A survey of route recommendations: Methods, applications, and opportunities',
      authors: 'Zhang et al., Information Fusion (2024)',
      doi: '10.1016/j.inffus.2024.102413',
      impact: 'Provided the multi-objective routing foundation: route_cost = travel_time_cost + weighted_hazard_penalty + accessibility_penalty.',
    },
    {
      title: 'Tourism recommendation system based on semantic clustering and sentiment analysis',
      authors: 'Abbasi-Moud et al., Expert Systems with Applications (2021)',
      doi: '10.1016/j.eswa.2020.114324',
      impact: 'Structured our community review tags, multi-category sentiment breakdown (atmosphere, value, accessibility), and trust scores.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Research Documentation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Research Foundations & Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Evidence-based design inputs, accessibility compliance, and safety standards
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-3">
              Peer-Reviewed Foundations
            </h3>
            <div className="space-y-3">
              {papers.map((paper, idx) => (
                <div key={idx} className="p-4 rounded-2xl glass-surface-subtle border border-white/5 space-y-1.5">
                  <div className="font-medium text-white">{paper.title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{paper.authors}</span>
                    <span>·</span>
                    <span className="font-mono text-cyan-300">DOI: {paper.doi}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    <strong className="text-cyan-400">Application: </strong>
                    {paper.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-teal-400 font-semibold mb-3">
              Accessibility & Security Adherence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>W3C WCAG 2.2 Level AA</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-contrast mode support, visible focus rings, touch targets ≥ 44px, screen-reader landmark labels, and non-color dependent hazard severity.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-surface-subtle border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  <Shield className="w-4 h-4" />
                  <span>OWASP ASVS & Privacy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Server-side API keys, input sanitization, anonymous citizen reporting options, no continuous background location tracking, and clear data provenance.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <strong>Safety & Uncertainty Disclosure:</strong> Route recommendations and hazard alerts represent community and municipal reports. CityPulse does not guarantee absolute safety. Always observe local traffic laws and police advisories.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
