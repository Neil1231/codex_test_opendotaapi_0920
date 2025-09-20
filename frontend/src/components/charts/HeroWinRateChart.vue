<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  <div v-else class="chart-loading">加载英雄数据中...</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import { ensureChartSetup } from './chartSetup';

type HeroWinRate = {
  heroId: number;
  heroName: string;
  matches: number;
  wins: number;
  winRate: number;
};

const props = defineProps<{ data: HeroWinRate[] | null }>();

ensureChartSetup();

const chartData = ref<ChartData<'bar'>>();

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: '#c7d5ff',
        callback: (value) => `${Number(value) * 100}%`,
      },
      grid: { color: 'rgba(255,255,255,0.08)' },
    },
    y: {
      ticks: { color: '#c7d5ff' },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => {
          const winRate = context.parsed.x * 100;
          const wins = props.data?.[context.dataIndex]?.wins ?? 0;
          const matches = props.data?.[context.dataIndex]?.matches ?? 0;
          return `胜率 ${winRate.toFixed(2)}% · ${wins.toLocaleString()} 胜 / ${matches.toLocaleString()} 场`;
        },
      },
    },
  },
};

const buildChartData = (dataset: HeroWinRate[]): ChartData<'bar'> => ({
  labels: dataset.map((item) => item.heroName),
  datasets: [
    {
      label: '胜率',
      data: dataset.map((item) => item.winRate),
      backgroundColor: 'rgba(107, 92, 255, 0.75)',
      borderRadius: 12,
      barThickness: 22,
    },
  ],
});

watch(
  () => props.data,
  (value) => {
    if (value) {
      chartData.value = buildChartData(value);
    }
  },
  { immediate: true }
);
</script>
