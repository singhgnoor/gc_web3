// GC | IIT Ropar - Core TypeScript Interfaces
// Future-ready data model supporting blockchain integration

export type GCStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Score {
  hostelId: string;
  points: number;
}

export interface Event {
  id: string;
  name: string;
  image: string;
  description: string;
  rules: string[];
  maxPoints: number;
  scores: Score[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface LegTheme {
  primary: string;
  secondary: string;
  gradient: string;
  glowColor: string;
}

export interface Leg {
  id: string;
  name: string;
  slug: 'sports' | 'tech' | 'cult';
  icon: string;
  theme: LegTheme;
  events: Event[];
}

export interface Hostel {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  logo?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  year: number;
  legId?: string;
  eventId?: string;
  caption?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  link?: string;
  type: 'result' | 'event' | 'notice';
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  legId?: string;
}

export interface GCYear {
  year: number;
  tagline: string;
  status: GCStatus;
  hostels: Hostel[];
  legs: Leg[];
  gallery: GalleryItem[];
  announcements: Announcement[];
  contacts: ContactPerson[];
}

// Computed types for scoreboard calculations
export interface HostelScore {
  hostel: Hostel;
  totalScore: number;
  legScores: {
    legId: string;
    legName: string;
    score: number;
  }[];
  rank: number;
}

export interface LeaderboardData {
  year: number;
  standings: HostelScore[];
  lastUpdated: string;
}
