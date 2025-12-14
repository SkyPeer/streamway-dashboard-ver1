import 'chartjs-adapter-date-fns';

import { Scatter } from 'react-chartjs-2';
import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const ScatterChartWithDateLegend = () => {
  // Define date ranges for legend filtering
  const dateRanges = {
    'Last 7 Days': {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
      color: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)'
    },
    'Last 30 Days': {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      color: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)'
    },
    'Last 90 Days': {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      color: 'rgba(255, 206, 86, 0.8)',
      borderColor: 'rgba(255, 206, 86, 1)'
    },
    'Older': {
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      color: 'rgba(75, 192, 192, 0.8)',
      borderColor: 'rgba(75, 192, 192, 1)'
    }
  };

  // State for active date ranges
  const [activeDateRanges, setActiveDateRanges] = useState(
    Object.keys(dateRanges).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // Generate sample data with dates
  const generateSampleData = () => {
    const data = [];
    const now = Date.now();

    // Generate data points across different time periods
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.random() * 365;
      const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const value = Math.random() * 100 + Math.sin(daysAgo / 30) * 20;

      data.push({
        x: date,
        y: value,
        originalDate: date
      });
    }

    return data.sort((a, b) => a.x - b.x);
  };

  const allData = useMemo(() => generateSampleData(), []);

  // Filter and categorize data based on active date ranges
  const chartData = useMemo(() => {
    const datasets = [];

    Object.entries(dateRanges).forEach(([rangeName, range]) => {
      if (!activeDateRanges[rangeName]) return;

      const filteredData = allData.filter(point => {
        return point.x >= range.start && point.x <= range.end;
      });

      if (filteredData.length > 0) {
        datasets.push({
          label: `${rangeName} (${filteredData.length} points)`,
          data: filteredData,
          backgroundColor: range.color,
          borderColor: range.borderColor,
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        });
      }
    });

    return { datasets };
  }, [allData, activeDateRanges]);

  // Custom legend click handler
  const handleLegendClick = (event, legendItem, legend) => {
    // Extract the range name from the label
    const labelText = legendItem.text;
    const rangeName = Object.keys(dateRanges).find(key =>
      labelText.includes(key)
    );

    if (rangeName) {
      setActiveDateRanges(prev => ({
        ...prev,
        [rangeName]: !prev[rangeName]
      }));
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Data Points Over Time - Filter by Date Ranges',
        font: { size: 18 }
      },
      legend: {
        display: true,
        position: 'top',
        onClick: handleLegendClick,
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            return Object.entries(dateRanges).map(([rangeName, range], index) => {
              const isActive = activeDateRanges[rangeName];
              const dataCount = allData.filter(point =>
                point.x >= range.start && point.x <= range.end
              ).length;

              return {
                text: `${rangeName} (${dataCount} points)`,
                fillStyle: isActive ? range.color : 'rgba(200, 200, 200, 0.3)',
                strokeStyle: isActive ? range.borderColor : 'rgba(200, 200, 200, 0.5)',
                lineWidth: 2,
                pointStyle: 'circle',
                hidden: !isActive,
                datasetIndex: index
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const point = context[0];
            return point.dataset.label;
          },
          label: function(context) {
            const date = new Date(context.parsed.x);
            return [
              `Date: ${date.toLocaleDateString()}`,
              `Value: ${context.parsed.y.toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  };

  // Calculate date range statistics
  const getDateRangeStats = () => {
    return Object.entries(dateRanges).map(([rangeName, range]) => {
      const filteredData = allData.filter(point =>
        point.x >= range.start && point.x <= range.end
      );

      const values = filteredData.map(point => point.y);
      const avgValue = values.length > 0 ?
        (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0';
      const maxValue = values.length > 0 ? Math.max(...values).toFixed(2) : '0';
      const minValue = values.length > 0 ? Math.min(...values).toFixed(2) : '0';

      return {
        rangeName,
        count: filteredData.length,
        avgValue,
        maxValue,
        minValue,
        isActive: activeDateRanges[rangeName],
        color: range.color,
        startDate: range.start.toLocaleDateString(),
        endDate: range.end.toLocaleDateString()
      };
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Scatter Chart with Date-Based Legend Filtering
        </h1>

        {/* Chart Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="relative" style={{ height: '500px' }}>
            <Scatter data={chartData} options={options} />
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Date Range Controls
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.keys(dateRanges).map((rangeName) => (
              <button
                key={rangeName}
                onClick={() => setActiveDateRanges(prev => ({
                  ...prev,
                  [rangeName]: !prev[rangeName]
                }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDateRanges[rangeName]
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rangeName}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Date Range Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getDateRangeStats().map((stats, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  stats.isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: stats.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-800">{stats.rangeName}</h3>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div>Period: <span className="font-medium text-xs">{stats.startDate} - {stats.endDate}</span></div>
                  <div>Data Points: <span className="font-medium">{stats.count}</span></div>
                  <div>Average: <span className="font-medium">{stats.avgValue}</span></div>
                  <div>Range: <span className="font-medium">{stats.minValue} - {stats.maxValue}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-green-100 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">How Legend as Date Filter Works:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Legend items represent different date ranges with data counts</li>
            <li>• Click legend items to show/hide data from specific time periods</li>
            <li>• X-axis uses time scale to properly display dates</li>
            <li>• Data is automatically filtered and grouped by date ranges</li>
            <li>• Statistics update in real-time based on active date ranges</li>
            <li>• Use control buttons below chart for quick toggle of all ranges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScatterChartWithDateLegend;