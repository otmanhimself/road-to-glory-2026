export interface BracketState {
  username: string;
  phase: 1 | 2 | 3;
  groups: Record<string, { first: string | null; second: string | null }>;
  knockout: {
    r16: Array<{ team1: string; team2: string; winner: string | null }>;
    qf: Array<{ team1: string; team2: string; winner: string | null }>;
    sf: Array<{ team1: string; team2: string; winner: string | null }>;
    final: { team1: string; team2: string; winner: string | null } | null;
    thirdPlace: { team1: string; team2: string; winner: string | null } | null;
    champion: string | null;
  };
}

export const initialKnockoutState = {
  r16: Array(12).fill({ team1: '', team2: '', winner: null }),
  qf: Array(6).fill({ team1: '', team2: '', winner: null }),
  sf: Array(3).fill({ team1: '', team2: '', winner: null }),
  final: null,
  thirdPlace: null,
  champion: null,
};

export const generateR16 = (groups: Record<string, { first: string | null; second: string | null }>) => {
  return [
    { team1: groups['A']?.first || '', team2: groups['B']?.second || '', winner: null }, // Match 1
    { team1: groups['C']?.first || '', team2: groups['D']?.second || '', winner: null }, // Match 2
    { team1: groups['E']?.first || '', team2: groups['F']?.second || '', winner: null }, // Match 3
    { team1: groups['G']?.first || '', team2: groups['H']?.second || '', winner: null }, // Match 4
    { team1: groups['I']?.first || '', team2: groups['J']?.second || '', winner: null }, // Match 5
    { team1: groups['K']?.first || '', team2: groups['L']?.second || '', winner: null }, // Match 6
    { team1: groups['B']?.first || '', team2: groups['A']?.second || '', winner: null }, // Match 7
    { team1: groups['D']?.first || '', team2: groups['C']?.second || '', winner: null }, // Match 8
    { team1: groups['F']?.first || '', team2: groups['E']?.second || '', winner: null }, // Match 9
    { team1: groups['H']?.first || '', team2: groups['G']?.second || '', winner: null }, // Match 10
    { team1: groups['J']?.first || '', team2: groups['I']?.second || '', winner: null }, // Match 11
    { team1: groups['L']?.first || '', team2: groups['K']?.second || '', winner: null }, // Match 12
  ];
};

export const updateKnockoutRounds = (knockout: BracketState['knockout']): BracketState['knockout'] => {
  const newKnockout = { ...knockout };

  // Update QF
  for (let i = 0; i < 6; i++) {
    newKnockout.qf[i] = {
      team1: newKnockout.r16[i * 2]?.winner || '',
      team2: newKnockout.r16[i * 2 + 1]?.winner || '',
      winner: newKnockout.qf[i]?.winner || null,
    };
    // reset winner if team changes
    if (newKnockout.qf[i].winner !== newKnockout.qf[i].team1 && newKnockout.qf[i].winner !== newKnockout.qf[i].team2) {
      newKnockout.qf[i].winner = null;
    }
  }

  // Update SF
  for (let i = 0; i < 3; i++) {
    newKnockout.sf[i] = {
      team1: newKnockout.qf[i * 2]?.winner || '',
      team2: newKnockout.qf[i * 2 + 1]?.winner || '',
      winner: newKnockout.sf[i]?.winner || null,
    };
    if (newKnockout.sf[i].winner !== newKnockout.sf[i].team1 && newKnockout.sf[i].winner !== newKnockout.sf[i].team2) {
      newKnockout.sf[i].winner = null;
    }
  }

  // Update Final
  newKnockout.final = {
    team1: newKnockout.sf[0]?.winner || '',
    team2: newKnockout.sf[1]?.winner || '',
    winner: newKnockout.final?.winner || null,
  };
  if (newKnockout.final.winner !== newKnockout.final.team1 && newKnockout.final.winner !== newKnockout.final.team2) {
    newKnockout.final.winner = null;
  }

  // Update Third Place
  const sf3Match = newKnockout.sf[2];
  newKnockout.thirdPlace = {
    team1: sf3Match?.team1 || '',
    team2: sf3Match?.team2 || '',
    winner: sf3Match?.winner || null, // The winner of SF3 is the 3rd place! Wait.
  };

  // Champion
  newKnockout.champion = newKnockout.final.winner;

  return newKnockout;
};
