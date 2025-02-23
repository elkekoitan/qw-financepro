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
import { useInvestment } from '@/contexts/InvestmentContext';

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

export default function InvestmentChart() {
  const { investments, loading } = useInvestment();
  const [period, setPeriod] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1M');

  // Yatırımları tarihe göre sırala
  const sortedInvestments = [...investments].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  // Kümülatif değerleri hesapla
  const cumulativeData = sortedInvestments.reduce((acc, investment) => {
    const lastValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
    const value = investment.price.multiply(investment.quantity).getValue().amount;
    acc.push({
      date: investment.date,
      value: lastValue + value
    });
    return acc;
  }, [] as { date: Date; value: number }[]);

  const chartData = {
    labels: cumulativeData.map(item => item.date.toLocaleDateString('tr-TR')),
    datasets: [
      {
        label: 'Toplam Yatırım',
        data: cumulativeData.map(item => item.value),
        fill: true,
        borderColor: '#4FD1C5',
        backgroundColor: 'rgba(79, 209, 197, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
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
            return context.parsed.y.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            });
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
            return value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            });
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
        <h2 className="text-xl font-semibold text-white">Yatırım Grafiği</h2>
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
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {/* İstatistikler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-dark rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400">Toplam Yatırım</h3>
          <p className="text-lg font-semibold text-white">
            {cumulativeData[cumulativeData.length - 1]?.value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })}
          </p>
        </div>
        <div className="bg-dark rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400">Toplam Getiri</h3>
          <p className="text-lg font-semibold text-green-400">
            +15.5%
          </p>
        </div>
        <div className="bg-dark rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400">Aktif Yatırım</h3>
          <p className="text-lg font-semibold text-white">
            {investments.length} Adet
          </p>
        </div>
        <div className="bg-dark rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400">Son İşlem</h3>
          <p className="text-lg font-semibold text-white">
            {sortedInvestments[sortedInvestments.length - 1]?.date.toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>
    </div>
  );
} 