export const GROUPS: Record<string, string[]> = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada', 'Switzerland', 'Qatar', 'Bosnia and Herzegovina'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['United States', 'Paraguay', 'Australia', 'Turkiye'],
  E: ['Germany', 'Curacao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Tunisia', 'Sweden'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Norway', 'Iraq'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Uzbekistan', 'Colombia', 'DR Congo'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

export const FLAG_CODES: Record<string, string> = {
  Mexico: 'mx', 'South Africa': 'za', 'South Korea': 'kr', Czechia: 'cz',
  Canada: 'ca', Switzerland: 'ch', Qatar: 'qa', 'Bosnia and Herzegovina': 'ba',
  Brazil: 'br', Morocco: 'ma', Haiti: 'ht', Scotland: 'gb-sct',
  'United States': 'us', Paraguay: 'py', Australia: 'au', Turkiye: 'tr',
  Germany: 'de', Curacao: 'cw', 'Ivory Coast': 'ci', Ecuador: 'ec',
  Netherlands: 'nl', Japan: 'jp', Tunisia: 'tn', Sweden: 'se',
  Belgium: 'be', Egypt: 'eg', Iran: 'ir', 'New Zealand': 'nz',
  Spain: 'es', 'Cape Verde': 'cv', 'Saudi Arabia': 'sa', Uruguay: 'uy',
  France: 'fr', Senegal: 'sn', Norway: 'no', Iraq: 'iq',
  Argentina: 'ar', Algeria: 'dz', Austria: 'at', Jordan: 'jo',
  Portugal: 'pt', Uzbekistan: 'uz', Colombia: 'co', 'DR Congo': 'cd',
  England: 'gb-eng', Croatia: 'hr', Ghana: 'gh', Panama: 'pa',
};

export const getFlagUrl = (team: string) => {
  const code = FLAG_CODES[team];
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
};

export const FIFA_RANKINGS: Record<string, number> = {
  Argentina: 1, France: 2, Spain: 3, England: 4, Brazil: 5,
  Belgium: 6, Netherlands: 7, Portugal: 8, Colombia: 9, Germany: 10,
  Morocco: 11, Japan: 12, 'United States': 13, Uruguay: 14, Croatia: 15,
  Iran: 16, Mexico: 17, Switzerland: 18, Senegal: 19, Austria: 20,
  Australia: 21, Norway: 22, 'South Korea': 23, Egypt: 24, Czechia: 25,
  Ecuador: 26, Sweden: 27, Tunisia: 28, 'Saudi Arabia': 29, 'Ivory Coast': 30,
  Algeria: 31, Paraguay: 32, Uzbekistan: 33, Scotland: 34, Turkiye: 35,
  Jordan: 36, 'DR Congo': 37, Iraq: 38, 'New Zealand': 39, Ghana: 40,
  Panama: 41, 'Cape Verde': 42, Qatar: 43, 'South Africa': 44,
  Canada: 45, 'Bosnia and Herzegovina': 46, Haiti: 47, Curacao: 48,
};

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export const CONFEDERATION: Record<string, Confederation> = {
  Spain: 'UEFA', Germany: 'UEFA', Netherlands: 'UEFA', France: 'UEFA',
  Belgium: 'UEFA', Portugal: 'UEFA', England: 'UEFA', Switzerland: 'UEFA',
  Croatia: 'UEFA', Norway: 'UEFA', Austria: 'UEFA', Sweden: 'UEFA',
  Czechia: 'UEFA', Scotland: 'UEFA', 'Bosnia and Herzegovina': 'UEFA', Turkiye: 'UEFA',
  Brazil: 'CONMEBOL', Argentina: 'CONMEBOL', Ecuador: 'CONMEBOL',
  Paraguay: 'CONMEBOL', Colombia: 'CONMEBOL', Uruguay: 'CONMEBOL',
  Mexico: 'CONCACAF', Canada: 'CONCACAF', 'United States': 'CONCACAF',
  Haiti: 'CONCACAF', Panama: 'CONCACAF', Curacao: 'CONCACAF',
  Morocco: 'CAF', Senegal: 'CAF', Egypt: 'CAF', Tunisia: 'CAF',
  'Ivory Coast': 'CAF', Algeria: 'CAF', Ghana: 'CAF', 'Cape Verde': 'CAF',
  'DR Congo': 'CAF', 'South Africa': 'CAF',
  'South Korea': 'AFC', Japan: 'AFC', 'Saudi Arabia': 'AFC', Iran: 'AFC',
  Qatar: 'AFC', Australia: 'AFC', Iraq: 'AFC', Jordan: 'AFC', Uzbekistan: 'AFC',
  'New Zealand': 'OFC',
};

export const CONFEDERATION_STYLE: Record<Confederation, { bg: string; color: string; border: string }> = {
  UEFA:     { bg: 'rgba(59,130,246,0.18)',  color: '#7cb9ff', border: 'rgba(59,130,246,0.3)' },
  CONMEBOL: { bg: 'rgba(34,197,94,0.18)',   color: '#6ee7a0', border: 'rgba(34,197,94,0.3)' },
  CONCACAF: { bg: 'rgba(249,115,22,0.18)',  color: '#fdba74', border: 'rgba(249,115,22,0.3)' },
  CAF:      { bg: 'rgba(234,179,8,0.18)',   color: '#fde047', border: 'rgba(234,179,8,0.3)' },
  AFC:      { bg: 'rgba(168,85,247,0.18)',  color: '#d8b4fe', border: 'rgba(168,85,247,0.3)' },
  OFC:      { bg: 'rgba(156,163,175,0.18)', color: '#cbd5e1', border: 'rgba(156,163,175,0.3)' },
};
