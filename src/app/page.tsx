'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GCYear, LeaderboardData, HostelScore } from '@/types';
import { Leaderboard, AnnouncementCard } from '@/components/ui';
import { Footer } from '@/components/layout';

export default function HomePage() {
  const [gcData, setGcData] = useState<GCYear | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch index to get current year
        const indexRes = await fetch('/api/admin/gc');
        const index = await indexRes.json();

        if (index.currentYear) {
          // Fetch current year data
          const dataRes = await fetch(`/api/admin/gc?year=${index.currentYear}`);
          const data = await dataRes.json();
          setGcData(data);

          // Calculate leaderboard from data
          const standings = calculateLeaderboard(data);
          setLeaderboard({
            year: data.year,
            standings,
            lastUpdated: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Failed to load data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !gcData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cult border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-secondary" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sports/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-tech/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cult/20 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Year Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-border mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-foreground-muted">GC {gcData.year} · {gcData.status}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6"
          >
            <span className="bg-gradient-to-r from-sports via-tech to-cult bg-clip-text text-transparent">
              General
            </span>
            <br />
            Championship
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-foreground-muted mb-8 font-light"
          >
            {gcData.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/scoreboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-sports via-tech to-cult text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-cult/20"
            >
              View Scoreboard
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-background-secondary transition-colors"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-foreground-subtle flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-2.5 rounded-full bg-foreground-subtle" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legs Overview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Legs. One Champion.
            </h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Compete across sports, technology, and culture to claim the ultimate glory.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {gcData.legs.map((leg, index) => (
              <motion.div
                key={leg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/leg/${leg.slug}`}>
                  <div
                    className="group relative p-8 rounded-2xl border transition-all duration-300 bg-background-secondary hover:bg-background-tertiary"
                    style={{ borderColor: `${leg.theme.primary}30` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${leg.theme.primary}20` }}
                    >
                      <LegIcon type={leg.slug} style={{ color: leg.theme.primary }} className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                      {leg.name}
                    </h3>
                    <p className="text-foreground-muted mb-4">
                      {leg.events.length} Events
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: leg.theme.primary }}>
                      <span>Explore Events</span>
                      <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Standings */}
      {leaderboard && (
        <section className="py-20 px-6 bg-background-secondary/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Current Standings
              </h2>
              <p className="text-foreground-muted">
                The race for glory intensifies. Who will rise to the top?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Leaderboard standings={leaderboard.standings} showLegBreakdown />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Link
                href="/scoreboard"
                className="inline-flex items-center gap-2 text-cult hover:text-cult/80 font-medium transition-colors"
              >
                View Full Scoreboard
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Announcements */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest Updates
            </h2>
            <p className="text-foreground-muted">
              Stay informed with the latest GC news and results.
            </p>
          </motion.div>

          <div className="space-y-4">
            {gcData.announcements.slice(0, 4).map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Calculate leaderboard from GC data
function calculateLeaderboard(data: GCYear): HostelScore[] {
  const hostelScores: HostelScore[] = data.hostels.map(hostel => {
    let totalScore = 0;
    const legScores = data.legs.map(leg => {
      let legScore = 0;
      for (const event of leg.events) {
        const score = event.scores.find(s => s.hostelId === hostel.id);
        if (score) legScore += score.points;
      }
      totalScore += legScore;
      return { legId: leg.id, legName: leg.name, score: legScore };
    });
    return { hostel, totalScore, legScores, rank: 0 };
  });

  hostelScores.sort((a, b) => b.totalScore - a.totalScore);
  hostelScores.forEach((s, i) => { s.rank = i + 1; });
  return hostelScores;
}

function LegIcon({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) {
  if (type === 'sports') {
    return (
      <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );
  }
  if (type === 'tech') {
    return (
      <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
      </svg>
    );
  }
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="15.5" r="2.5" /><path d="M8 17V5l12-2v12" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
    </svg>
  );
}
