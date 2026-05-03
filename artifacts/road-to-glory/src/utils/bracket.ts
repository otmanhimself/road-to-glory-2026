export interface GroupSelection {
  first: string | null;
  second: string | null;
  third: string | null;
}

export interface Match {
  team1: string;
  team2: string;
  winner: string | null;
}

export interface BracketState {
  username: string;
  phase: 1 | 2 | 3 | 4;
  groups: Record<string, GroupSelection>;
  selectedThirdPlace: string[];
  knockout: {
    r32: Match[];
    r16: Match[];
    qf: Match[];
    sf: Match[];
    final: Match | null;
    champion: string | null;
  };
}

const emptyMatch = (): Match => ({ team1: '', team2: '', winner: null });

export const initialKnockoutState: BracketState['knockout'] = {
  r32: Array.from({ length: 16 }, emptyMatch),
  r16: Array.from({ length: 8 }, emptyMatch),
  qf: Array.from({ length: 4 }, emptyMatch),
  sf: Array.from({ length: 2 }, emptyMatch),
  final: null,
  champion: null,
};

export const generateR32 = (
  groups: Record<string, GroupSelection>,
  selectedThirdPlace: string[]
): Match[] => {
  const g = groups;
  const t = selectedThirdPlace;
  return [
    // Left side — matches 0-7
    { team1: g['A']?.first || '', team2: g['B']?.second || '', winner: null },  // 0
    { team1: g['C']?.first || '', team2: g['D']?.second || '', winner: null },  // 1
    { team1: g['E']?.first || '', team2: g['F']?.second || '', winner: null },  // 2
    { team1: g['G']?.first || '', team2: g['H']?.second || '', winner: null },  // 3
    { team1: g['I']?.first || '', team2: g['J']?.second || '', winner: null },  // 4
    { team1: g['K']?.first || '', team2: g['L']?.second || '', winner: null },  // 5
    { team1: t[0] || '', team2: t[1] || '', winner: null },                     // 6
    { team1: t[2] || '', team2: t[3] || '', winner: null },                     // 7
    // Right side — matches 8-15
    { team1: g['B']?.first || '', team2: g['A']?.second || '', winner: null },  // 8
    { team1: g['D']?.first || '', team2: g['C']?.second || '', winner: null },  // 9
    { team1: g['F']?.first || '', team2: g['E']?.second || '', winner: null },  // 10
    { team1: g['H']?.first || '', team2: g['G']?.second || '', winner: null },  // 11
    { team1: g['J']?.first || '', team2: g['I']?.second || '', winner: null },  // 12
    { team1: g['L']?.first || '', team2: g['K']?.second || '', winner: null },  // 13
    { team1: t[4] || '', team2: t[5] || '', winner: null },                     // 14
    { team1: t[6] || '', team2: t[7] || '', winner: null },                     // 15
  ];
};

const resetIfStale = (match: Match, prev: Match | undefined): Match => {
  if (!prev) return match;
  if (match.winner && match.winner !== match.team1 && match.winner !== match.team2) {
    return { ...match, winner: null };
  }
  return match;
};

export const updateKnockoutRounds = (
  knockout: BracketState['knockout']
): BracketState['knockout'] => {
  const k = { ...knockout };

  // R32 → R16
  k.r16 = Array.from({ length: 8 }, (_, i) => {
    const updated: Match = {
      team1: k.r32[i * 2]?.winner || '',
      team2: k.r32[i * 2 + 1]?.winner || '',
      winner: k.r16[i]?.winner || null,
    };
    return resetIfStale(updated, k.r16[i]);
  });

  // R16 → QF
  k.qf = Array.from({ length: 4 }, (_, i) => {
    const updated: Match = {
      team1: k.r16[i * 2]?.winner || '',
      team2: k.r16[i * 2 + 1]?.winner || '',
      winner: k.qf[i]?.winner || null,
    };
    return resetIfStale(updated, k.qf[i]);
  });

  // QF → SF
  k.sf = Array.from({ length: 2 }, (_, i) => {
    const updated: Match = {
      team1: k.qf[i * 2]?.winner || '',
      team2: k.qf[i * 2 + 1]?.winner || '',
      winner: k.sf[i]?.winner || null,
    };
    return resetIfStale(updated, k.sf[i]);
  });

  // SF → Final
  k.final = {
    team1: k.sf[0]?.winner || '',
    team2: k.sf[1]?.winner || '',
    winner: k.final?.winner || null,
  };
  if (k.final.winner && k.final.winner !== k.final.team1 && k.final.winner !== k.final.team2) {
    k.final.winner = null;
  }

  k.champion = k.final.winner;

  return k;
};
