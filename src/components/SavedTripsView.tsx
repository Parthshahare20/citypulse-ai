import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  MapPin,
  Trash2,
  PlusCircle,
  Clock,
  Send,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { Place, CityInfo } from '../types';

interface SavedTripsViewProps {
  savedPlaces: Place[];
  trips: {
    id: string;
    title: string;
    date: string;
    cityId: string;
    placeIds: string[];
    notes?: string;
  }[];
  allPlaces: Place[];
  onToggleSave: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onCreateTrip: (tripData: any) => Promise<void>;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedPlaces,
  trips,
  allPlaces,
  onToggleSave,
  onSelectPlace,
  onCreateTrip,
}) => {
  const [showTripModal, setShowTripModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedPlaceIds.length === 0) return;

    setSubmitting(true);
    try {
      await onCreateTrip({
        title,
        date,
        cityId: savedPlaces[0]?.cityId || 'sf',
        placeIds: selectedPlaceIds,
        notes,
      });

      setShowTripModal(false);
      setTitle('');
      setSelectedPlaceIds([]);
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTripPlace = (id: string) => {
    if (selectedPlaceIds.includes(id)) {
      setSelectedPlaceIds(selectedPlaceIds.filter((p) => p !== id));
    } else {
      setSelectedPlaceIds([...selectedPlaceIds, id]);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 spatial-radial flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection & Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Saved Places & Custom Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Organize bookmarks into multi-stop walking trips, transit-optimized schedules, and accessible day tours.
          </p>
        </div>

        <button
          onClick={() => setShowTripModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Plan New Itinerary</span>
        </button>
      </div>

      {/* Planned Trips Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white">
          Active Trip Itineraries ({trips.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trips.map((trip) => {
            const tripPlaces = allPlaces.filter((p) => trip.placeIds.includes(p.id));

            return (
              <div
                key={trip.id}
                className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-display text-white">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{trip.date}</span>
                    </div>
                  </div>

                  {trip.notes && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {trip.notes}
                    </p>
                  )}

                  {/* Stops list */}
                  <div className="mt-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      Planned Stops ({tripPlaces.length})
                    </div>
                    {tripPlaces.map((place, idx) => (
                      <div
                        key={place.id}
                        onClick={() => onSelectPlace(place)}
                        className="p-2.5 rounded-xl glass-surface-subtle border border-white/5 flex items-center justify-between cursor-pointer hover:border-cyan-400/30 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{place.name}</div>
                            <div className="text-[10px] text-slate-400">{place.neighborhood}</div>
                          </div>
                        </div>
                        <span className="text-cyan-400 font-semibold text-xs">→</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>~3.5 hrs estimated exploration</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Trip itinerary link copied!');
                    }}
                    className="flex items-center gap-1 text-cyan-300 hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Itinerary</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Places Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h2 className="text-lg font-bold font-display text-white">
          Bookmarked Places ({savedPlaces.length})
        </h2>

        {savedPlaces.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 text-slate-400 text-xs">
            No places bookmarked yet. Browse the Explore directory or Map to bookmark your favorites!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="glass-card rounded-3xl p-5 border border-white/10 cursor-pointer space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={place.photos[0]}
                    alt={place.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-cyan-300">
                      {place.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold font-display text-white truncate">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{place.neighborhood}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(place.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-300">{place.estimatedCost}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 text-slate-100 relative border border-white/15 shadow-2xl">
            <h2 className="text-xl font-bold font-display text-white mb-1">
              Create New City Itinerary
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Select your favorite stops to compute an accessible walking and transit route
            </p>

            <form onSubmit={handleTripSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Trip Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Afternoon Architecture & Bakery Walk"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Select Stops from Bookmarks ({selectedPlaceIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-2xl glass-surface-subtle border border-white/5">
                  {savedPlaces.map((p) => {
                    const isSelected = selectedPlaceIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleTripPlace(p.id)}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.neighborhood}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Trip Notes & Focus</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Morning pastry, afternoon museum visit, sunset overlook..."
                  className="w-full p-2.5 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedPlaceIds.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Itinerary</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
