/**
 * Vathmo Log Data Service
 * Pulls live data dynamically from the public Google Sheet via CSV export endpoints.
 * Zero hardcoded or placeholder arrays.
 */

export interface PlayerRecord {
  rank: number;
  playerName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number; // percentage 0-100
  avatarUrl: string;
}

export interface MatchRecord {
  id: string;
  timestamp: string;
  gameMode: string;
  teamA: string;
  teamB: string;
  winningTeam: string;
  facebookVideoUrl: string;
  thumbnailUrl: string;
}

export const SHEET_ID = '1ji8pAKGX72ND-giHEbKLBxCJZz8OkKc7o67W4CNGKzc';
export const VIDEO_PLACEHOLDER_URL = 'https://i.imgur.com/JLhuB2S.jpeg';
export const DEFAULT_AVATAR_URL = 'https://i.imgur.com/pgCLemg.jpeg';
export const DEFAULT_MATCH_THUMBNAIL_URL = 'https://i.imgur.com/JLhuB2S.jpeg';

/**
 * Standard CSV parser handling quotes, commas, and line breaks.
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentVal.trim());
      if (currentRow.some((col) => col.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((col) => col.length > 0)) {
      rows.push(currentRow);
    }
  }
  return rows;
}

/**
 * Normalizes and sorts the Leaderboard records:
 * Primary Sort: Wins (descending)
 * Tie-breaker: Win Rate (%) (descending)
 */
export function processLeaderboardRows(rows: string[][]): PlayerRecord[] {
  if (!rows || rows.length <= 1) return [];

  // Identify column indices from header
  const header = rows[0].map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));
  const nameIdx = header.findIndex((h) => h.includes('player') || h.includes('name'));
  const matchesIdx = header.findIndex((h) => h.includes('matches') || h.includes('played') || h.includes('games'));
  const winsIdx = header.findIndex((h) => h.includes('win') && !h.includes('rate'));
  const lossesIdx = header.findIndex((h) => h.includes('loss') || h.includes('losses'));
  const winRateIdx = header.findIndex((h) => h.includes('rate') || h.includes('%'));
  const avatarIdx = header.findIndex(
    (h) => h.includes('profile') || h.includes('picture') || h.includes('avatar') || h.includes('photo') || h.includes('image')
  );

  const parsedPlayers: Omit<PlayerRecord, 'rank'>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const playerName = (nameIdx >= 0 && row[nameIdx] ? row[nameIdx] : row[0] || '').replace(/^["']|["']$/g, '').trim();
    if (!playerName || playerName.toLowerCase() === 'player name' || playerName.toLowerCase() === 'name') {
      continue;
    }

    const matchesPlayed = parseInt(matchesIdx >= 0 && row[matchesIdx] ? row[matchesIdx] : row[1] || '0', 10) || 0;
    const wins = parseInt(winsIdx >= 0 && row[winsIdx] ? row[winsIdx] : row[2] || '0', 10) || 0;
    const losses = parseInt(lossesIdx >= 0 && row[lossesIdx] ? row[lossesIdx] : row[3] || '0', 10) || 0;

    let winRate = 0;
    if (winRateIdx >= 0 && row[winRateIdx]) {
      const rawRate = row[winRateIdx].replace(/[%'"]/g, '').trim();
      const parsedRate = parseFloat(rawRate);
      if (!isNaN(parsedRate)) {
        winRate = parsedRate <= 1 && parsedRate > 0 ? parsedRate * 100 : parsedRate;
      }
    } else if (matchesPlayed > 0) {
      winRate = (wins / matchesPlayed) * 100;
    } else if (wins + losses > 0) {
      winRate = (wins / (wins + losses)) * 100;
    }

    // Column F (Index 5) Profile Picture URL with fallback logic
    const rawAvatar = (avatarIdx >= 0 && row[avatarIdx] ? row[avatarIdx] : row[5] || '')
      .replace(/^["']|["']$/g, '')
      .trim();
    const avatarUrl = rawAvatar && rawAvatar.startsWith('http') ? rawAvatar : DEFAULT_AVATAR_URL;

    parsedPlayers.push({
      playerName,
      matchesPlayed: matchesPlayed || wins + losses,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      avatarUrl
    });
  }

  // Sort by Wins desc, then Win Rate desc
  parsedPlayers.sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    return b.winRate - a.winRate;
  });

  return parsedPlayers.map((player, index) => ({
    ...player,
    rank: index + 1
  }));
}

/**
 * Normalizes all valid Raw Submissions rows into MatchRecord list.
 * Note: 'Match Thumbnail' column has been permanently hidden from database;
 * the parser automatically injects the static default image (DEFAULT_MATCH_THUMBNAIL_URL)
 * for all match cards instead of extracting a thumbnail URL from the CSV.
 */
export function processAllMatchRows(rows: string[][]): MatchRecord[] {
  if (!rows || rows.length <= 1) return [];

  const header = rows[0].map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));
  const timeIdx = header.findIndex((h) => h.includes('time') || h.includes('date'));
  const modeIdx = header.findIndex((h) => h.includes('mode') || h.includes('game'));
  const teamAIdx = header.findIndex((h) => h.includes('team a') || h.includes('team 1'));
  const teamBIdx = header.findIndex((h) => h.includes('team b') || h.includes('team 2'));
  const winTeamIdx = header.findIndex((h) => h.includes('winning') || h.includes('winner'));
  const fbIdx = header.findIndex((h) => h.includes('facebook') || h.includes('video') || h.includes('link'));

  const matches: MatchRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const timestamp = (timeIdx >= 0 && row[timeIdx] ? row[timeIdx] : row[0] || '').replace(/^["']|["']$/g, '').trim();
    const gameMode = (modeIdx >= 0 && row[modeIdx] ? row[modeIdx] : row[1] || 'Competitive Match').replace(/^["']|["']$/g, '').trim();
    const teamA = (teamAIdx >= 0 && row[teamAIdx] ? row[teamAIdx] : row[2] || '').replace(/^["']|["']$/g, '').trim();
    const teamB = (teamBIdx >= 0 && row[teamBIdx] ? row[teamBIdx] : row[3] || '').replace(/^["']|["']$/g, '').trim();
    const winningTeam = (winTeamIdx >= 0 && row[winTeamIdx] ? row[winTeamIdx] : row[4] || 'Undetermined').replace(/^["']|["']$/g, '').trim();
    const rawFb = (fbIdx >= 0 && row[fbIdx] ? row[fbIdx] : row[5] || '').replace(/^["']|["']$/g, '').trim();

    // Skip empty rows
    if (!teamA && !teamB && !timestamp) continue;

    matches.push({
      id: `match-${i}-${timestamp.replace(/[^a-zA-Z0-9]/g, '') || i}`,
      timestamp: timestamp || 'Recent',
      gameMode: gameMode || 'Ranked Match',
      teamA: teamA || 'Team Alpha',
      teamB: teamB || 'Team Beta',
      winningTeam: winningTeam || 'Undetermined',
      facebookVideoUrl: rawFb.startsWith('http') ? rawFb : 'https://www.facebook.com/watch',
      thumbnailUrl: DEFAULT_MATCH_THUMBNAIL_URL
    });
  }

  return matches;
}

/**
 * Returns strictly the 3 most recent matches for the dashboard feed.
 */
export function processMatchRows(rows: string[][]): MatchRecord[] {
  return processAllMatchRows(rows).slice(0, 3);
}

export interface LiveSheetDataResult {
  leaderboard: PlayerRecord[];
  matches: MatchRecord[];
  totalBattles: number;
  isLoaded: boolean;
  error?: string;
}

/**
 * Live fetch function pulling directly from the public Google Sheet CSV endpoints.
 * Zero hardcoded/mock arrays.
 */
export async function fetchLiveSheetData(): Promise<LiveSheetDataResult> {
  const gvizLeaderboardUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Calculated%20Leaderboard`;
  const gvizMatchesUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Raw%20Submissions`;

  try {
    const [resLb, resMatches] = await Promise.all([
      fetch(gvizLeaderboardUrl, { cache: 'no-store' }),
      fetch(gvizMatchesUrl, { cache: 'no-store' })
    ]);

    if (!resLb.ok || !resMatches.ok) {
      throw new Error(`Google Sheets responded with HTTP status ${resLb.status} / ${resMatches.status}`);
    }

    const textLb = await resLb.text();
    const textMatches = await resMatches.text();

    // Check if Google returned an HTML login or error page instead of valid CSV
    if (textLb.includes('<!DOCTYPE') || textLb.includes('<html') || textMatches.includes('<!DOCTYPE')) {
      // Try secondary CSV export endpoint structure
      const exportLbUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=Calculated%20Leaderboard`;
      const exportMatchesUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=Raw%20Submissions`;

      const [resExpLb, resExpMatches] = await Promise.all([
        fetch(exportLbUrl, { cache: 'no-store' }),
        fetch(exportMatchesUrl, { cache: 'no-store' })
      ]);

      if (resExpLb.ok && resExpMatches.ok) {
        const textExpLb = await resExpLb.text();
        const textExpMatches = await resExpMatches.text();

        if (!textExpLb.includes('<!DOCTYPE') && textExpLb.includes(',')) {
          const lbRows = parseCSV(textExpLb);
          const matchRows = parseCSV(textExpMatches);
          const allMatches = processAllMatchRows(matchRows);
          return {
            leaderboard: processLeaderboardRows(lbRows),
            matches: allMatches.slice(0, 3),
            totalBattles: allMatches.length,
            isLoaded: true
          };
        }
      }

      throw new Error('Google Sheet returned a login/private page. Ensure sharing is set to "Anyone with the link can view".');
    }

    const lbRows = parseCSV(textLb);
    const matchRows = parseCSV(textMatches);
    const allMatches = processAllMatchRows(matchRows);

    return {
      leaderboard: processLeaderboardRows(lbRows),
      matches: allMatches.slice(0, 3),
      totalBattles: allMatches.length,
      isLoaded: true
    };
  } catch (err: any) {
    console.warn('Live Google Sheet fetch notice:', err.message || err);
    return {
      leaderboard: [],
      matches: [],
      totalBattles: 0,
      isLoaded: false,
      error: err.message || 'Unable to fetch Google Sheet data'
    };
  }
}
