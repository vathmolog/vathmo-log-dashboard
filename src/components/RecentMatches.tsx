import React from 'react';
import { type MatchRecord, DEFAULT_MATCH_THUMBNAIL_URL } from '../services/sheets';
import { Play, ExternalLink, Calendar, Trophy } from 'lucide-react';

interface RecentMatchesProps {
  matches: MatchRecord[];
}

export const RecentMatches: React.FC<RecentMatchesProps> = ({ matches }) => {
  // Strictly enforce 3 most recent matches without any category filtering UI
  const recentThree = matches.slice(0, 3);

  return (
    <section id="matches" className="relative py-12 bg-[#040814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (No 'raw submissions tab' text and no filter buttons) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
              Recent Battles <span className="text-[#00f0ff]">& Match Archive</span>
            </h2>
            <p className="font-rajdhani text-sm text-slate-400 mt-1">
              Latest competitive match streams and highlights.
            </p>
          </div>
        </div>

        {/* Recent Matches CSS Grid (3 most recent fetched video cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentThree.length > 0 ? (
            recentThree.map((match) => {
              const isTeamAWinner =
                match.winningTeam.toLowerCase().includes('team a') ||
                match.winningTeam.toLowerCase() === 'team 1' ||
                match.teamA.toLowerCase().includes(match.winningTeam.toLowerCase());

              const isTeamBWinner =
                match.winningTeam.toLowerCase().includes('team b') ||
                match.winningTeam.toLowerCase() === 'team 2' ||
                match.teamB.toLowerCase().includes(match.winningTeam.toLowerCase());

              return (
                <a
                  key={match.id}
                  href={match.facebookVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative cyber-panel rounded-xl overflow-hidden border border-[#00f0ff]/25 hover:border-[#00f0ff] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] flex flex-col justify-between cursor-pointer"
                >
                  {/* Card Thumbnail Area with Video Overlay - Clicking thumbnail opens video */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={match.thumbnailUrl || DEFAULT_MATCH_THUMBNAIL_URL}
                      alt={`${match.teamA} vs ${match.teamB}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_MATCH_THUMBNAIL_URL;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-black/40 to-black/20" />

                    {/* Facebook Video Play Overlay Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#00f0ff]/80 backdrop-blur-sm text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)] group-hover:scale-110 group-hover:bg-[#00f0ff] transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Game Mode Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#070e24]/90 border border-cyan-400/40 text-[#00f0ff] font-rajdhani text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {match.gameMode}
                    </div>

                    {/* Facebook Link Indicator */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#1877F2]/80 text-white font-rajdhani text-[11px] font-bold flex items-center gap-1 backdrop-blur-md">
                      <span>FB Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>

                    {/* Timestamp */}
                    <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[11px] font-rajdhani text-slate-300 font-medium drop-shadow">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{match.timestamp}</span>
                    </div>
                  </div>

                  {/* Card Body: Team A vs Team B details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Team A */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          isTeamAWinner
                            ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                            : 'bg-[#091124] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-rajdhani font-semibold">
                          <span className="text-slate-400 uppercase tracking-wider">TEAM ALPHA</span>
                          {isTeamAWinner && (
                            <span className="flex items-center gap-1 text-[#00f0ff] font-bold uppercase text-[10px] tracking-widest">
                              <Trophy className="w-3 h-3 text-amber-400 fill-current" />
                              VICTOR
                            </span>
                          )}
                        </div>
                        <div className="font-cinzel text-xs sm:text-sm font-bold text-white mt-1 line-clamp-2">
                          {match.teamA}
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="relative flex items-center justify-center my-1">
                        <div className="h-px bg-slate-800 w-full" />
                        <span className="absolute px-2 bg-[#0a1226] border border-cyan-500/30 text-[#00f0ff] font-orbitron text-[10px] font-black rounded">
                          VS
                        </span>
                      </div>

                      {/* Team B */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          isTeamBWinner
                            ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                            : 'bg-[#091124] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-rajdhani font-semibold">
                          <span className="text-slate-400 uppercase tracking-wider">TEAM BETA</span>
                          {isTeamBWinner && (
                            <span className="flex items-center gap-1 text-[#00f0ff] font-bold uppercase text-[10px] tracking-widest">
                              <Trophy className="w-3 h-3 text-amber-400 fill-current" />
                              VICTOR
                            </span>
                          )}
                        </div>
                        <div className="font-cinzel text-xs sm:text-sm font-bold text-white mt-1 line-clamp-2">
                          {match.teamB}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Watch Match CTA Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-[11px] font-rajdhani text-slate-400">
                        Winning Side: <span className="text-cyan-300 font-bold">{match.winningTeam}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-xs font-rajdhani font-bold text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-slate-950 transition-all duration-200 shadow-sm">
                        <Play className="w-3 h-3 fill-current" />
                        Watch Match
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 font-rajdhani cyber-panel rounded-xl">
              Connecting to live battle archive...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
