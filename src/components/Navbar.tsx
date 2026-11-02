import React from 'react';
import { RefreshCw, ShieldCheck, Award, Swords, BarChart3 } from 'lucide-react';
import { GreekMeander } from './GreekMeander';

interface NavbarProps {
  onRefresh: () => void;
  isLoading: boolean;
  dataSource: 'live-api' | 'live-csv' | 'fallback';
  lastUpdated: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefresh,
  isLoading,
  dataSource,
  lastUpdated
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#060b18]/90 backdrop-blur-md border-b border-[#00f0ff]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity (Subtitle removed per instruction) */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative p-1 rounded-lg bg-[#0e172e] border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] group-hover:border-[#00f0ff]">
                <img
                  src="https://i.imgur.com/BxZyuk9.png"
                  alt="Vathmo Log Logo"
                  className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex items-center">
                <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white flex items-center gap-1.5">
                  VATHMO <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">LOG</span>
                </span>
              </div>
            </a>
          </div>

          {/* Quick Nav Anchor Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#podium"
              className="text-xs uppercase tracking-wider font-rajdhani font-semibold text-slate-300 hover:text-[#00f0ff] flex items-center gap-1.5 transition-colors py-1 border-b border-transparent hover:border-[#00f0ff]"
            >
              <Award className="w-3.5 h-3.5 text-[#00f0ff]" />
              Champions
            </a>
            <a
              href="#leaderboard"
              className="text-xs uppercase tracking-wider font-rajdhani font-semibold text-slate-300 hover:text-[#00f0ff] flex items-center gap-1.5 transition-colors py-1 border-b border-transparent hover:border-[#00f0ff]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
              Leaderboard
            </a>
            <a
              href="#analytics"
              className="text-xs uppercase tracking-wider font-rajdhani font-semibold text-slate-300 hover:text-[#00f0ff] flex items-center gap-1.5 transition-colors py-1 border-b border-transparent hover:border-[#00f0ff]"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#00f0ff]" />
              Analytics
            </a>
            <a
              href="#matches"
              className="text-xs uppercase tracking-wider font-rajdhani font-semibold text-slate-300 hover:text-[#00f0ff] flex items-center gap-1.5 transition-colors py-1 border-b border-transparent hover:border-[#00f0ff]"
            >
              <Swords className="w-3.5 h-3.5 text-[#00f0ff]" />
              Recent Matches
            </a>
          </nav>

          {/* Live Data Refresh Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Leaderboard Data"
              className="p-2 rounded-lg bg-[#0d1630] border border-[#00f0ff]/30 text-cyan-400 hover:text-white hover:border-[#00f0ff] hover:bg-[#14234b] transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00f0ff]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Greek Meander Decorative Ribbon */}
      <GreekMeander color="#00f0ff" height={8} />
    </header>
  );
};
