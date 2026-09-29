/**
 * App Coordinator & Main Controller
 * Plataforma de Data Storytelling: El Viaje de la Resiliencia (UPY)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.app = (function() {
  let currentStep = 1;

  function init() {
    setupAppEvents();
    switchView(1);
    setupKeyboardNavigation();
  }

  function switchView(step) {
    if (document.startViewTransition) {
      document.startViewTransition(() => executeViewChange(step));
    } else {
      executeViewChange(step);
    }
  }

  function executeViewChange(step) {
    const storytelling = window.DataStoryApp.storytelling;
    const viewsData = window.DataStoryApp.viewsData;
    const charts = window.DataStoryApp.charts;
    const gisMap = window.DataStoryApp.gisMap;
    const forceGraph = window.DataStoryApp.forceGraph;
    const threeVisuals = window.DataStoryApp.threeVisuals;

    if (storytelling) storytelling.stopAudioNarration();

    currentStep = step;
    const data = viewsData ? viewsData[step] : null;
    if (!data) return;

    // Actualizar Journey Arc Stepper
    updateJourneyArc(data);

    // Actualizar Tabs Nav
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
      btn.classList.toggle('active', index + 1 === step);
    });

    // Progreso
    const progressBar = document.getElementById('progressBarFill');
    if (progressBar) {
      progressBar.style.width = `${(step / 9) * 100}%`;
    }

    // Banners de Fuentes
    const isTech = step >= 8;
    const primaryBadge = document.getElementById('primarySourceBadge');
    if (primaryBadge) {
      primaryBadge.className = isTech ? "badge-pill badge-ar" : "badge-pill badge-primary";
      primaryBadge.innerHTML = `<i class="${isTech ? 'fa-solid fa-wand-magic-sparkles' : 'fa-solid fa-tag'}"></i> ${isTech ? 'APARTADO ESPECIAL DEDICADO: ' : 'FUENTE PRINCIPAL: '} ${data.primarySource}`;
    }

    const secContainer = document.getElementById('secondarySourceContainer');
    if (secContainer) {
      secContainer.innerHTML = `<span><i class="fa-solid fa-link"></i> ${isTech ? 'Alimentado por:' : 'Fuentes Complementarias:'}</span>` + 
        data.secondarySources.map(s => `<span class="badge-pill badge-secondary">${s}</span>`).join('');
    }

    // Títulos y Storytelling Editorial
    const storyTag = document.getElementById('storyTag');
    const storyTitle = document.getElementById('storyTitle');
    const storyLead = document.getElementById('storyLead');
    const storyDesc = document.getElementById('storyDescription');
    const storyInsight = document.getElementById('storyInsight');
    const stepIndicator = document.getElementById('stepIndicator');
    const vizTitle = document.getElementById('vizTitle');

    if (storyTag) storyTag.innerHTML = `<i class="fa-solid fa-compass"></i> ${data.tag}`;
    if (storyTitle) storyTitle.innerHTML = data.storyTitle;
    if (storyLead) storyLead.innerHTML = data.storyLead || "";
    if (storyDesc) storyDesc.innerHTML = data.storyDesc;
    if (storyInsight) storyInsight.innerHTML = data.insight;
    if (stepIndicator) stepIndicator.innerText = `Capítulo ${step} de 9 • ${data.tabName}`;
    if (vizTitle) vizTitle.innerHTML = `<i class="fa-solid fa-compass-drafting" style="color: var(--accent-cyan);"></i> ${data.vizTitle}`;

    // Renderizar Story Beats Milestones Interactivos
    renderStoryBeats(data.storyBeats);

    // Renderizar KPIs Horizontalmente
    renderKpis(data.kpis);

    // Controles Contextuales
    setupContextualControls(step);

    // Limpiar estados de visualización previos
    if (charts) charts.destroyChart();
    if (forceGraph) forceGraph.stopForceGraph();
    if (threeVisuals) threeVisuals.stopThreeVisual();

    const chartCanvas = document.getElementById('vizChart');
    const threeContainer = document.getElementById('threejsContainer');
    const customSurface = document.getElementById('interactiveCustomSurface');
    const overlayStatus = document.getElementById('overlayStatus');

    if (data.vizType === '3d' || data.vizType === 'ar') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (customSurface) customSurface.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'block';
      if (overlayStatus) overlayStatus.innerText = data.vizType === '3d' ? "LiDAR 3D Mesh • WebGL con Control Orbital" : "Modo Holograma WebXR 3D Activo";
      if (threeVisuals) threeVisuals.initThreeDVisual(data.vizType);
    } else if (data.vizType === 'custom_map') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'flex';
      if (overlayStatus) overlayStatus.innerText = "Cartografía Interactiva GIS • Yucatán & Mérida";
      if (gisMap) gisMap.renderCustomGisMap();
    } else if (data.vizType === 'custom_force') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'flex';
      if (overlayStatus) overlayStatus.innerText = "Grafo Semántico Dinámico (Fuerzas y Co-ocurrencias)";
      if (forceGraph) forceGraph.renderForceGraph();
    } else {
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'none';
      if (chartCanvas) chartCanvas.style.display = 'block';
      if (overlayStatus) overlayStatus.innerText = "Visualización Interactiva Activa";
      if (charts) charts.renderChart(data);
    }

    const activeBtn = tabBtns[step - 1];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function updateJourneyArc(data) {
    const arc1 = document.getElementById('arcPill1');
    const arc2 = document.getElementById('arcPill2');
    const arc3 = document.getElementById('arcPill3');
    const arc4 = document.getElementById('arcPill4');

    if (!arc1) return;

    arc1.classList.toggle('active', data.number >= 1 && data.number <= 3);
    arc2.classList.toggle('active', data.number >= 4 && data.number <= 6);
    arc3.classList.toggle('active', data.number === 7);
    arc4.classList.toggle('active', data.number >= 8);
  }

  function renderStoryBeats(beats) {
    const container = document.getElementById('storyBeatsList');
    if (!container) return;

    if (!beats || beats.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = beats.map((beat, idx) => `
      <div class="story-beat-card ${idx === 0 ? 'active' : ''}" data-beat-id="${beat.id}" id="beatCard_${idx}">
        <div class="beat-header">
          <span class="beat-title">${beat.title}</span>
          <span class="beat-action-pill"><i class="fa-solid fa-bullseye"></i> ${beat.actionText}</span>
        </div>
        <p class="beat-desc">${beat.desc}</p>
      </div>
    `).join('');

    // Attach click triggers to beats
    beats.forEach((beat, idx) => {
      document.getElementById(`beatCard_${idx}`)?.addEventListener('click', () => {
        document.querySelectorAll('.story-beat-card').forEach(c => c.classList.remove('active'));
        document.getElementById(`beatCard_${idx}`)?.classList.add('active');
        handleBeatTrigger(beat);
      });
    });
  }

  function handleBeatTrigger(beat) {
    const gisMap = window.DataStoryApp.gisMap;
    const charts = window.DataStoryApp.charts;
    const viewsData = window.DataStoryApp.viewsData;
    const storytelling = window.DataStoryApp.storytelling;
    const threeVisuals = window.DataStoryApp.threeVisuals;

    if (beat.focusNode && gisMap) {
      gisMap.highlightNode(beat.focusNode);
    }
    if (beat.filterWave && charts && viewsData) {
      if (beat.filterWave === 'wave1') filterWaveData('wave1');
      else if (beat.filterWave === 'waveVac') filterWaveData('vac');
      else filterWaveData('all');
    }
    if (typeof beat.jurisIdx === 'number') {
      filterRadarSelection(beat.jurisIdx);
    }
    if (beat.id === 'beat8_1' && threeVisuals) threeVisuals.setLidarTheme('cyan');
    if (beat.id === 'beat8_2' && threeVisuals) threeVisuals.setLidarTheme('terrain');
    if (beat.id === 'beat9_2' && threeVisuals) threeVisuals.toggleSpikeExplosion();
    if (beat.id === 'beat9_3' && threeVisuals) alert("Escanea este modelo en tu móvil para proyectar en Realidad Aumentada sobre tu mesa.");

    if (storytelling) storytelling.showToast(`Paso seleccionado: ${beat.title}`);
  }

  function renderKpis(kpis) {
    const container = document.getElementById('kpiContainer');
    if (!container || !kpis) return;

    container.innerHTML = kpis.map(k => `
      <div class="kpi-block">
        <div class="kpi-icon-box" style="color: ${k.color};">
          <i class="fa-solid ${k.icon}"></i>
        </div>
        <div class="kpi-info-content">
          <span class="kpi-main-number">${k.value}</span>
          <span class="kpi-text-label">${k.label}</span>
          <span class="kpi-delta-pill"><i class="fa-solid fa-arrow-trend-up"></i> ${k.delta || "Dato verificado"}</span>
        </div>
      </div>
    `).join('');
  }

  function setupContextualControls(step) {
    const controls = document.getElementById('vizControls');
    if (!controls) return;

    const threeVisuals = window.DataStoryApp.threeVisuals;
    const forceGraph = window.DataStoryApp.forceGraph;

    if (step === 1) {
      controls.innerHTML = `
        <span>Modo Vista:</span>
        <button class="btn-filter-toggle active" id="btnGisView">Mapa GIS</button>
        <button class="btn-filter-toggle" id="btnChartView">Histograma</button>
        <button class="btn-action" id="btnRefreshViz"><i class="fa-solid fa-arrows-rotate"></i> Actualizar</button>
      `;
      document.getElementById('btnGisView')?.addEventListener('click', () => toggleGisOrChart(true));
      document.getElementById('btnChartView')?.addEventListener('click', () => toggleGisOrChart(false));
      document.getElementById('btnRefreshViz')?.addEventListener('click', () => refreshCurrentSimulation());
    } else if (step === 2) {
      controls.innerHTML = `
        <span>Fase:</span>
        <button class="btn-filter-toggle active" id="btnWaveAll">Todas</button>
        <button class="btn-filter-toggle" id="btnWaveVac">Post-Vacuna</button>
        <button class="btn-action" id="btnRefreshViz"><i class="fa-solid fa-sliders"></i> Simular Flujo</button>
      `;
      document.getElementById('btnWaveAll')?.addEventListener('click', () => filterWaveData('all'));
      document.getElementById('btnWaveVac')?.addEventListener('click', () => filterWaveData('vac'));
      document.getElementById('btnRefreshViz')?.addEventListener('click', () => refreshCurrentSimulation());
    } else if (step === 3) {
      controls.innerHTML = `
        <span>Jurisdicción:</span>
        <button class="btn-filter-toggle active" id="btnJ1">Mérida (J1)</button>
        <button class="btn-filter-toggle" id="btnJ2">Valladolid (J2)</button>
        <button class="btn-filter-toggle" id="btnJ3">Ticul (J3)</button>
      `;
      document.getElementById('btnJ1')?.addEventListener('click', () => filterRadarSelection(0));
      document.getElementById('btnJ2')?.addEventListener('click', () => filterRadarSelection(1));
      document.getElementById('btnJ3')?.addEventListener('click', () => filterRadarSelection(2));
    } else if (step === 6) {
      controls.innerHTML = `
        <button class="btn-action" id="btnScrambleForce"><i class="fa-solid fa-shuffle"></i> Repulsión Semántica</button>
      `;
      document.getElementById('btnScrambleForce')?.addEventListener('click', () => {
        if (forceGraph) forceGraph.scrambleForceNodes();
      });
    } else if (step === 8) {
      controls.innerHTML = `
        <span>Paleta LiDAR:</span>
        <button class="btn-filter-toggle active" id="btnLidarCyan">Cyberpunk</button>
        <button class="btn-filter-toggle" id="btnLidarTerrain">Topográfico</button>
        <button class="btn-action" id="btnResetCamera"><i class="fa-solid fa-camera-rotate"></i> Reset Cámara</button>
      `;
      document.getElementById('btnLidarCyan')?.addEventListener('click', (e) => {
        document.getElementById('btnLidarTerrain')?.classList.remove('active');
        e.target.classList.add('active');
        if (threeVisuals) threeVisuals.setLidarTheme('cyan');
      });
      document.getElementById('btnLidarTerrain')?.addEventListener('click', (e) => {
        document.getElementById('btnLidarCyan')?.classList.remove('active');
        e.target.classList.add('active');
        if (threeVisuals) threeVisuals.setLidarTheme('terrain');
      });
      document.getElementById('btnResetCamera')?.addEventListener('click', () => {
        if (threeVisuals) threeVisuals.resetThreeCamera();
      });
    } else if (step === 9) {
      controls.innerHTML = `
        <button class="btn-action" id="btnArQr"><i class="fa-solid fa-qrcode"></i> Abrir en Móvil AR</button>
        <button class="btn-filter-toggle active" id="btnSpikeExplode">Explosión Estructural</button>
      `;
      document.getElementById('btnArQr')?.addEventListener('click', () => {
        alert("Escanea este modelo en tu smartphone para proyectar en Realidad Aumentada (WebXR / QuickLook nativo).");
      });
      document.getElementById('btnSpikeExplode')?.addEventListener('click', () => {
        if (threeVisuals) threeVisuals.toggleSpikeExplosion();
      });
    } else {
      controls.innerHTML = `
        <button class="btn-action" id="btnRefreshViz"><i class="fa-solid fa-arrows-rotate"></i> Re-evaluar</button>
      `;
      document.getElementById('btnRefreshViz')?.addEventListener('click', () => refreshCurrentSimulation());
    }
  }

  function toggleGisOrChart(isGis) {
    const customSurface = document.getElementById('interactiveCustomSurface');
    const chartCanvas = document.getElementById('vizChart');
    const gisMap = window.DataStoryApp.gisMap;
    const charts = window.DataStoryApp.charts;
    const viewsData = window.DataStoryApp.viewsData;

    document.getElementById('btnGisView')?.classList.toggle('active', isGis);
    document.getElementById('btnChartView')?.classList.toggle('active', !isGis);
    if (isGis) {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (customSurface) customSurface.style.display = 'flex';
      if (gisMap) gisMap.renderCustomGisMap();
    } else {
      if (customSurface) customSurface.style.display = 'none';
      if (chartCanvas) chartCanvas.style.display = 'block';
      if (charts && viewsData) charts.renderChart(viewsData[1]);
    }
  }

  function filterWaveData(mode) {
    const viewsData = window.DataStoryApp.viewsData;
    const charts = window.DataStoryApp.charts;
    const storytelling = window.DataStoryApp.storytelling;
    const data = viewsData ? viewsData[2] : null;
    if (!data || !charts) return;

    if (mode === 'vac' || mode === 'waveVac') {
      data.chartData.labels = ['Ola 3 - Delta', 'Ola 4 - Ómicron (2022)', 'Fase Endémica (2023)'];
      data.chartData.datasets[0].data = [86.4, 96.8, 99.1];
      data.chartData.datasets[1].data = [88.0, 95.2, 98.0];
    } else if (mode === 'wave1') {
      data.chartData.labels = ['Ola 1 (2020)', 'Ola 2 (2021)'];
      data.chartData.datasets[0].data = [74.2, 79.8];
      data.chartData.datasets[1].data = [81.0, 83.5];
    } else {
      data.chartData.labels = ['Ola 1 (2020)', 'Ola 2 (2021)', 'Ola 3 - Delta', 'Ola 4 - Ómicron (2022)', 'Fase Endémica (2023)'];
      data.chartData.datasets[0].data = [74.2, 79.8, 86.4, 96.8, 99.1];
      data.chartData.datasets[1].data = [81.0, 83.5, 88.0, 95.2, 98.0];
    }
    charts.renderChart(data);
    if (storytelling) storytelling.showToast(mode === 'vac' ? "Filtrado a fase post-vacunación masiva" : "Actualizado filtro de olas");
  }

  function filterRadarSelection(jurisIdx) {
    const viewsData = window.DataStoryApp.viewsData;
    const charts = window.DataStoryApp.charts;
    const storytelling = window.DataStoryApp.storytelling;
    if (!viewsData || !charts) return;

    const data = JSON.parse(JSON.stringify(viewsData[3]));
    const dataset = data.chartData.datasets[jurisIdx];
    data.chartData.datasets = [dataset];
    charts.renderChart(data);
    if (storytelling) storytelling.showToast(`Enfocado en ${dataset.label}`);
  }

  function refreshCurrentSimulation() {
    const viewsData = window.DataStoryApp.viewsData;
    const charts = window.DataStoryApp.charts;
    const storytelling = window.DataStoryApp.storytelling;
    if (!viewsData || !charts) return;

    const data = viewsData[currentStep];
    charts.refreshChartData(data);
    if (storytelling) storytelling.showToast("Simulación de datos actualizada");
  }

  function navigateStep(direction) {
    let newStep = currentStep + direction;
    if (newStep < 1) newStep = 9;
    if (newStep > 9) newStep = 1;
    switchView(newStep);
  }

  function setupAppEvents() {
    const storytelling = window.DataStoryApp.storytelling;
    const viewsData = window.DataStoryApp.viewsData;

    // Journey Arc Steppers Click
    document.getElementById('arcPill1')?.addEventListener('click', () => switchView(1));
    document.getElementById('arcPill2')?.addEventListener('click', () => switchView(4));
    document.getElementById('arcPill3')?.addEventListener('click', () => switchView(7));
    document.getElementById('arcPill4')?.addEventListener('click', () => switchView(8));

    // Tabs navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => switchView(idx + 1));
    });

    // Footer Navigation Buttons
    document.getElementById('prevBtn')?.addEventListener('click', () => navigateStep(-1));
    document.getElementById('nextBtn')?.addEventListener('click', () => navigateStep(1));

    // Brand Header Click
    document.querySelector('.brand-container')?.addEventListener('click', () => switchView(1));

    // Auto-Tour Button
    document.getElementById('presBtn')?.addEventListener('click', () => {
      if (storytelling) storytelling.togglePresentationMode(() => navigateStep(1));
    });

    // Audio Narration Button
    document.getElementById('narrateBtn')?.addEventListener('click', () => {
      if (storytelling && viewsData) storytelling.toggleAudioNarration(viewsData[currentStep]);
    });

    // Methodology Modal Events
    document.getElementById('btnOpenMethodology')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.showModal();
    });
    document.getElementById('btnCloseMethodology')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.close();
    });
    document.getElementById('btnMethodologyUnderstood')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.close();
    });

    // Export Data JSON
    document.getElementById('btnExportData')?.addEventListener('click', () => {
      if (!viewsData) return;
      const data = viewsData[currentStep];
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `capitulo_${currentStep}_${data.tabName.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      if (storytelling) storytelling.showToast("Dataset JSON descargado exitosamente");
    });

    // Canvas Viewport Tools
    document.getElementById('btnSnapshot')?.addEventListener('click', () => {
      const chartCanvas = document.getElementById('vizChart');
      if (chartCanvas && chartCanvas.style.display !== 'none') {
        const image = chartCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `viz_capitulo_${currentStep}.png`;
        link.href = image;
        link.click();
        if (storytelling) storytelling.showToast("Captura de pantalla guardada");
      } else {
        if (storytelling) storytelling.showToast("Captura PNG disponible en vistas de gráficas");
      }
    });

    document.getElementById('btnFullscreen')?.addEventListener('click', () => {
      const wrapper = document.getElementById('canvasWrapper');
      if (!document.fullscreenElement) {
        wrapper?.requestFullscreen().catch(err => alert(err.message));
      } else {
        document.exitFullscreen();
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      const threeVisuals = window.DataStoryApp.threeVisuals;
      if (currentStep >= 8 && threeVisuals && viewsData) {
        threeVisuals.initThreeDVisual(viewsData[currentStep].vizType);
      }
    });
  }

  function setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') navigateStep(1);
      if (e.key === 'ArrowLeft') navigateStep(-1);
      if (e.key >= '1' && e.key <= '9') switchView(parseInt(e.key));
      if (e.key === 'm' || e.key === 'M') {
        const modal = document.getElementById('methodologyModal');
        if (modal?.open) modal.close();
        else modal?.showModal();
      }
    });
  }

  return {
    init,
    switchView,
    navigateStep
  };
})();

// Iniciar al cargar scripts
window.addEventListener('DOMContentLoaded', () => {
  if (window.DataStoryApp.app) {
    window.DataStoryApp.app.init();
  }
});
