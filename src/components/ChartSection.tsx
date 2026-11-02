import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { type PlayerRecord } from '../services/sheets';
import { GreekMeander } from './GreekMeander';
import { BarChart3, PieChart, Activity, Zap } from 'lucide-react';

// Register required Chart.js controllers and elements
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

interface ChartSectionProps {
  players: PlayerRecord[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ players }) => {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const donutChartRef = useRef<HTMLCanvasElement | null>(null);

  const barChartInstance = useRef<Chart | null>(null);
  const donutChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!players || players.length === 0) return;

    // Top 7 players for horizontal stacked bar chart
    const top7 = players.slice(0, 7);
    const labels = top7.map((p) => p.playerName);
    const winsData = top7.map((p) => p.wins);
    const lossesData = top7.map((p) => p.losses);

    // 1. Horizontal Stacked Bar Chart: Win vs Loss Ratio
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        barChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Victories (Wins)',
                data: winsData,
                backgroundColor: 'rgba(0, 240, 255, 0.85)',
                borderColor: '#00f0ff',
                borderWidth: 1.5,
                borderRadius: { topLeft: 4, bottomLeft: 4 }
              },
              {
                label: 'Defeats (Losses)',
                data: lossesData,
                backgroundColor: 'rgba(239, 68, 68, 0.65)',
                borderColor: '#ef4444',
                borderWidth: 1.5,
                borderRadius: { topRight: 4, bottomRight: 4 }
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.06)'
                },
                ticks: {
                  color: '#94a3b8',
                  font: { family: 'Rajdhani', size: 12, weight: 'bold' }
                }
              },
              y: {
                stacked: true,
                grid: {
                  display: false
                },
                ticks: {
                  color: '#e2e8f0',
                  font: { family: 'Cinzel', size: 12, weight: 'bold' }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#e2e8f0',
                  font: { family: 'Rajdhani', size: 12, weight: 'bold' },
                  usePointStyle: true,
                  pointStyle: 'rectRounded'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(11, 19, 41, 0.95)',
                borderColor: 'rgba(0, 240, 255, 0.5)',
                borderWidth: 1,
                titleFont: { family: 'Cinzel', size: 14 },
                bodyFont: { family: 'Rajdhani', size: 13 },
                callbacks: {
                  afterBody: (context) => {
                    const dataIndex = context[0].dataIndex;
                    const p = top7[dataIndex];
                    return `Win Rate: ${p.winRate}% | Total Battles: ${p.matchesPlayed}`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // 2. Donut Chart: Apex Gladiators Victory Share
    if (donutChartRef.current) {
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }

      const top5 = players.slice(0, 5);
      const ctx = donutChartRef.current.getContext('2d');
      if (ctx) {
        donutChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: top5.map((p) => p.playerName),
            datasets: [
              {
                data: top5.map((p) => p.wins),
                backgroundColor: [
                  '#d4af37', // Gold 1st
                  '#38bdf8', // Cyan 2nd
                  '#b45309', // Bronze 3rd
                  '#00f0ff', // Electric Cyan 4th
                  '#818cf8'  // Indigo 5th
                ],
                borderColor: '#060b18',
                borderWidth: 2,
                hoverOffset: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#cbd5e1',
                  font: { family: 'Rajdhani', size: 11, weight: 'bold' },
                  boxWidth: 10,
                  padding: 10
                }
              },
              tooltip: {
                backgroundColor: 'rgba(7, 14, 34, 0.95)',
                borderColor: 'rgba(0, 240, 255, 0.5)',
                borderWidth: 1,
                titleFont: { family: 'Cinzel' },
                bodyFont: { family: 'Rajdhani', size: 13 },
                callbacks: {
                  label: (context) => {
                    const val = context.parsed;
                    return ` ${val} Victories`;
                  }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }
    };
  }, [players]);

  const totalVictories = players.reduce((sum, p) => sum + p.wins, 0);
  const totalBattles = players.reduce((sum, p) => sum + p.matchesPlayed, 0);
  const avgWinRate = players.length > 0 
    ? Math.round((players.reduce((sum, p) => sum + p.winRate, 0) / players.length) * 10) / 10 
    : 0;

  return (
    <section id="analytics" className="relative py-12 bg-[#040814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-rajdhani text-xs uppercase tracking-widest font-bold">
              <Zap className="w-3.5 h-3.5" />
              Chart.js Visual Engine
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Combat Analytics <span className="text-[#00f0ff]">& Win/Loss Dynamics</span>
            </h2>
          </div>
          <p className="font-rajdhani text-sm text-slate-400 max-w-md">
            Visualizing real-time gladiator performance ratios and victory shares directly derived from official arena records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Horizontal Stacked Bar Chart */}
          <div className="lg:col-span-2 cyber-panel rounded-xl p-5 border border-[#00f0ff]/25 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wide">
                  Top Contenders: Win vs Loss Ratio
                </h3>
              </div>
              <span className="font-rajdhani text-xs text-slate-400 uppercase tracking-wider">
                Stacked Performance
              </span>
            </div>

            <div className="h-[320px] w-full relative">
              <canvas ref={barChartRef} />
            </div>
          </div>

          {/* Donut Chart: Top 5 Victory Distribution & Summary Counters */}
          <div className="cyber-panel rounded-xl p-5 border border-[#00f0ff]/25 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wide">
                    Apex Victory Share
                  </h3>
                </div>
                <span className="font-rajdhani text-xs text-amber-300/80 uppercase font-semibold">
                  Top 5
                </span>
              </div>

              <div className="h-[210px] w-full relative">
                <canvas ref={donutChartRef} />
              </div>
            </div>

            {/* Quick telemetry pills */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#091124] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-rajdhani">Total Victories</div>
                <div className="font-orbitron text-base font-bold text-cyan-400">{totalVictories}</div>
              </div>
              <div className="bg-[#091124] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-rajdhani">Avg Win Rate</div>
                <div className="font-orbitron text-base font-bold text-emerald-400">{avgWinRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <GreekMeander color="#00f0ff" height={8} />
        </div>
      </div>
    </section>
  );
};
