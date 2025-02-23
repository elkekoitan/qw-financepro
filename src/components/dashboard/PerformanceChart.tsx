'use client';

import { useState } from 'react';
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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  date: string;
  value: number;
}

export default function PerformanceChart() {
  const [loading] = useState(false);
  const [period, setPeriod] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1M');

  // TODO: Bu veriler portfolio context'ten gelecek
  const chartData: ChartData[] = [
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-08', value: 102500 },
    { date: '2024-01-15', value: 101800 },
    { date: '2024-01-22', value: 103200 },
    { date: '2024-01-29', value: 105000 },
    { date: '2024-02-05', value: 104200 },
    { date: '2024-02-12', value: 106800 },
    { date: '2024-02-19', value: 108500 },
    { date: '2024-02-26', value: 107900 },
    { date: '2024-03-04', value: 110000 },
  ];

  const data = {
    labels: chartData.map(item => new Date(item.date).toLocaleDateString('tr-TR')),
    datasets: [
      {
        label: 'Portföy Değeri',
        data: chartData.map(item => item.value),
        fill: true,
        borderColor: '#4FD1C5',
        backgroundColor: 'rgba(79, 209, 197, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1A2C2C',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2D3748',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toLocaleString('tr-TR')} TL`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#718096',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#2D3748',
          drawBorder: false,
        },
        ticks: {
          color: '#718096',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return value.toLocaleString('tr-TR') + ' TL';
          }
        }
      }
    }
  };

  const periods = [
    { value: '1W', label: '1 Hafta' },
    { value: '1M', label: '1 Ay' },
    { value: '3M', label: '3 Ay' },
    { value: '6M', label: '6 Ay' },
    { value: '1Y', label: '1 Yıl' }
  ];

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Performans Grafiği</h2>
        <div className="flex space-x-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                period === p.value
                  ? 'bg-primary text-white'
                  : 'bg-dark text-gray-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
} 