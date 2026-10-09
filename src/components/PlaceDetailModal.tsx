import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Accessibility,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Share2,
  MessageSquarePlus,
  ThumbsUp,
  ShieldCheck,
  Send,
  Calendar,
} from 'lucide-react';
import { Place, PlaceReview, CitizenReport } from '../types';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (placeId: string) => void;
  onAddReview: (placeId: string, reviewData: any) => Promise<void>;
  onVoteHelpful: (reviewId: string) => void;
  reviews: PlaceReview[];
  nearbyHazards: CitizenReport[];
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isSaved,
  onToggleSave,
  onAddReview,
  onVoteHelpful,
  reviews,
  nearbyHazards,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'accessibility' | 'reviews' | 'hazards'>('overview');
  const [showReviewComposer, setShowReviewComposer] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!place) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      const parsedTags = tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Community Experience'];
      const parsedPhotos = photoInput.trim() ? [photoInput.trim()] : [];

      await onAddReview(place.id, {
        userName,
        rating,
        comment,
        visitDate,
        tags: parsedTags,
        photos: parsedPhotos,
      });

      setShowReviewComposer(false);
      setComment('');
      setTagsInput('');
      setPhotoInput('');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl text-slate-100 relative border border-white/15 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-white/10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-t-3xl bg-slate-900">
          <img
            src={place.photos[0] || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D19] via-[#080D19]/40 to-transparent" />

          {/* Action buttons on header */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
              {place.categoryLabel}
            </span>
            {place.verified && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {place.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {place.tagline}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(place.id)}
                className={`p-2.5 rounded-xl transition-all border ${
                  isSaved
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                }`}
                title={isSaved ? 'Remove Bookmark' : 'Save Bookmark'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-black/60 text-white border border-white/20 hover:bg-black/80 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {copiedNotification && (
          <div className="absolute top-16 right-4 z-30 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-semibold animate-in fade-in">
            Link copied to clipboard!
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl glass-surface-subtle border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Rating</div>
              <div className="flex items-center gap-1.5 text-base font-bold text-amber-300 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{place.rating}</span>
                <span className="text-xs text-slate-400 font-normal">({place.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-surface-subtle border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Cost Estimate</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                {place.estimatedCost}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-surface-subtle border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Opening Hours</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">
                {place.openingHours}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-surface-subtle border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Accessibility</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold mt-0.5">
                <Accessibility className="w-4 h-4 text-cyan-400" />
                <span className={place.accessibility.wheelchairAccessible ? 'text-teal-300' : 'text-slate-400'}>
                  {place.accessibility.wheelchairAccessible ? 'Step-Free / Accessible' : 'Partial Access'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'accessibility', label: 'Accessibility Specs' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
              { id: 'hazards', label: `Nearby Civic Radar (${nearbyHazards.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm text-slate-300">
              <div>
                <h3 className="text-xs uppercase font-mono text-cyan-400 tracking-wider mb-2">
                  About this Venue
                </h3>
                <p className="leading-relaxed">{place.description}</p>
              </div>

              {place.historicalContext && (
                <div className="p-4 rounded-2xl glass-surface-subtle border border-white/5">
                  <h4 className="text-xs uppercase font-mono text-amber-300 tracking-wider mb-1">
                    Historical Context
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300">{place.historicalContext}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs uppercase font-mono text-cyan-400 tracking-wider mb-2">
                  Amenities & Facilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {place.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg glass-surface-subtle text-xs text-slate-200 border border-white/5"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-surface-subtle border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{place.address}</span>
                </div>
                <div className="font-mono text-[11px]">
                  Source: {place.dataSource} (Updated: {place.lastUpdated})
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Accessibility Specs */}
          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 leading-relaxed">
                CityPulse evaluates venue access using universal design principles to assist individuals using wheelchairs, mobility devices, guide animals, or sensory accommodation.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Step-Free Entrance & Pathways', active: place.accessibility.stepFreeAccess },
                  { label: 'Wheelchair Accessible Seating / Grounds', active: place.accessibility.wheelchairAccessible },
                  { label: 'ADA Compliant Accessible Restrooms', active: place.accessibility.accessibleRestrooms },
                  { label: 'Service Animals Allowed', active: place.accessibility.serviceAnimalAllowed },
                  { label: 'Audio Guide Available', active: place.accessibility.audioGuideAvailable },
                  { label: 'Sensory-Friendly Hours / Low Noise', active: place.accessibility.sensoryFriendlyHours },
                  { label: 'Tactile / Braille Signage', active: place.accessibility.brailleSignage },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl glass-surface-subtle border border-white/5 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        item.active
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.active ? 'Verified Available' : 'Not Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Community Experiences</h3>
                  <p className="text-xs text-slate-400">Authentic visitor reports and local recommendations</p>
                </div>
                <button
                  onClick={() => setShowReviewComposer(!showReviewComposer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>{showReviewComposer ? 'Cancel' : 'Write Review'}</span>
                </button>
              </div>

              {/* Review Composer Form */}
              {showReviewComposer && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 rounded-2xl glass-surface-subtle border border-cyan-500/30 space-y-4 animate-in fade-in"
                >
                  <div className="text-xs font-semibold text-cyan-300">Submit Your Experience</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Alex Traveler"
                        className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Rating (1 to 5 Stars)</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl glass-input text-xs bg-slate-900"
                      >
                        <option value="5">5 Stars - Outstanding</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Average</option>
                        <option value="2">2 Stars - Poor</option>
                        <option value="1">1 Star - Disappointing</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Visit Date</label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Written Review</label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share tips on best times to visit, crowd density, affordability, and accessibility..."
                      className="w-full p-3 rounded-xl glass-input text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. Sunset, Wheelchair Accessible, Budget Friendly"
                        className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Photo URL (optional)</label>
                      <input
                        type="url"
                        value={photoInput}
                        onChange={(e) => setPhotoInput(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewComposer(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? 'Publishing...' : 'Publish Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No community reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl glass-surface-subtle border border-white/5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-slate-200">{rev.userName}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                              <span>Visited {rev.visitDate}</span>
                              {rev.verifiedVisit && (
                                <span className="text-teal-400">· Verified Visit</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{rev.comment}</p>

                      {rev.photos && rev.photos.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {rev.photos.map((p, idx) => (
                            <img
                              key={idx}
                              src={p}
                              alt="Review"
                              className="w-20 h-20 rounded-xl object-cover border border-white/10"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <div className="flex flex-wrap gap-1">
                          {rev.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] text-slate-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => onVoteHelpful(rev.id)}
                          className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Hazards */}
          {activeTab === 'hazards' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Active civic alerts reported within ~2 km of {place.name}:
              </div>
              {nearbyHazards.length === 0 ? (
                <div className="p-6 rounded-2xl glass-surface-subtle border border-emerald-500/20 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No active hazards or road closures reported nearby.</span>
                </div>
              ) : (
                nearbyHazards.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl glass-surface-subtle border border-amber-500/30 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>{h.title}</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {h.severity}
                      </span>
                    </div>
                    <p className="text-slate-300">{h.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Location: {h.locationName} · Corroborated by {h.confirmationsCount} residents
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
