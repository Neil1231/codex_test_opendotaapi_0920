<template>
  <div class="dashboard-grid">
    <ChartCard title="Rank 天梯分段占比">
      <template v-if="rankState.loading">
        <div class="chart-loading">分段数据加载中...</div>
      </template>
      <template v-else-if="rankState.error">
        <div class="chart-error">{{ rankState.error }}</div>
      </template>
      <template v-else>
        <RankDistributionChart :data="rankState.data" />
      </template>
    </ChartCard>

    <ChartCard title="高热度英雄胜率 Top 10">
      <template v-if="heroState.loading">
        <div class="chart-loading">英雄数据加载中...</div>
      </template>
      <template v-else-if="heroState.error">
        <div class="chart-error">{{ heroState.error }}</div>
      </template>
      <template v-else>
        <HeroWinRateChart :data="heroState.data" />
      </template>
    </ChartCard>

    <ChartCard title="热门核心装备胜率">
      <template v-if="itemState.loading">
        <div class="chart-loading">装备数据加载中...</div>
      </template>
      <template v-else-if="itemState.error">
        <div class="chart-error">{{ itemState.error }}</div>
      </template>
      <template v-else>
        <ItemWinRateChart :data="itemState.data" />
      </template>
    </ChartCard>

    <ChartCard title="天辉 vs 夜魇 胜率对比">
      <template v-if="factionState.loading">
        <div class="chart-loading">阵营数据加载中...</div>
      </template>
      <template v-else-if="factionState.error">
        <div class="chart-error">{{ factionState.error }}</div>
      </template>
      <template v-else>
        <FactionWinRateChart :data="factionState.data" />
      </template>
    </ChartCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import ChartCard from '../components/ChartCard.vue';
import RankDistributionChart from '../components/charts/RankDistributionChart.vue';
import HeroWinRateChart from '../components/charts/HeroWinRateChart.vue';
import ItemWinRateChart from '../components/charts/ItemWinRateChart.vue';
import FactionWinRateChart from '../components/charts/FactionWinRateChart.vue';
import {
  fetchFactionWinRates,
  fetchHeroWinRates,
  fetchItemWinRates,
  fetchRankDistribution,
  type FactionWinRate,
  type HeroWinRate,
  type ItemWinRate,
  type RankDistribution,
} from '../services/api';

type LoadingState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const year = 2025;

const rankState = reactive<LoadingState<RankDistribution[]>>({
  data: null,
  loading: true,
  error: null,
});

const heroState = reactive<LoadingState<HeroWinRate[]>>({
  data: null,
  loading: true,
  error: null,
});

const itemState = reactive<LoadingState<ItemWinRate[]>>({
  data: null,
  loading: true,
  error: null,
});

const factionState = reactive<LoadingState<FactionWinRate[]>>({
  data: null,
  loading: true,
  error: null,
});

const loadRankDistribution = async () => {
  rankState.loading = true;
  rankState.error = null;
  try {
    rankState.data = await fetchRankDistribution(year);
  } catch (error) {
    console.error(error);
    rankState.error = '无法获取分段统计数据';
  } finally {
    rankState.loading = false;
  }
};

const loadHeroWinRates = async () => {
  heroState.loading = true;
  heroState.error = null;
  try {
    heroState.data = await fetchHeroWinRates(10);
  } catch (error) {
    console.error(error);
    heroState.error = '无法获取英雄胜率数据';
  } finally {
    heroState.loading = false;
  }
};

const loadItemWinRates = async () => {
  itemState.loading = true;
  itemState.error = null;
  try {
    itemState.data = await fetchItemWinRates(year);
  } catch (error) {
    console.error(error);
    itemState.error = '无法获取装备胜率数据';
  } finally {
    itemState.loading = false;
  }
};

const loadFactionWinRates = async () => {
  factionState.loading = true;
  factionState.error = null;
  try {
    factionState.data = await fetchFactionWinRates(year);
  } catch (error) {
    console.error(error);
    factionState.error = '无法获取阵营胜率数据';
  } finally {
    factionState.loading = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadRankDistribution(),
    loadHeroWinRates(),
    loadItemWinRates(),
    loadFactionWinRates(),
  ]);
});
</script>
