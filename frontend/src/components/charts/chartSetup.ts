import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

let isRegistered = false;

export const ensureChartSetup = () => {
  if (isRegistered) {
    return;
  }

  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Legend, Tooltip, Filler);
  isRegistered = true;
};
