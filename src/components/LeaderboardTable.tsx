import React, { useState, useMemo } from 'react';
import { type PlayerRecord } from '../services/sheets';
import { Search, Trophy, Medal, ArrowUpDown, ChevronRight, Filter, ShieldCheck, Flame } from 'lucide-react';
import { GreekMeander } from './GreekMeander';

interface LeaderboardTableProps {
  players: PlayerRecord[];
  onSelectPlayer: (player: PlayerRecord) => void;
}

type SortField = 'wins' | 'winRate' | 'matchesPlayed' | 'rank';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  onSelectPlayer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'top10' | 'veterans'>('all');
  const [sortBy, setSortBy] = useState<SortField>('wins');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSortedPlayers = useMemo(() => {
    let list = [...players];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.playerName.toLowerCase().includes(q));
    }

    // Filter mode
    if (filterMode === 'top10') {
      list = list.slice(0, 10);
    } else if (filterMode === 'veterans') {
      list = list.filter((p) => p.matchesPlayed >= 15);
    }

    // Sort
    list.sort((a, b) => {
      let diff = 0;
      if (sortBy === 'wins') {
        diff = b.wins - a.wins;
        if (diff === 0) diff = b.winRate - a.winRate; // tie-breaker
      } else if (sortBy === 'winRate') {
        diff = b.winRate - a.winRate;
        if (diff === 0) diff = b.wins - a.wins;
      } else if (sortBy === 'matchesPlayed') {
        diff = b.matchesPlayed - a.matchesPlayed;
      } else if (sortBy === 'rank') {
        diff = a.rank - b.rank;
      }
      return sortAsc ? -diff : diff;
    });

    return list;
  }, [players, searchQuery, filterMode, sortBy, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="leaderboard" className="relative py-12 bg-[#040814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#00f0ff] font-rajdhani text-xs uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4" />
              Calculated Leaderboard Tab
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Grandmaster <span className="text-[#00f0ff]">Honor Roll</span>
            </h2>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search gladiator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0a1226] border border-[#00f0ff]/30 text-white placeholder-slate-400 text-xs sm:text-sm font-rajdhani focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-[#091124] p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded text-xs font-rajdhani font-semibold uppercase tracking-wider transition-all ${
                  filterMode === 'all'
                    ? 'bg-[#00f0ff] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('top10')}
                className={`px-3 py-1 rounded text-xs font-rajdhani font-semibold uppercase tracking-wider transition-all ${
                  filterMode === 'top10'
                    ? 'bg-[#00f0ff] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Top 10
              </button>
              <button
                onClick={() => setFilterMode('veterans')}
                className={`px-3 py-1 rounded text-xs font-rajdhani font-semibold uppercase tracking-wider transition-all ${
                  filterMode === 'veterans'
                    ? 'bg-[#00f0ff] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                15+ Battles
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Dark-Mode CSS Grid Table */}
        <div className="cyber-panel rounded-xl overflow-hidden border border-[#00f0ff]/30 shadow-2xl">
          {/* Decorative mini meander */}
          <GreekMeander color="#00f0ff" height={6} />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#091124]/90 border-b border-[#00f0ff]/20 text-slate-400 font-rajdhani text-xs uppercase tracking-wider">
                  <th
                    onClick={() => handleSort('rank')}
                    className="py-4 px-4 sm:px-6 cursor-pointer hover:text-cyan-300 w-16"
                  >
                    <div className="flex items-center gap-1">
                      <span>Rank</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-4 sm:px-6">Player Name</th>
                  <th
                    onClick={() => handleSort('matchesPlayed')}
                    className="py-4 px-4 text-center cursor-pointer hover:text-cyan-300"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Matches</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('wins')}
                    className="py-4 px-4 text-center cursor-pointer hover:text-cyan-300"
                  >
                    <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold">
                      <span>Wins</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center">
                    <span>Losses</span>
                  </th>
                  <th
                    onClick={() => handleSort('winRate')}
                    className="py-4 px-4 sm:px-6 text-right cursor-pointer hover:text-cyan-300"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Win Rate (%)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-4 px-3 text-center w-12">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-rajdhani text-sm">
                {filteredAndSortedPlayers.length > 0 ? (
                  filteredAndSortedPlayers.map((player) => {
                    const isTop1 = player.rank === 1;
                    const isTop2 = player.rank === 2;
                    const isTop3 = player.rank === 3;

                    return (
                      <tr
                        key={player.playerName}
                        onClick={() => onSelectPlayer(player)}
                        className={`group transition-all duration-200 cursor-pointer ${
                          isTop1
                            ? 'bg-amber-500/5 hover:bg-amber-500/10'
                            : isTop2
                            ? 'bg-slate-400/5 hover:bg-slate-400/10'
                            : isTop3
                            ? 'bg-amber-800/5 hover:bg-amber-800/10'
                            : 'hover:bg-[#111c38]/60'
                        }`}
                      >
                        {/* Rank Badge */}
                        <td className="py-3.5 px-4 sm:px-6">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-black font-orbitron text-xs font-black shadow-[0_0_12px_rgba(212,175,55,0.7)]">
                              1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 text-black font-orbitron text-xs font-black shadow-[0_0_8px_rgba(148,163,184,0.5)]">
                              2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-700 text-white font-orbitron text-xs font-black shadow-[0_0_8px_rgba(180,83,9,0.5)]">
                              3
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-7 h-7 font-orbitron text-slate-400 font-bold">
                              #{player.rank}
                            </span>
                          )}
                        </td>

                        {/* Player Name & Crest */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0d162d] border border-cyan-500/30 flex items-center justify-center font-cinzel text-xs font-bold text-cyan-300 group-hover:border-cyan-400 transition-colors">
                              {player.playerName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-cinzel font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                                <span>{player.playerName}</span>
                                {isTop1 && (
                                  <Trophy className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-rajdhani">
                                Ratio: {player.wins}W - {player.losses}L
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Matches Played */}
                        <td className="py-3.5 px-4 text-center font-orbitron text-slate-300 font-semibold">
                          {player.matchesPlayed}
                        </td>

                        {/* Wins */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-orbitron font-bold">
                            {player.wins}
                          </span>
                        </td>

                        {/* Losses */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-400 font-orbitron font-semibold">
                            {player.losses}
                          </span>
                        </td>

                        {/* Win Rate (%) */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-orbitron font-bold text-white group-hover:text-cyan-300">
                              {player.winRate}%
                            </span>
                            <div className="w-24 bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-700">
                              <div
                                className={`h-full rounded-full ${
                                  player.winRate >= 75
                                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                                    : player.winRate >= 50
                                    ? 'bg-cyan-400'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, player.winRate)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Expand Arrow */}
                        <td className="py-3.5 px-3 text-center">
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-rajdhani">
                      No gladiators found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#070e20] border-t border-slate-800 flex items-center justify-between text-xs font-rajdhani text-slate-400">
            <span>
              Showing {filteredAndSortedPlayers.length} of {players.length} registered players
            </span>
            <span className="text-cyan-400/80">
              Ranked by Wins, Win Rate (%) as tie-breaker
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
