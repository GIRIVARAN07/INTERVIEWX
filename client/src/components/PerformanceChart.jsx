/**
 * PerformanceChart Component
 * --------------------------
 * Line chart showing user's score history over time using Chart.js.
 */

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PerformanceChart({ attempts }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No attempt data to display yet. Take an interview to see your performance chart!</p>
      </div>
    );
  }

  // Sort attempts by date (oldest first) and take last 15
  const sorted = [...attempts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(-15);

  const labels = sorted.map((a) => {
    const d = new Date(a.createdAt);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Score %',
        data: sorted.map((a) => a.score),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#e0e7ff',
        bodyColor: '#c7d2fe',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => `Score: ${ctx.parsed.y}%`,
          title: (items) => {
            const a = sorted[items[0].dataIndex];
            return `${a.type} • ${a.difficulty}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        ticks: { color: '#94a3b8', callback: (v) => `${v}%` },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="glass-card p-6" id="performance-chart">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Performance Trend</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
