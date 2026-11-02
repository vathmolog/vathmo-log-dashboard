import React from 'react';
import { GreekMeander } from './GreekMeander';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#030610] border-t border-slate-800 text-slate-400">
      <GreekMeander color="#00f0ff" height={8} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Clean Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://i.imgur.com/BxZyuk9.png"
                alt="Vathmo Log"
                className="h-10 w-auto object-contain"
              />
              <span className="font-cinzel text-xl font-bold tracking-wider text-white">
                VATHMO <span className="text-[#00f0ff]">LOG</span>
              </span>
            </div>
            {/* Required Simple Text */}
            <p className="font-rajdhani text-sm text-slate-400 max-w-lg leading-relaxed">
              The official leaderboard and match tracking portal for the VL gaming community.
            </p>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-rajdhani font-semibold uppercase tracking-wider">
            <a href="#podium" className="text-slate-400 hover:text-[#00f0ff] transition-colors">
              Champions Podium
            </a>
            <a href="#leaderboard" className="text-slate-400 hover:text-[#00f0ff] transition-colors">
              Leaderboard
            </a>
            <a href="#analytics" className="text-slate-400 hover:text-[#00f0ff] transition-colors">
              Analytics
            </a>
            <a href="#matches" className="text-slate-400 hover:text-[#00f0ff] transition-colors">
              Recent Matches
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs font-rajdhani text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Vathmo Log. All rights reserved.</p>
          <div className="flex items-center gap-2 text-cyan-400/70">
            <Shield className="w-3.5 h-3.5" />
            <span>VL Community Tournament Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
