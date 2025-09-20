<template>
  <section class="chart-card">
    <header class="chart-card__header">
      <h2>{{ title }}</h2>
      <slot name="actions" />
    </header>
    <div class="chart-card__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chart-card__header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.chart-card__content {
  min-height: 280px;
}
</style>
