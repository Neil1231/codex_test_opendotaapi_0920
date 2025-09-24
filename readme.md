# 2025 全球 Dota 2 天梯数据分析平台

本项目提供一个基于 **Vue 3 + TypeScript** 前端与 **Node.js (Express + TypeScript)** 后端的完整解决方案，通过调用 OpenDota API 构建 2025 年全球天梯数据分析看板。项目支持 Rank 分段、英雄胜率、装备胜率以及天辉/夜魇阵营胜率等多维度可视化展示。

## 项目结构

```
.
├── server      # Node.js + Express 后端服务，封装 OpenDota 数据聚合
└── frontend    # Vue 3 + Vite 前端单页应用，使用 Chart.js 做可视化
```

## 功能亮点

- **Rank 分布**：通过 SQL Explorer 聚合 Rank Tier 对局量，输出百分比分布图。
- **英雄胜率 Top 10**：基于年度对局统计计算高热度英雄胜率。
- **热门装备胜率**：聚合 OpenDota 场景数据，展示热门装备的胜率表现。
- **天辉 vs 夜魇**：比较阵营胜率与胜场，评估整体平衡度。
- **失败兜底机制**：当外部 API 异常时自动回落到预置数据，保证平台可用性。

## 快速开始

### 后端

```bash
cd server
npm install
npm run dev
```

默认监听 `http://localhost:3000`，提供 `/api` 下的聚合接口，可通过 `OPENDOTA_BASE_URL` 环境变量自定义 OpenDota 节点。

### 前端

```bash
cd frontend
npm install
npm run dev
```

Vite 开发服务器默认运行在 `http://localhost:5173`，并通过代理转发 `/api` 请求到本地后端。

### 生产构建

```bash
# 构建后端
cd server
npm run build

# 构建前端
cd ../frontend
npm run build
```

构建完成后，可根据自身部署策略将 `frontend/dist` 产物交付至静态托管平台，后端 `server/dist` 则用于 Node 进程部署。

## 注意事项

- 项目未强制使用数据库，所有统计由 OpenDota API 实时提供，可按需加入缓存或落地。
- 若运行环境无法访问 OpenDota，页面会展示兜底数据与提示，便于在离线环境演示。
- 可在前端 `.env` 中自定义 `VITE_API_BASE_URL`，支持部署到不同主机或云环境。

欢迎扩展更多统计维度或接入企业内部 BI 平台。
