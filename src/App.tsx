import React, { useState, useEffect } from 'react';
import {
  CityInfo,
  CityId,
  Place,
  CitizenReport,
  PlaceReview,
  RouteOption,
  NeighborhoodComparison,
  HeritageArticle,
  ReportStatus,
} from './types';
import { CITIES as FALLBACK_CITIES, INITIAL_PLACES } from './data/seedData';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ExploreView } from './components/ExploreView';
import { MapView } from './components/MapView';
import { SafetyView } from './components/SafetyView';
import { CommunityView } from './components/CommunityView';
import { CitizenReportsView } from './components/CitizenReportsView';
import { CompareView } from './components/CompareView';
import { HistoryView } from './components/HistoryView';
import { CopilotView } from './components/CopilotView';
import { SavedTripsView } from './components/SavedTripsView';
import { AdminView } from './components/AdminView';
import { InfographicsView } from './components/InfographicsView';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { ResearchModal } from './components/ResearchModal';
import { Sparkles, X } from 'lucide-react';

export default function App() {
  const [cities, setCities] = useState<CityInfo[]>(FALLBACK_CITIES);
  const [selectedCityId, setSelectedCityId] = useState<CityId>('pune');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [highContrast, setHighContrast] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false);

  // Core Data Stores
  const [places, setPlaces] = useState<Place[]>(() =>
    INITIAL_PLACES.filter((p) => p.cityId === 'pune')
  );
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [reviews, setReviews] = useState<PlaceReview[]>([]);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodComparison[]>([]);
  const [articles, setArticles] = useState<HeritageArticle[]>([]);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  // Selected Place Modal State
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<Place | null>(null);

  const currentCity = cities.find((c) => c.id === selectedCityId) || cities[0];

  // Fetch Cities on mount
  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cities) setCities(data.cities);
      })
      .catch((err) => console.warn('Could not fetch cities, using local:', err));
  }, []);

  // Fetch Places, Reports, Routes, Neighborhoods, Heritage, Saved for active city
  useEffect(() => {
    // 1. Places
    fetch(`/api/places?cityId=${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.places) setPlaces(data.places);
      })
      .catch((err) => console.warn('Error fetching places:', err));

    // 2. Reports
    fetch(`/api/reports?cityId=${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reports) setReports(data.reports);
      })
      .catch((err) => console.warn('Error fetching reports:', err));

    // 3. Routes
    fetch(`/api/routes/compare?cityId=${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.options) setRouteOptions(data.options);
      })
      .catch((err) => console.warn('Error fetching routes:', err));

    // 4. Neighborhoods
    fetch(`/api/neighborhoods?cityId=${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.neighborhoods) setNeighborhoods(data.neighborhoods);
      })
      .catch((err) => console.warn('Error fetching neighborhoods:', err));

    // 5. Heritage
    fetch(`/api/heritage?cityId=${selectedCityId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles) setArticles(data.articles);
      })
      .catch((err) => console.warn('Error fetching heritage:', err));
  }, [selectedCityId]);

  // Fetch Saved places & reviews
  useEffect(() => {
    fetch('/api/saved')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedPlaceIds(data.savedPlaceIds || []);
          setTrips(data.trips || []);
        }
      })
      .catch((err) => console.warn('Error fetching saved:', err));

    // Fetch initial reviews by inspecting first place or general seed
    fetch('/api/places/sf-palace-fine-arts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews) setReviews(data.reviews);
      })
      .catch((err) => console.warn('Error fetching reviews:', err));
  }, []);

  // Handlers
  const handleToggleSave = async (placeId: string) => {
    try {
      const res = await fetch('/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedPlaceIds(data.savedPlaceIds);
      }
    } catch (err) {
      console.warn('Error toggling save:', err);
      // Local fallback
      setSavedPlaceIds((prev) =>
        prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
      );
    }
  };

  const handleAddReview = async (placeId: string, reviewData: any) => {
    try {
      const res = await fetch(`/api/places/${placeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        // Update place rating in list
        setPlaces((prev) =>
          prev.map((p) =>
            p.id === placeId
              ? { ...p, rating: data.updatedRating, reviewCount: p.reviewCount + 1 }
              : p
          )
        );
      }
    } catch (err) {
      console.warn('Error adding review:', err);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r
          )
        );
      }
    } catch (err) {
      console.warn('Error voting review:', err);
    }
  };

  const handleSubmitReport = async (reportData: any) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => [data.report, ...prev]);
      }
    } catch (err) {
      console.warn('Error submitting report:', err);
    }
  };

  const handleCorroborate = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/confirm`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  confirmationsCount: data.confirmationsCount,
                  status: data.status,
                  confirmedByUser: true,
                }
              : r
          )
        );
      }
    } catch (err) {
      console.warn('Error corroborating report:', err);
    }
  };

  const handleCreateTrip = async (tripData: any) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      const data = await res.json();
      if (data.success) {
        setTrips((prev) => [...prev, data.trip]);
      }
    } catch (err) {
      console.warn('Error creating trip:', err);
    }
  };

  const handleUpdateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus,
    note?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? data.report : r))
        );
      }
    } catch (err) {
      console.warn('Error updating report status:', err);
    }
  };

  const handleGlobalSearch = (query: string) => {
    // If user asked a full question, open Copilot with query!
    if (query.includes('how') || query.includes('what') || query.includes('where') || query.includes('can i')) {
      setActiveTab('copilot');
    } else {
      setActiveTab('explore');
    }
  };

  return (
    <div className={`min-h-screen bg-transparent text-slate-100 relative overflow-x-hidden ${highContrast ? 'high-contrast' : ''}`}>
      {/* Dynamic Spatial Mesh & Ambient Glowing Nebulae */}
      <div className="fixed inset-0 pointer-events-none bg-spatial-mesh z-0 opacity-40" aria-hidden="true" />
      <div className="fixed -top-32 -left-32 w-[650px] h-[650px] bg-amber-500/12 rounded-full blur-[170px] pointer-events-none z-0" aria-hidden="true" />
      <div className="fixed top-1/4 -right-32 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[180px] pointer-events-none z-0" aria-hidden="true" />
      <div className="fixed -bottom-40 left-1/4 w-[600px] h-[600px] bg-amber-400/8 rounded-full blur-[160px] pointer-events-none z-0" aria-hidden="true" />

      {/* Top Glass Navigation */}
      <Navbar
        cities={cities}
        selectedCity={currentCity}
        onSelectCity={(id) => setSelectedCityId(id)}
        onSearch={handleGlobalSearch}
        savedCount={savedPlaceIds.length}
        onOpenSaved={() => setActiveTab('saved')}
        onOpenCopilot={() => setActiveTab('copilot')}
        onOpenResearch={() => setShowResearchModal(true)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
      />

      {/* Main Layout Area */}
      <div className="flex">
        {/* Left Navigation Rail */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          reportsCount={reports.filter((r) => r.status !== 'resolved').length}
        />

        {/* Primary Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {activeTab === 'explore' && (
            <ExploreView
              places={places}
              city={currentCity}
              savedPlaceIds={savedPlaceIds}
              onToggleSave={handleToggleSave}
              onSelectPlace={(place) => setSelectedPlaceForModal(place)}
              onOpenMap={() => setActiveTab('map')}
              onOpenCopilot={() => setActiveTab('copilot')}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              city={currentCity}
              places={places}
              reports={reports}
              routeOptions={routeOptions}
              onSelectPlace={(place) => setSelectedPlaceForModal(place)}
            />
          )}

          {activeTab === 'infographics' && (
            <InfographicsView
              city={currentCity}
              onOpenCopilot={() => setActiveTab('copilot')}
            />
          )}

          {activeTab === 'safety' && (
            <SafetyView
              city={currentCity}
              reports={reports}
              routeOptions={routeOptions}
              onCorroborate={handleCorroborate}
              onOpenReportModal={() => setActiveTab('reports')}
              onOpenMapWithRoute={(type) => setActiveTab('map')}
            />
          )}

          {activeTab === 'community' && (
            <CommunityView
              reviews={reviews}
              places={places}
              onVoteHelpful={handleVoteHelpful}
              onOpenReviewComposer={() => {
                if (places[0]) setSelectedPlaceForModal(places[0]);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <CitizenReportsView
              city={currentCity}
              reports={reports}
              onSubmitReport={handleSubmitReport}
              onCorroborate={handleCorroborate}
            />
          )}

          {activeTab === 'compare' && (
            <CompareView
              city={currentCity}
              neighborhoods={neighborhoods}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              city={currentCity}
              articles={articles}
              places={places}
              onSelectPlace={(place) => setSelectedPlaceForModal(place)}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotView
              city={currentCity}
              onSelectPlace={(place) => setSelectedPlaceForModal(place)}
              savedPlaceIds={savedPlaceIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {activeTab === 'saved' && (
            <SavedTripsView
              savedPlaces={places.filter((p) => savedPlaceIds.includes(p.id))}
              trips={trips}
              allPlaces={places}
              onToggleSave={handleToggleSave}
              onSelectPlace={(place) => setSelectedPlaceForModal(place)}
              onCreateTrip={handleCreateTrip}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              reports={reports}
              onUpdateReportStatus={handleUpdateReportStatus}
            />
          )}
        </main>
      </div>

      {/* Floating Spatial Copilot Action Button on mobile */}
      {activeTab !== 'copilot' && (
        <button
          onClick={() => setShowCopilotDrawer(true)}
          className="lg:hidden fixed bottom-18 right-4 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-2xl shadow-cyan-500/30 flex items-center justify-center transform hover:scale-105 transition-transform"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {/* Floating Copilot Drawer for Mobile / Quick Invoke */}
      {showCopilotDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full sm:max-w-2xl h-[85vh] rounded-t-3xl sm:rounded-3xl relative overflow-hidden">
            <button
              onClick={() => setShowCopilotDrawer(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <CopilotView
              city={currentCity}
              onSelectPlace={(place) => {
                setShowCopilotDrawer(false);
                setSelectedPlaceForModal(place);
              }}
              savedPlaceIds={savedPlaceIds}
              onToggleSave={handleToggleSave}
            />
          </div>
        </div>
      )}

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlaceForModal}
        onClose={() => setSelectedPlaceForModal(null)}
        isSaved={selectedPlaceForModal ? savedPlaceIds.includes(selectedPlaceForModal.id) : false}
        onToggleSave={handleToggleSave}
        onAddReview={handleAddReview}
        onVoteHelpful={handleVoteHelpful}
        reviews={
          selectedPlaceForModal
            ? reviews.filter((r) => r.placeId === selectedPlaceForModal.id)
            : []
        }
        nearbyHazards={
          selectedPlaceForModal
            ? reports.filter(
                (r) =>
                  r.cityId === selectedPlaceForModal.cityId &&
                  Math.abs(r.coordinates[0] - selectedPlaceForModal.coordinates[0]) < 0.03 &&
                  Math.abs(r.coordinates[1] - selectedPlaceForModal.coordinates[1]) < 0.03
              )
            : []
        }
      />

      {/* Research Foundations & Standards Modal */}
      <ResearchModal
        isOpen={showResearchModal}
        onClose={() => setShowResearchModal(false)}
      />
    </div>
  );
}
