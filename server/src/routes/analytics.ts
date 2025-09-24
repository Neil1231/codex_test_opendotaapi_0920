import { Router } from 'express';
import {
  fetchFactionWinRates,
  fetchHeroWinRates,
  fetchItemWinRates,
  fetchRankDistribution,
} from '../services/openDotaService.js';

const router = Router();

router.get('/rank-distribution', async (req, res) => {
  try {
    const year = Number.parseInt((req.query.year as string) ?? '2025', 10);
    const data = await fetchRankDistribution(year);
    res.json({ year, data });
  } catch (error) {
    console.error('Rank distribution error', error);
    res.status(500).json({ message: 'Failed to load rank distribution' });
  }
});

router.get('/hero-winrates', async (req, res) => {
  try {
    const limit = Number.parseInt((req.query.limit as string) ?? '10', 10);
    const data = await fetchHeroWinRates(limit);
    res.json({ limit, data });
  } catch (error) {
    console.error('Hero win rate error', error);
    res.status(500).json({ message: 'Failed to load hero win rates' });
  }
});

router.get('/item-winrates', async (req, res) => {
  try {
    const year = Number.parseInt((req.query.year as string) ?? '2025', 10);
    const data = await fetchItemWinRates(year);
    res.json({ year, data });
  } catch (error) {
    console.error('Item win rate error', error);
    res.status(500).json({ message: 'Failed to load item win rates' });
  }
});

router.get('/faction-winrates', async (req, res) => {
  try {
    const year = Number.parseInt((req.query.year as string) ?? '2025', 10);
    const data = await fetchFactionWinRates(year);
    res.json({ year, data });
  } catch (error) {
    console.error('Faction win rate error', error);
    res.status(500).json({ message: 'Failed to load faction win rates' });
  }
});

export default router;
