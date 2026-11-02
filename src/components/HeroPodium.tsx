import React from 'react';
import { type PlayerRecord } from '../services/sheets';
import { Crown, Trophy, Sparkles, Flame, Shield } from 'lucide-react';
import { GreekMeander } from './GreekMeander';

interface HeroPodiumProps {
  topPlayers: PlayerRecord[];
  totalMatches: number;
  totalPlayers: number;
  dataSource: 'live-api' | 'live-csv' | 'fallback';
  onPlayerClick?: (player: PlayerRecord) => void;
}

export const HeroPodium: React.FC<HeroPodiumProps> = ({
  topPlayers,
  totalMatches,
  totalPlayers,
  onPlayerClick
}) => {
  const first = topPlayers[0];
  const second = topPlayers[1];
  const third = topPlayers[2];

  return (
    <section id="podium" className="relative w-full overflow-hidden bg-[#040814] pt-4 pb-12">
      {/* Hero Banner Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 h-[650px] overflow-hidden pointer-events-none">
        <img
          src="https://i.imgur.com/tiba2zg.jpeg"
          alt="Vathmo Log Hero Banner"
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040814]/70 via-[#060b1a]/85 to-[#040814]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center pt-6 sm:pt-10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0c1630]/90 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-rajdhani text-xs uppercase tracking-widest text-cyan-300 font-semibold">
              Hellenic Cyber Arena • Season Alpha
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            The Pantheon <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-[#38bdf8] drop-shadow-[0_0_25px_rgba(0,240,255,0.7)]">of Champions</span>
          </h1>

          <p className="mt-2.5 max-w-2xl mx-auto font-rajdhani text-sm sm:text-base text-slate-300 font-medium tracking-wide">
            Dynamic tournament standings synchronized live from Google Sheets.
          </p>

          {/* Quick HUD Metrics */}
          <div className="mt-5 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm font-rajdhani">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0e1730]/80 border border-[#00f0ff]/25 backdrop-blur-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-slate-400">Total Combatants:</span>
              <span className="text-white font-bold font-orbitron">{totalPlayers}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0e1730]/80 border border-[#00f0ff]/25 backdrop-blur-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Total Battles:</span>
              <span className="text-white font-bold font-orbitron">{totalMatches}</span>
            </div>
          </div>
        </div>

        {/* Podium Container with Percentage-Anchored Overlays for Zero Overflow on Mobile */}
        <div className="mt-4 relative rounded-2xl overflow-hidden border border-[#00f0ff]/30 shadow-[0_0_35px_rgba(0,240,255,0.18)] bg-[#070e22]/90">
          <GreekMeander color="#00f0ff" height={8} />

          <div className="p-3 sm:p-6 md:p-8">
            <div className="podium-container">
              {/* Champions Podium Base Image */}
              <img
                src="https://i.imgur.com/cwk8I8D.jpeg"
                alt="Champions Podium"
                className="podium-image"
              />

              {/* Gradient vignette for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/70 via-transparent to-transparent pointer-events-none" />

              {/* #2 SILVER PEDESTAL OVERLAY (Left Pedestal) */}
              {second && (
                <div
                  onClick={() => onPlayerClick?.(second)}
                  className="podium-card-silver text-center cursor-pointer group"
                >
                  <div className="podium-box cyber-panel border border-slate-300/70 shadow-[0_0_20px_rgba(148,163,184,0.4)] group-hover:scale-105 group-hover:border-slate-200">
                    <div className="podium-badge inline-flex items-center gap-1 rounded-full bg-slate-800/90 border border-slate-300 text-slate-200 font-orbitron font-black uppercase shadow">
                      <Trophy className="w-3 h-3 text-slate-300 shrink-0" />
                      <span>#2 Silver</span>
                    </div>

                    <h3 className="podium-name font-cinzel font-bold text-white tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-cyan-300">
                      {second.playerName}
                    </h3>

                    <div className="podium-rate inline-block rounded bg-[#070e22]/90 border border-cyan-400/40 text-emerald-400 font-orbitron font-bold">
                      {second.winRate}% Win Rate
                    </div>

                    <div className="podium-sub font-rajdhani text-slate-300 font-semibold tracking-wider">
                      <span className="text-cyan-300 font-bold">{second.wins}</span> W / {second.matchesPlayed} M
                    </div>
                  </div>
                </div>
              )}

              {/* #1 GOLD PEDESTAL OVERLAY (Center / Tallest Pedestal) */}
              {first && (
                <div
                  onClick={() => onPlayerClick?.(first)}
                  className="podium-card-gold text-center cursor-pointer group"
                >
                  <div className="podium-box podium-box-gold cyber-panel-gold border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.7)] group-hover:scale-105 group-hover:border-yellow-300">
                    <div className="podium-badge inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d4af37] via-amber-300 to-[#d4af37] text-black font-orbitron font-black uppercase shadow-[0_0_12px_rgba(212,175,55,0.8)]">
                      <Crown className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>#1 Champion</span>
                    </div>

                    <h3 className="podium-name podium-name-gold font-cinzel font-black text-white tracking-wide truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] group-hover:text-amber-300">
                      {first.playerName}
                    </h3>

                    <div className="podium-rate podium-rate-gold inline-block rounded bg-[#091124]/95 border border-[#d4af37]/60 text-amber-300 font-orbitron font-black drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                      {first.winRate}% Win Rate
                    </div>

                    <div className="podium-sub font-rajdhani text-amber-100 font-semibold tracking-wider">
                      <span className="text-cyan-300 font-bold">{first.wins}</span> W / {first.matchesPlayed} M
                    </div>
                  </div>
                </div>
              )}

              {/* #3 BRONZE PEDESTAL OVERLAY (Right Pedestal) */}
              {third && (
                <div
                  onClick={() => onPlayerClick?.(third)}
                  className="podium-card-bronze text-center cursor-pointer group"
                >
                  <div className="podium-box cyber-panel border border-amber-700/70 shadow-[0_0_20px_rgba(180,83,9,0.4)] group-hover:scale-105 group-hover:border-amber-500">
                    <div className="podium-badge inline-flex items-center gap-1 rounded-full bg-[#1e130c]/90 border border-amber-600 text-amber-400 font-orbitron font-black uppercase shadow">
                      <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>#3 Bronze</span>
                    </div>

                    <h3 className="podium-name font-cinzel font-bold text-white tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-cyan-300">
                      {third.playerName}
                    </h3>

                    <div className="podium-rate inline-block rounded bg-[#070e22]/90 border border-amber-700/50 text-amber-400 font-orbitron font-bold">
                      {third.winRate}% Win Rate
                    </div>

                    <div className="podium-sub font-rajdhani text-slate-300 font-semibold tracking-wider">
                      <span className="text-cyan-300 font-bold">{third.wins}</span> W / {third.matchesPlayed} M
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <GreekMeander color="#00f0ff" height={8} />
        </div>
      </div>
    </section>
  );
};
