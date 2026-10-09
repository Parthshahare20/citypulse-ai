import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Compass,
  Navigation,
  Eye,
  EyeOff,
  Star,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { Place, CitizenReport, CityInfo, RouteOption } from '../types';

interface MapViewProps {
  city: CityInfo;
  places: Place[];
  reports: CitizenReport[];
  routeOptions: RouteOption[];
  onSelectPlace: (place: Place) => void;
  onOpenReportDetails?: (report: CitizenReport) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  city,
  places,
  reports,
  routeOptions,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const reportsLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Layer toggles
  const [showPlaces, setShowPlaces] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [selectedRouteType, setSelectedRouteType] = useState<'none' | 'fastest' | 'safer_hazard_aware'>('safer_hazard_aware');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [showApiInfo, setShowApiInfo] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: city.center,
        zoom: city.zoom,
        zoomControl: false,
      });

      // Add Zoom Control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add CartoDB Dark Matter Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      reportsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(city.center, city.zoom);
    }

    return () => {
      // Keep map between small renders or re-center
    };
  }, [city]);

  // Update Markers when places, reports or visibility toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers
    if (markersLayerRef.current) markersLayerRef.current.clearLayers();
    if (reportsLayerRef.current) reportsLayerRef.current.clearLayers();

    // 1. Add Places Markers
    if (showPlaces && markersLayerRef.current) {
      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;
        const categoryIcon =
          place.category === 'temple'
            ? '🛕'
            : place.category === 'mall'
            ? '🛍️'
            : place.category === 'heritage'
            ? '🏰'
            : place.category === 'dining'
            ? '🍛'
            : place.category === 'cafe'
            ? '☕'
            : place.category === 'nature'
            ? '🌿'
            : place.category === 'entertainment'
            ? '🏟️'
            : place.category === 'museum'
            ? '🏛️'
            : '★';

        const iconHtml = `
          <div style="
            background: ${isSelected ? '#F59E0B' : 'rgba(28, 30, 40, 0.95)'};
            color: ${isSelected ? '#08090C' : '#F59E0B'};
            width: ${isSelected ? '36px' : '32px'};
            height: ${isSelected ? '36px' : '32px'};
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 2px solid ${isSelected ? '#FFFFFF' : 'rgba(245, 158, 11, 0.4)'};
            box-shadow: 0 6px 18px rgba(0,0,0,0.6);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${categoryIcon}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-place-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(place.coordinates, { icon: customIcon });
        marker.on('click', () => {
          setSelectedPlace(place);
          setSelectedReport(null);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Add Citizen Hazard Reports Markers
    if (showHazards && reportsLayerRef.current) {
      reports.forEach((report) => {
        const isCritical = report.severity === 'critical' || report.severity === 'high';
        const bg = isCritical ? '#EF4444' : '#F59E0B';
        const iconHtml = `
          <div style="
            background: ${bg};
            color: #FFFFFF;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 0 12px ${bg};
            cursor: pointer;
            font-weight: bold;
          ">
            !
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-hazard-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(report.coordinates, { icon: customIcon });
        marker.on('click', () => {
          setSelectedReport(report);
          setSelectedPlace(null);
        });

        reportsLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Draw Route Polyline if selected
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (selectedRouteType !== 'none') {
      const activeRoute = routeOptions.find((r) => r.type === selectedRouteType);
      if (activeRoute && activeRoute.pathCoordinates.length > 0) {
        const color = selectedRouteType === 'safer_hazard_aware' ? '#10B981' : '#F59E0B';
        const polyline = L.polyline(activeRoute.pathCoordinates, {
          color: color,
          weight: 5,
          opacity: 0.85,
          dashArray: selectedRouteType === 'fastest' ? '6, 8' : undefined,
        }).addTo(map);

        routeLayerRef.current = polyline;
      }
    }
  }, [places, reports, showPlaces, showHazards, selectedRouteType, selectedPlace, routeOptions]);

  // Handle re-centering
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(city.center, city.zoom);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden glass-panel border border-white/10">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Layer Controls */}
      <div className="absolute top-4 left-4 z-10 glass-panel rounded-2xl p-3 border border-white/10 shadow-xl space-y-2 max-w-xs text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
          <Layers className="w-4 h-4" />
          <span>Spatial Map Layers</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span>Places & Landmarks</span>
          </span>
          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`p-1 rounded-lg ${showPlaces ? 'text-cyan-300' : 'text-slate-500'}`}
            aria-label="Toggle places"
          >
            {showPlaces ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Civic Hazard Radar</span>
          </span>
          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`p-1 rounded-lg ${showHazards ? 'text-amber-300' : 'text-slate-500'}`}
            aria-label="Toggle hazards"
          >
            {showHazards ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Routing Overlay</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => setSelectedRouteType(selectedRouteType === 'safer_hazard_aware' ? 'none' : 'safer_hazard_aware')}
              className={`p-1.5 rounded-lg border text-left transition-colors ${
                selectedRouteType === 'safer_hazard_aware'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-black/40 text-slate-400 border-white/5'
              }`}
            >
              Safe Corridor
            </button>
            <button
              onClick={() => setSelectedRouteType(selectedRouteType === 'fastest' ? 'none' : 'fastest')}
              className={`p-1.5 rounded-lg border text-left transition-colors ${
                selectedRouteType === 'fastest'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-black/40 text-slate-400 border-white/5'
              }`}
            >
              Direct Transit
            </button>
          </div>
        </div>
      </div>

      {/* Recenter & Map Controls on Bottom Right */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col items-end gap-2">
        <button
          onClick={() => setShowApiInfo(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel bg-[#12141c]/90 hover:bg-[#1a1c27] text-slate-300 hover:text-white border border-white/10 shadow-xl transition-all text-xs"
          title="Map API Status & Free Store Links"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-300">Free Map · No Key Needed</span>
          <Info className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>

        <button
          onClick={handleRecenter}
          className="p-3 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 shadow-xl transition-colors"
          title="Recenter Map on City"
          aria-label="Recenter Map"
        >
          <Compass className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Map API Key & Free API Store Modal */}
      {showApiInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg glass-panel bg-[#161822] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Map API Status: 100% Free
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Leaflet + CARTO / OpenStreetMap Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiInfo(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed space-y-1">
              <p className="font-semibold text-emerald-300">
                Do you need an API key for this map?
              </p>
              <p className="text-slate-300">
                <strong className="text-white">No API key is required!</strong> Your map runs on an open-source raster and vector tile stack (OpenStreetMap contributors & CARTO Voyager). It works right now with unlimited free panning, zooming, place markers, and hazard routing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Official Free API Stores & Developer Consoles
              </div>

              <div className="space-y-2 text-xs">
                {/* Google Maps Platform */}
                <a
                  href="https://console.cloud.google.com/google/maps-apis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Google Maps Platform</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">$200 Free/Mo</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Official console for Google Maps JavaScript API, Places & Directions
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>

                {/* Google Cloud API Store */}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Google Cloud API Credentials Store</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Free Tier</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Create, restrict, and retrieve free developer API keys
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>

                {/* Google AI Studio */}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Google AI Studio (Gemini API)</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Free Key</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Powers the CityPulse AI Copilot for Pune, Talegaon & global cities
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>

                {/* Mapbox */}
                <a
                  href="https://account.mapbox.com/auth/signup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Mapbox Free Developer Account</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">50k Loads Free</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Vector tile & navigation APIs free tier
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowApiInfo(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                Close & Return to Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selected Place Preview Card */}
      {selectedPlace && (
        <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-20 glass-panel rounded-3xl p-4 border border-white/15 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-start gap-4">
            <img
              src={selectedPlace.photos[0]}
              alt={selectedPlace.name}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-300">
                  {selectedPlace.categoryLabel}
                </span>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-sm font-bold font-display text-white truncate">
                {selectedPlace.name}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {selectedPlace.tagline}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{selectedPlace.rating}</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {selectedPlace.estimatedCost}
                </span>
                <button
                  onClick={() => onSelectPlace(selectedPlace)}
                  className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selected Hazard Report Card */}
      {selectedReport && (
        <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-20 glass-panel rounded-3xl p-4 border border-amber-500/30 shadow-2xl animate-in slide-in-from-bottom-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{selectedReport.categoryLabel}</span>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-bold text-white">{selectedReport.title}</h4>
          <p className="text-xs text-slate-300">{selectedReport.description}</p>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
            <span>{selectedReport.locationName}</span>
            <span className="text-amber-300 font-mono">
              Corroborated by {selectedReport.confirmationsCount} citizens
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
