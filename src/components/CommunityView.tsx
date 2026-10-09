import React, { useState } from 'react';
import {
  Users,
  Star,
  ThumbsUp,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
  Tag,
  Calendar,
  Share2,
} from 'lucide-react';
import { PlaceReview, Place } from '../types';

interface CommunityViewProps {
  reviews: PlaceReview[];
  places: Place[];
  onVoteHelpful: (reviewId: string) => void;
  onOpenReviewComposer: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  reviews,
  places,
  onVoteHelpful,
  onOpenReviewComposer,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Extract all unique tags
  const allTags = Array.from(
    new Set(reviews.flatMap((r) => r.tags || []))
  );

  const filteredReviews = reviews.filter((r) => {
    if (selectedTag === 'all') return true;
    return r.tags?.includes(selectedTag);
  });

  const getPlace = (placeId: string) => {
    return places.find((p) => p.id === placeId);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Community Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>Civic Voices & Experience Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Community Experiences & Photo Highlights
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real visitor perspectives, budget tips, accessibility insights, and atmospheric captures verified by local citizens.
          </p>
        </div>

        <button
          onClick={onOpenReviewComposer}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Your Experience</span>
        </button>
      </div>

      {/* Tag Filtering Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            selectedTag === 'all'
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Topics ({reviews.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedTag === tag
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Masonry-Style Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReviews.map((rev) => {
          const place = getPlace(rev.placeId);
          return (
            <div
              key={rev.id}
              className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Author Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-white/15"
                    />
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{rev.userName}</span>
                        {rev.verifiedVisit && (
                          <span title="Verified Visit">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{place ? place.name : 'Local Discovery'}</span>
                        <span>·</span>
                        <span>{rev.visitDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-300 font-bold text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Photo Gallery */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {rev.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt="Experience photo"
                        className="w-full h-48 sm:h-56 rounded-2xl object-cover border border-white/10 shadow-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer info: tags & helpful vote */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-cyan-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onVoteHelpful(rev.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
