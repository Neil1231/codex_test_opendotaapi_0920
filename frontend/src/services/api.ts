import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
});

type RankDistribution = {
  rankBracket: string;
  matches: number;
  percentage: number;
};

type HeroWinRate = {
  heroId: number;
  heroName: string;
  matches: number;
  wins: number;
  winRate: number;
};

type ItemWinRate = {
  itemId: number;
  itemName: string;
  wins: number;
  games: number;
  winRate: number;
};

type FactionWinRate = {
  faction: 'Radiant' | 'Dire';
  wins: number;
  matches: number;
  winRate: number;
};

export const fetchRankDistribution = async (year: number) => {
  const { data } = await apiClient.get<{ data: RankDistribution[] }>(`/rank-distribution`, {
    params: { year },
  });
  return data.data;
};

export const fetchHeroWinRates = async (limit: number) => {
  const { data } = await apiClient.get<{ data: HeroWinRate[] }>(`/hero-winrates`, {
    params: { limit },
  });
  return data.data;
};

export const fetchItemWinRates = async (year: number) => {
  const { data } = await apiClient.get<{ data: ItemWinRate[] }>(`/item-winrates`, {
    params: { year },
  });
  return data.data;
};

export const fetchFactionWinRates = async (year: number) => {
  const { data } = await apiClient.get<{ data: FactionWinRate[] }>(`/faction-winrates`, {
    params: { year },
  });
  return data.data;
};

export type { RankDistribution, HeroWinRate, ItemWinRate, FactionWinRate };
