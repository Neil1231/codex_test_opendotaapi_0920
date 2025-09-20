<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  <div v-else class="chart-loading">加载数据中...</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import { ensureChartSetup } from './chartSetup';

type RankDistribution = {
  rankBracket: string;
  matches: number;
  percentage: number;
};

defineProps<{ data: RankDistribution[] | null }>();

ensureChartSetup();

const props = defineProps<{ data: RankDistribution[] | null }>();
const chartData = ref<ChartData<'bar'>>();

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: '#c7d5ff' },
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
          const percentage = context.parsed.y * 100;
          const matches = props.data?.[context.dataIndex]?.matches ?? 0;
          return `占比 ${percentage.toFixed(2)}% · 对局 ${matches.toLocaleString()}`;
        },
      },
    },
  },
};

const buildChartData = (data: RankDistribution[]) =>
  ({
    labels: data.map((item) => item.rankBracket),
    datasets: [
      {
        label: '占比',
        data: data.map((item) => item.percentage),
        backgroundColor: 'rgba(56, 115, 255, 0.65)',
        borderRadius: 12,
        maxBarThickness: 48,
      },
    ],
  }) satisfies ChartData<'bar'>;

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
