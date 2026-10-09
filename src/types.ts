export type CityId = 'pune' | 'talegaon' | 'sf' | 'mumbai' | 'tokyo' | 'london';

export interface InfographicStat {
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  badge?: string;
}

export interface InfographicCategory {
  id: string;
  title: string;
  description: string;
  metrics: InfographicStat[];
  insights: string[];
}

export interface CityInfo {
  id: CityId;
  name: string;
  country: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  tagline: string;
  currency: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    airQualityIndex: number;
    airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy';
  };
}

export type PlaceCategory =
  | 'dining'
  | 'cafe'
  | 'heritage'
  | 'temple'
  | 'mall'
  | 'museum'
  | 'nature'
  | 'shopping'
  | 'public_service'
  | 'entertainment'
  | 'hidden_gem';

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  brailleSignage?: boolean;
  stepFreeAccess: boolean;
  accessibleRestrooms: boolean;
  audioGuideAvailable?: boolean;
  sensoryFriendlyHours?: boolean;
  serviceAnimalAllowed: boolean;
}

export interface PlaceReview {
  id: string;
  placeId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  categoryRatings?: {
    atmosphere?: number;
    value?: number;
    service?: number;
    accessibility?: number;
  };
  comment: string;
  visitDate: string;
  tags: string[];
  photos: string[];
  helpfulCount: number;
  isDemo?: boolean;
  verifiedVisit?: boolean;
  createdAt: string;
}

export interface Place {
  id: string;
  cityId: CityId;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  historicalContext?: string;
  address: string;
  neighborhood: string;
  coordinates: [number, number]; // [lat, lng]
  rating: number; // 0 - 5.0
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
  estimatedCost: string;
  openingHours: string;
  isOpenNow: boolean;
  photos: string[];
  accessibility: AccessibilityFeatures;
  amenities: string[];
  tags: string[];
  dataSource: string;
  lastUpdated: string;
  verified: boolean;
  isDemo?: boolean;
}

export type ReportCategory =
  | 'pothole'
  | 'flooding'
  | 'damaged_road'
  | 'broken_streetlight'
  | 'sidewalk_blocked'
  | 'waste_overflow'
  | 'transit_delay'
  | 'infrastructure';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'corroborated'
  | 'verified'
  | 'forwarded'
  | 'resolved';

export interface CitizenReport {
  id: string;
  cityId: CityId;
  category: ReportCategory;
  categoryLabel: string;
  title: string;
  description: string;
  locationName: string;
  coordinates: [number, number];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  status: ReportStatus;
  statusHistory: {
    status: ReportStatus;
    timestamp: string;
    note?: string;
  }[];
  confirmationsCount: number;
  confirmedByUser?: boolean;
  photoUrl?: string;
  submittedAt: string;
  reportedBy: string;
  isAnonymous: boolean;
  isDemo?: boolean;
}

export interface RouteOption {
  id: string;
  title: string;
  type: 'fastest' | 'safer_hazard_aware' | 'accessible_scenic';
  distanceKm: number;
  durationMin: number;
  hazardScore: number; // 0 (safest) - 100 (highest penalty)
  accessibilityScore: number; // 0 - 100
  totalScore: number;
  pathCoordinates: [number, number][];
  hazardsAvoided: number;
  explanation: string;
  transitModes: ('walk' | 'metro' | 'bus' | 'bike')[];
}

export interface NeighborhoodComparison {
  id: string;
  cityId: CityId;
  name: string;
  overview: string;
  affordabilityScore: number; // 0 - 100
  ratingScore: number; // 0 - 100
  accessibilityScore: number; // 0 - 100
  transitScore: number; // 0 - 100
  cleanlinessScore: number; // 0 - 100
  safetyScore: number; // 0 - 100
  activeHazardsCount: number;
  averageMealCost: string;
  notableAttractions: string[];
}

export interface HeritageArticle {
  id: string;
  cityId: CityId;
  title: string;
  subtitle: string;
  centuryPeriod: string;
  heroPhoto: string;
  content: string;
  keyMilestones: {
    year: string;
    event: string;
  }[];
  associatedPlaceIds: string[];
  sourceCitations: {
    title: string;
    url?: string;
    sourceType: 'archive' | 'monument_registry' | 'encyclopedia';
  }[];
  walkingTourTimeMin?: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  relevantPlaces?: Place[];
  citations?: {
    title: string;
    detail: string;
  }[];
  suggestedFollowUps?: string[];
  toolUsed?: string;
}

export interface UserSavedData {
  savedPlaceIds: string[];
  trips: {
    id: string;
    title: string;
    date: string;
    cityId: CityId;
    placeIds: string[];
    notes?: string;
  }[];
}
