<template>
  <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
  <div v-else class="chart-loading">加载阵营胜率数据中...</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import { ensureChartSetup } from './chartSetup';

type FactionWinRate = {
  faction: 'Radiant' | 'Dire';
  wins: number;
  matches: number;
  winRate: number;
};

const props = defineProps<{ data: FactionWinRate[] | null }>();

ensureChartSetup();

const chartData = ref<ChartData<'doughnut'>>();

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#e2e7ff',
        padding: 18,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const rate = context.parsed * 100;
          const dataset = props.data ?? [];
          const faction = dataset[context.dataIndex];
          if (!faction) {
            return `${context.label}: ${rate.toFixed(2)}%`;
          }
          return `${context.label}: ${rate.toFixed(2)}% · ${faction.wins.toLocaleString()} 胜`;
        },
      },
    },
  },
  cutout: '60%',
};

const buildChartData = (dataset: FactionWinRate[]): ChartData<'doughnut'> => ({
  labels: dataset.map((item) => (item.faction === 'Radiant' ? '天辉' : '夜魇')),
  datasets: [
    {
      data: dataset.map((item) => item.winRate),
      backgroundColor: ['rgba(92, 197, 255, 0.85)', 'rgba(255, 120, 120, 0.85)'],
      borderWidth: 2,
      hoverBorderWidth: 2,
      hoverBorderColor: '#ffffff',
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
