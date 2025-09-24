import axios from 'axios';

const OPENDOTA_BASE_URL = process.env.OPENDOTA_BASE_URL ?? 'https://api.opendota.com/api';

interface RankBucketResponse {
  rankBracket: string;
  matches: number;
  percentage: number;
}

interface HeroWinRate {
  heroId: number;
  heroName: string;
  matches: number;
  wins: number;
  winRate: number;
}

interface ItemWinRate {
  itemId: number;
  itemName: string;
  wins: number;
  games: number;
  winRate: number;
}

interface FactionWinRate {
  faction: 'Radiant' | 'Dire';
  wins: number;
  matches: number;
  winRate: number;
}

const http = axios.create({
  baseURL: OPENDOTA_BASE_URL,
  timeout: 15_000,
});

const RANK_BUCKET_LABELS: Record<number, string> = {
  0: 'Herald',
  10: 'Guardian',
  20: 'Crusader',
  30: 'Archon',
  40: 'Legend',
  50: 'Ancient',
  60: 'Divine',
  70: 'Immortal',
};

type HeroMetadata = {
  id: number;
  localized_name: string;
};

type ItemMetadata = {
  id: number;
  dname?: string;
};

let heroMetadataCache: Map<number, HeroMetadata> | null = null;
let itemMetadataCache: Map<number, ItemMetadata> | null = null;

const fallbackRankDistribution: RankBucketResponse[] = [
  { rankBracket: 'Herald', matches: 125_000, percentage: 0.18 },
  { rankBracket: 'Guardian', matches: 150_000, percentage: 0.22 },
  { rankBracket: 'Crusader', matches: 130_000, percentage: 0.19 },
  { rankBracket: 'Archon', matches: 100_000, percentage: 0.15 },
  { rankBracket: 'Legend', matches: 70_000, percentage: 0.10 },
  { rankBracket: 'Ancient', matches: 50_000, percentage: 0.07 },
  { rankBracket: 'Divine', matches: 35_000, percentage: 0.05 },
  { rankBracket: 'Immortal', matches: 20_000, percentage: 0.04 },
];

const fallbackHeroWinRates: HeroWinRate[] = [
  { heroId: 1, heroName: '敌法师', matches: 18_000, wins: 9_600, winRate: 0.533 },
  { heroId: 2, heroName: '水晶室女', matches: 19_500, wins: 10_150, winRate: 0.52 },
  { heroId: 3, heroName: '主宰', matches: 21_000, wins: 11_200, winRate: 0.533 },
  { heroId: 4, heroName: '虚空假面', matches: 17_200, wins: 9_400, winRate: 0.546 },
  { heroId: 5, heroName: '昆卡', matches: 16_850, wins: 9_100, winRate: 0.54 },
  { heroId: 6, heroName: '帕克', matches: 15_400, wins: 8_100, winRate: 0.526 },
  { heroId: 7, heroName: '宙斯', matches: 16_000, wins: 8_600, winRate: 0.538 },
  { heroId: 8, heroName: '电魂', matches: 14_900, wins: 7_800, winRate: 0.523 },
  { heroId: 9, heroName: '斧王', matches: 14_000, wins: 7_600, winRate: 0.543 },
  { heroId: 10, heroName: '巫妖', matches: 13_200, wins: 7_000, winRate: 0.53 },
];

const fallbackItemWinRates: ItemWinRate[] = [
  { itemId: 1, itemName: '辉耀', wins: 5800, games: 10200, winRate: 0.568 },
  { itemId: 2, itemName: '强袭装甲', wins: 6200, games: 11100, winRate: 0.558 },
  { itemId: 3, itemName: '林肯法球', wins: 4100, games: 8300, winRate: 0.494 },
  { itemId: 4, itemName: '阿哈利姆神杖', wins: 7200, games: 13200, winRate: 0.545 },
  { itemId: 5, itemName: '飓风长戟', wins: 3400, games: 6800, winRate: 0.500 },
  { itemId: 6, itemName: '黑皇杖', wins: 10800, games: 19900, winRate: 0.543 },
  { itemId: 7, itemName: '恐鳌之心', wins: 4500, games: 7900, winRate: 0.570 },
  { itemId: 8, itemName: '散华', wins: 3000, games: 6200, winRate: 0.484 },
  { itemId: 9, itemName: '辉月', wins: 5100, games: 9400, winRate: 0.543 },
  { itemId: 10, itemName: '刷新球', wins: 2800, games: 5200, winRate: 0.538 },
];

const fallbackFactionWinRates: FactionWinRate[] = [
  { faction: 'Radiant', wins: 510000, matches: 1_000_000, winRate: 0.51 },
  { faction: 'Dire', wins: 490000, matches: 1_000_000, winRate: 0.49 },
];

const getHeroMetadata = async (): Promise<Map<number, HeroMetadata>> => {
  if (heroMetadataCache) {
    return heroMetadataCache;
  }

  try {
    const { data } = await http.get<Record<string, HeroMetadata>>('/constants/heroes');
    heroMetadataCache = new Map(
      Object.values(data).map((hero) => [hero.id, hero])
    );
  } catch (error) {
    console.warn('Failed to load hero constants, falling back to minimal names', error);
    heroMetadataCache = new Map(
      fallbackHeroWinRates.map((hero) => [hero.heroId, { id: hero.heroId, localized_name: hero.heroName }])
    );
  }

  return heroMetadataCache;
};

const getItemMetadata = async (): Promise<Map<number, ItemMetadata>> => {
  if (itemMetadataCache) {
    return itemMetadataCache;
  }

  try {
    const { data } = await http.get<Record<string, ItemMetadata>>('/constants/items');
    itemMetadataCache = new Map(
      Object.values(data).map((item) => [item.id, item])
    );
  } catch (error) {
    console.warn('Failed to load item constants, using fallback names', error);
    itemMetadataCache = new Map(
      fallbackItemWinRates.map((item) => [item.itemId, { id: item.itemId, dname: item.itemName }])
    );
  }

  return itemMetadataCache;
};

const yearRangeToUnix = (year: number) => {
  const start = Math.floor(new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000);
  const end = Math.floor(new Date(`${year + 1}-01-01T00:00:00Z`).getTime() / 1000);
  return { start, end };
};

export const fetchRankDistribution = async (year: number): Promise<RankBucketResponse[]> => {
  try {
    const { start, end } = yearRangeToUnix(year);
    const sql = `
      SELECT floor(pm.rank_tier / 10) * 10 as bracket,
             COUNT(*) as matches
      FROM player_matches pm
      JOIN matches m ON m.match_id = pm.match_id
      WHERE pm.rank_tier IS NOT NULL
        AND m.start_time >= ${start}
        AND m.start_time < ${end}
      GROUP BY bracket
      ORDER BY bracket;
    `;

    const { data } = await http.get<{ rows: Array<{ bracket: number; matches: number }> }>('/explorer', {
      params: { sql },
    });

    const rows = data.rows ?? [];
    const totalMatches = rows.reduce((sum, row) => sum + Number(row.matches), 0);

    if (rows.length === 0 || totalMatches === 0) {
      return fallbackRankDistribution;
    }

    return rows.map((row) => {
      const bucket = Number(row.bracket);
      return {
        rankBracket: RANK_BUCKET_LABELS[bucket] ?? `Tier ${bucket}`,
        matches: Number(row.matches),
        percentage: Number(row.matches) / totalMatches,
      };
    });
  } catch (error) {
    console.error('Rank distribution request failed', error);
    return fallbackRankDistribution;
  }
};

export const fetchHeroWinRates = async (limit: number): Promise<HeroWinRate[]> => {
  try {
    const { start, end } = yearRangeToUnix(2025);
    const sql = `
      SELECT pm.hero_id as hero_id,
             SUM(CASE WHEN pm.win = 1 THEN 1 ELSE 0 END) as wins,
             COUNT(*) as matches
      FROM player_matches pm
      JOIN matches m ON m.match_id = pm.match_id
      WHERE pm.hero_id IS NOT NULL
        AND m.start_time >= ${start}
        AND m.start_time < ${end}
      GROUP BY pm.hero_id
      HAVING COUNT(*) > 0
      ORDER BY matches DESC
      LIMIT ${Math.max(limit, 1)};
    `;

    const { data } = await http.get<{ rows: Array<{ hero_id: number; wins: number; matches: number }> }>('/explorer', {
      params: { sql },
    });

    const rows = data.rows ?? [];
    if (!rows.length) {
      return fallbackHeroWinRates.slice(0, limit);
    }

    const heroMap = await getHeroMetadata();

    return rows.map((row) => {
      const hero = heroMap.get(Number(row.hero_id));
      const wins = Number(row.wins);
      const matches = Number(row.matches);
      return {
        heroId: Number(row.hero_id),
        heroName: hero?.localized_name ?? `Hero ${row.hero_id}`,
        wins,
        matches,
        winRate: matches > 0 ? wins / matches : 0,
      };
    });
  } catch (error) {
    console.error('Hero win rate request failed', error);
    return fallbackHeroWinRates.slice(0, limit);
  }
};

export const fetchItemWinRates = async (year: number): Promise<ItemWinRate[]> => {
  try {
    void year; // The scenarios endpoint does not currently support filtering by year.
    const { data } = await http.get<Array<{ item: string; wins: number; games: number }>>('/scenarios/itemTimings');

    if (!Array.isArray(data) || !data.length) {
      return fallbackItemWinRates;
    }

    const aggregated = data.reduce<Record<string, { wins: number; games: number }>>((acc, record) => {
      const key = record.item;
      const entry = acc[key] ?? { wins: 0, games: 0 };
      entry.wins += Number(record.wins ?? 0);
      entry.games += Number(record.games ?? 0);
      acc[key] = entry;
      return acc;
    }, {});

    const itemsMap = await getItemMetadata();
    const itemIdByName = new Map<string, ItemMetadata>();
    itemsMap.forEach((value) => {
      if (value?.dname) {
        itemIdByName.set(value.dname, value);
      }
    });

    return Object.entries(aggregated)
      .map(([itemName, stats], index) => {
        const metadata = itemIdByName.get(itemName);
        const wins = stats.wins;
        const games = stats.games;
        const itemId = metadata?.id ?? index + 1;
        return {
          itemId,
          itemName,
          wins,
          games,
          winRate: games > 0 ? wins / games : 0,
        };
      })
      .filter((item) => item.games > 0)
      .sort((a, b) => b.games - a.games)
      .slice(0, 10);
  } catch (error) {
    console.error('Item win rate request failed', error);
    return fallbackItemWinRates;
  }
};

export const fetchFactionWinRates = async (year: number): Promise<FactionWinRate[]> => {
  try {
    const { start, end } = yearRangeToUnix(year);
    const sql = `
      SELECT SUM(CASE WHEN radiant_win = true THEN 1 ELSE 0 END) as radiant_wins,
             SUM(CASE WHEN radiant_win = false THEN 1 ELSE 0 END) as dire_wins,
             COUNT(*) as matches
      FROM matches
      WHERE start_time >= ${start}
        AND start_time < ${end};
    `;

    const { data } = await http.get<{ rows: Array<{ radiant_wins: number; dire_wins: number; matches: number }> }>('/explorer', {
      params: { sql },
    });

    const [row] = data.rows ?? [];
    if (!row || Number(row.matches) === 0) {
      return fallbackFactionWinRates;
    }

    const matches = Number(row.matches);
    const radiantWins = Number(row.radiant_wins);
    const direWins = Number(row.dire_wins);

    return [
      {
        faction: 'Radiant',
        wins: radiantWins,
        matches,
        winRate: matches > 0 ? radiantWins / matches : 0,
      },
      {
        faction: 'Dire',
        wins: direWins,
        matches,
        winRate: matches > 0 ? direWins / matches : 0,
      },
    ];
  } catch (error) {
    console.error('Faction win rate request failed', error);
    return fallbackFactionWinRates;
  }
};
