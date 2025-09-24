<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>2025 全球 Dota 2 天梯数据分析平台</h1>
      <p class="subtitle">
        基于 OpenDota API 的实时统计，覆盖分段、英雄、装备与阵营多维度表现。
      </p>
    </header>
    <main class="app-content">
      <DashboardView />
    </main>
    <footer class="app-footer">
      <small>数据来源：OpenDota API · 支持通过后端代理配置企业级缓存。</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import DashboardView from './views/DashboardView.vue';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #040814 0%, #101b3a 100%);
  color: #f2f5ff;
}

.app-header {
  padding: 2.5rem 1.5rem 1.5rem;
  text-align: center;
}

.app-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.subtitle {
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.78);
}

.app-content {
  flex: 1;
  padding: 0 1.5rem 2rem;
}

.app-footer {
  padding: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}
</style>
