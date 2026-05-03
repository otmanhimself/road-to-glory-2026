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

// Canonical group order used throughout
const GROUP_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

interface TeamEntry { name: string; group: string; }

/**
 * Generates the Round of 32 following FIFA-style rules:
 *
 * RULE 1 — No same-group matches in R32.
 *   Guaranteed by pairing each winner[i] with runnerUp[(i + 6) % 12].
 *   Shifting by exactly half the group count (6 of 12) means the group indices
 *   never overlap: winner[A]=0 → runnerUp[G]=6, winner[G]=6 → runnerUp[A]=0, etc.
 *
 * RULE 2 — Structured matchmaking, not random.
 *   Winners A–F are seeded on the left half of the bracket (matches 0–5).
 *   Winners G–L are seeded on the right half (matches 8–13).
 *   Third-place teams fill the remaining slots (2 per half).
 *
 * RULE 3 — Third-place teams are always from different groups.
 *   Each selected third is the unique 3rd-place finisher of its group, so
 *   any pairing of thirds is automatically cross-group.
 */
export const generateR32 = (
  groups: Record<string, GroupSelection>,
  selectedThirdPlace: string[]
): Match[] => {
  // Build team arrays in canonical group order
  const winners: TeamEntry[] = GROUP_ORDER.map(id => ({
    name: groups[id]?.first || '',
    group: id,
  }));
  const runnersUp: TeamEntry[] = GROUP_ORDER.map(id => ({
    name: groups[id]?.second || '',
    group: id,
  }));

  // Build a group-lookup map for third-place teams
  const teamToGroup: Record<string, string> = {};
  GROUP_ORDER.forEach(id => {
    const g = groups[id];
    if (g?.first)  teamToGroup[g.first]  = id;
    if (g?.second) teamToGroup[g.second] = id;
    if (g?.third)  teamToGroup[g.third]  = id;
  });
  const thirds: TeamEntry[] = selectedThirdPlace.map(name => ({
    name,
    group: teamToGroup[name] || '?',
  }));

  // --- Pair winners with runners-up ---
  // Shift index by 6: winner[i].group ≠ runnersUp[(i+6)%12].group for all i
  const winnerMatches: Match[] = winners.map((w, i) => ({
    team1: w.name,
    team2: runnersUp[(i + 6) % 12].name,
    winner: null,
  }));

  // --- Pair third-place teams ---
  // Each third is from a unique group so any pairing is cross-group
  const thirdMatches: Match[] = [
    { team1: thirds[0]?.name || '', team2: thirds[1]?.name || '', winner: null },
    { team1: thirds[2]?.name || '', team2: thirds[3]?.name || '', winner: null },
    { team1: thirds[4]?.name || '', team2: thirds[5]?.name || '', winner: null },
    { team1: thirds[6]?.name || '', team2: thirds[7]?.name || '', winner: null },
  ];

  // --- Validate: assert no same-group collision exists ---
  // (Safety net — the algorithm above makes this impossible, but log if it ever fires)
  const allMatches = [...winnerMatches, ...thirdMatches];
  allMatches.forEach((m, idx) => {
    const g1 = teamToGroup[m.team1];
    const g2 = teamToGroup[m.team2];
    if (g1 && g2 && g1 === g2) {
      console.warn(`[bracket] R32 match ${idx} has same-group teams: ${m.team1} vs ${m.team2} (Group ${g1})`);
    }
  });

  // --- Arrange into 16 bracket slots ---
  //
  // LEFT half  (slots 0–7):  Winners A–F + 2 thirds matches
  //   slot 0: W_A vs RU_G   slot 1: W_B vs RU_H
  //   slot 2: W_C vs RU_I   slot 3: W_D vs RU_J
  //   slot 4: W_E vs RU_K   slot 5: W_F vs RU_L
  //   slot 6: Third[0] vs Third[1]
  //   slot 7: Third[2] vs Third[3]
  //
  // RIGHT half (slots 8–15): Winners G–L + 2 thirds matches
  //   slot  8: W_G vs RU_A   slot  9: W_H vs RU_B
  //   slot 10: W_I vs RU_C   slot 11: W_J vs RU_D
  //   slot 12: W_K vs RU_E   slot 13: W_L vs RU_F
  //   slot 14: Third[4] vs Third[5]
  //   slot 15: Third[6] vs Third[7]
  //
  return [
    ...winnerMatches.slice(0, 6),   // slots 0–5
    thirdMatches[0],                 // slot 6
    thirdMatches[1],                 // slot 7
    ...winnerMatches.slice(6, 12),  // slots 8–13
    thirdMatches[2],                 // slot 14
    thirdMatches[3],                 // slot 15
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

  // R32 → R16: adjacent pairs of R32 matches feed one R16 match
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
