/**
 * Módulo de Gráficas 2D Multidimensionales (Chart.js Controller)
 * Vistas 2 (Datos.gob.mx), 3 (SIEGY Yucatán), 5 (Transparencia PNT), 7 (UPY Encuesta)
 * Plataforma Data Storytelling • UPY
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.charts = (function() {
  let chartInstance = null;

  function renderChart(data) {
    destroyChart();

    const canvas = document.getElementById('vizChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isRadar = data.vizType === 'radar';
    const isBar = data.vizType === 'bar';

    // Personalización de opciones avanzadas
    const config = {
      type: data.vizType,
      data: JSON.parse(JSON.stringify(data.chartData)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { 
              color: '#cbd5e1', 
              font: { family: 'Outfit', size: 12, weight: 600 },
              boxWidth: 14,
              boxHeight: 14,
              borderRadius: 3,
              useBorderRadius: true,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(13, 20, 38, 0.95)',
            titleFont: { family: 'Outfit', size: 13, weight: 700 },
            bodyFont: { family: 'Inter', size: 12 },
            borderColor: 'rgba(0, 242, 254, 0.5)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null && context.parsed.y !== undefined) {
                  label += context.parsed.y + (data.number === 2 || data.number === 5 || data.number === 7 ? '%' : ' unidades');
                } else if (context.parsed.r !== null && context.parsed.r !== undefined) {
                  label += context.parsed.r + ' pts / 100';
                }
                return label;
              }
            }
          }
        },
        scales: isRadar ? {
          r: {
            min: 50,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.12)' },
            angleLines: { color: 'rgba(0, 242, 254, 0.25)' },
            pointLabels: { 
              color: '#e2e8f0', 
              font: { family: 'Outfit', size: 11, weight: 600 } 
            },
            ticks: { 
              color: '#94a3b8', 
              backdropColor: 'transparent',
              stepSize: 10
            }
          }
        } : {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { 
              color: '#cbd5e1', 
              font: { family: 'Outfit', size: 11, weight: 500 } 
            }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { 
              color: '#94a3b8', 
              font: { family: 'Inter', size: 11 },
              callback: function(value) {
                return (data.number === 2 || data.number === 5 || data.number === 7) ? value + '%' : value;
              }
            }
          }
        }
      }
    };

    chartInstance = new Chart(ctx, config);
    return chartInstance;
  }

  function filterWaveDataset(waveType) {
    if (!chartInstance) return;

    if (waveType === 'wave1') {
      chartInstance.data.datasets[0].data = [74.2, null, null, null, null];
      chartInstance.data.datasets[1].data = [0.0, null, null, null, null];
    } else if (waveType === 'waveVac') {
      chartInstance.data.datasets[0].data = [74.2, 79.8, 86.4, null, null];
      chartInstance.data.datasets[1].data = [0.0, 8.5, 62.4, null, null];
    } else {
      chartInstance.data.datasets[0].data = [74.2, 79.8, 86.4, 96.8, 99.1];
      chartInstance.data.datasets[1].data = [0.0, 8.5, 62.4, 88.6, 94.2];
    }
    chartInstance.update();

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Fase epidemiológica filtrada: ${waveType}`);
  }

  function filterJurisdiction(idx) {
    if (!chartInstance || !chartInstance.data.datasets) return;

    chartInstance.data.datasets.forEach((ds, i) => {
      ds.hidden = (idx !== 'all' && i !== idx);
    });
    chartInstance.update();

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(idx === 'all' ? "Comparando las 3 Jurisdicciones" : `Enfocando Jurisdicción ${idx + 1}`);
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  return {
    renderChart,
    filterWaveDataset,
    filterJurisdiction,
    destroyChart
  };
})();
