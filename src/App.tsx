import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchLiveSheetData,
  type PlayerRecord,
  type MatchRecord
} from './services/sheets';
import { Navbar } from './components/Navbar';
import { HeroPodium } from './components/HeroPodium';
import { ChartSection } from './components/ChartSection';
import { LeaderboardTable } from './components/LeaderboardTable';
import { RecentMatches } from './components/RecentMatches';
import { PlayerModal } from './components/PlayerModal';
import { Footer } from './components/Footer';

export default function App() {
  // Pure live state with zero hardcoded/placeholder arrays
  const [leaderboard, setLeaderboard] = useState<PlayerRecord[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [totalBattles, setTotalBattles] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRecord | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Dynamic fetch directly from the Google Sheet CSV export endpoints
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await fetchLiveSheetData();
      setLeaderboard(result.leaderboard);
      setMatches(result.matches);
      setTotalBattles(result.totalBattles);
      setLastUpdated(new Date());

      if (result.error && result.leaderboard.length === 0) {
        setFetchError(result.error);
      }
    } catch (err: any) {
      console.error('Failed to load live sheet data:', err);
      setFetchError(err.message || 'Error communicating with Google Sheets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-[#00f0ff] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onRefresh={loadData}
        isLoading={isLoading}
        dataSource="live-csv"
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero & Champions Podium Section */}
        <HeroPodium
          topPlayers={leaderboard.slice(0, 3)}
          totalMatches={totalBattles}
          totalPlayers={leaderboard.length}
          dataSource="live-csv"
          onPlayerClick={(player) => setSelectedPlayer(player)}
        />

        {/* Notice if sheet data is loading or awaiting public permissions */}
        {fetchError && leaderboard.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="p-4 rounded-xl bg-[#0e172e] border border-cyan-500/30 text-xs sm:text-sm font-rajdhani text-cyan-200 flex items-center justify-between">
              <span>{fetchError}</span>
              <button
                onClick={loadData}
                className="px-3 py-1 rounded bg-[#00f0ff] text-slate-950 font-bold hover:bg-cyan-300 transition-colors"
              >
                Retry Fetch
              </button>
            </div>
          </div>
        )}

        {/* 2. Chart.js Analytics Section */}
        {leaderboard.length > 0 && <ChartSection players={leaderboard} />}

        {/* 3. Calculated Leaderboard Table */}
        <LeaderboardTable
          players={leaderboard}
          onSelectPlayer={(player) => setSelectedPlayer(player)}
        />

        {/* 4. Raw Submissions Recent Matches Grid (strictly limited to 5) */}
        <RecentMatches matches={matches} />
      </main>

      {/* Player Detail Dossier Modal */}
      <PlayerModal
        player={selectedPlayer}
        allMatches={matches}
        onClose={() => setSelectedPlayer(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
