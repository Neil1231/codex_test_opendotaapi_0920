import express from 'express';
import cors from 'cors';
import analyticsRouter from './routes/analytics.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', analyticsRouter);

app.listen(port, () => {
  console.log(`Dota 2025 analytics server listening on port ${port}`);
});
