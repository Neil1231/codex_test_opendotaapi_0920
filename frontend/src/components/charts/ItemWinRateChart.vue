<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  <div v-else class="chart-loading">加载装备数据中...</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import { ensureChartSetup } from './chartSetup';

type ItemWinRate = {
  itemId: number;
  itemName: string;
  wins: number;
  games: number;
  winRate: number;
};

const props = defineProps<{ data: ItemWinRate[] | null }>();

ensureChartSetup();

const chartData = ref<ChartData<'bar'>>();

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: '#c7d5ff', autoSkip: false, maxRotation: 35, minRotation: 15 },
      grid: { color: 'rgba(255,255,255,0.08)' },
    },
    y: {
      ticks: {
        color: '#c7d5ff',
        callback: (value) => `${Number(value) * 100}%`,
      },
      grid: { color: 'rgba(255,255,255,0.08)' },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => {
          const winRate = context.parsed.y * 100;
          const item = props.data?.[context.dataIndex];
          if (!item) {
            return `胜率 ${winRate.toFixed(2)}%`;
          }
          return `胜率 ${winRate.toFixed(2)}% · ${item.wins.toLocaleString()} 胜 / ${item.games.toLocaleString()} 场`;
        },
      },
    },
  },
};

const buildChartData = (dataset: ItemWinRate[]): ChartData<'bar'> => ({
  labels: dataset.map((item) => item.itemName),
  datasets: [
    {
      label: '胜率',
      data: dataset.map((item) => item.winRate),
      backgroundColor: 'rgba(43, 196, 180, 0.75)',
      borderRadius: 12,
      maxBarThickness: 44,
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
