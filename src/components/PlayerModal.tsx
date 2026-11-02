import React from 'react';
import { type PlayerRecord, type MatchRecord, VIDEO_PLACEHOLDER_URL } from '../services/sheets';
import { X, Trophy, Swords, ExternalLink, Flame, Shield, Play } from 'lucide-react';
import { GreekMeander } from './GreekMeander';

interface PlayerModalProps {
  player: PlayerRecord | null;
  allMatches: MatchRecord[];
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  allMatches,
  onClose
}) => {
  if (!player) return null;

  // Filter matches involving this player
  const playerMatches = allMatches.filter(
    (m) =>
      m.teamA.toLowerCase().includes(player.playerName.toLowerCase()) ||
      m.teamB.toLowerCase().includes(player.playerName.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl cyber-panel rounded-2xl border border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Greek Meander top frame */}
        <GreekMeander color="#00f0ff" height={8} />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#081026] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={player.avatarUrl || 'https://i.imgur.com/pgCLemg.jpeg'}
              alt={player.playerName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://i.imgur.com/pgCLemg.jpeg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {player.playerName}
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-[#00f0ff] font-orbitron text-xs font-bold">
                  Rank #{player.rank}
                </span>
              </div>
              <p className="font-rajdhani text-xs text-slate-400 font-semibold tracking-wider uppercase">
                Combatant Dossier & Match Records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-[#00f0ff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Stats Bar */}
        <div className="p-5 bg-[#060c1d] border-b border-slate-800 grid grid-cols-4 gap-3 text-center">
          <div className="bg-[#0b142d] p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-rajdhani uppercase font-semibold">Victories</div>
            <div className="font-orbitron text-lg font-bold text-cyan-300">{player.wins}</div>
          </div>
          <div className="bg-[#0b142d] p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-rajdhani uppercase font-semibold">Defeats</div>
            <div className="font-orbitron text-lg font-bold text-rose-400">{player.losses}</div>
          </div>
          <div className="bg-[#0b142d] p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-rajdhani uppercase font-semibold">Battles</div>
            <div className="font-orbitron text-lg font-bold text-slate-200">{player.matchesPlayed}</div>
          </div>
          <div className="bg-[#0b142d] p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 font-rajdhani uppercase font-semibold">Win Rate</div>
            <div className="font-orbitron text-lg font-bold text-emerald-400">{player.winRate}%</div>
          </div>
        </div>

        {/* Player Match History from Raw Submissions */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#00f0ff]" />
              Battle Record Submissions ({playerMatches.length})
            </h4>
            <span className="text-xs font-rajdhani text-slate-400">
              Synced from Raw Submissions
            </span>
          </div>

          {playerMatches.length > 0 ? (
            <div className="space-y-3">
              {playerMatches.map((match) => (
                <a
                  key={match.id}
                  href={match.facebookVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3.5 rounded-xl bg-[#091124] border border-slate-800 hover:border-[#00f0ff] hover:bg-[#0f1b3b] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-rajdhani text-xs font-bold">
                      {match.gameMode}
                    </span>
                    <span className="text-[11px] font-rajdhani text-slate-400">
                      {match.timestamp}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-rajdhani space-y-1">
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-bold">Team A:</span> {match.teamA}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-bold">Team B:</span> {match.teamB}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-rajdhani">
                    <span className="text-slate-400">
                      Winner:{' '}
                      <span className="text-[#00f0ff] font-bold">{match.winningTeam}</span>
                    </span>
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-semibold">
                      Watch Video Record
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#091124] rounded-xl border border-slate-800 text-slate-400 font-rajdhani text-sm">
              No individual battle records found under raw submissions for "{player.playerName}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070e22] border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-rajdhani text-xs uppercase tracking-wider font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
