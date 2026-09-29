/**
 * Módulo de Gráficas 2D (Chart.js Controller)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.charts = (function() {
  let chartInstance = null;

  function renderChart(data) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const canvas = document.getElementById('vizChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isRadar = data.vizType === 'radar';

    const config = {
      type: data.vizType,
      data: JSON.parse(JSON.stringify(data.chartData)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            labels: { 
              color: '#cbd5e1', 
              font: { family: 'Inter', size: 12, weight: 600 },
              boxWidth: 14,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { family: 'Outfit', size: 13, weight: 700 },
            bodyFont: { family: 'Inter', size: 12 },
            borderColor: 'rgba(0, 242, 254, 0.4)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: isRadar ? {
          r: {
            grid: { color: 'rgba(255, 255, 255, 0.12)' },
            angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
            pointLabels: { color: '#cbd5e1', font: { family: 'Outfit', size: 12, weight: 600 } },
            ticks: { color: '#64748b', backdropColor: 'transparent' }
          }
        } : {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          }
        }
      }
    };

    chartInstance = new Chart(ctx, config);
    return chartInstance;
  }

  function refreshChartData(data) {
    if (data?.chartData && chartInstance) {
      data.chartData.datasets.forEach(ds => {
        ds.data = ds.data.map(v => typeof v === 'number' ? Math.round(v * (0.92 + Math.random() * 0.16)) : v);
      });
      chartInstance.update();
    }
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  return {
    renderChart,
    refreshChartData,
    destroyChart
  };
})();
